module.exports = function (app, pool, bcrypt, transporter, crypto) {
    app.post('/api/resetpassword', (request, response) => {
        const { resetvalue } = request.body
        const checkForUserId = async () => {
            var sql = "SELECT id, username, email FROM users WHERE email = $1"
            const { rows } = await pool.query(sql, [resetvalue])
            if (rows.length === 0) {
                throw ("User with the given details does not exist!")
            } else {
                return (rows)
            }
        }

        const generateResetCode = async (rows) => {

            const username = rows[0]['username']
            const email = rows[0]['email']

            // Generating a code and checking for the very unlikely case that a similar code already exists in the table.
            while (true) {
                var reset_code = crypto.randomBytes(20).toString('hex')
                var sql = 'SELECT * FROM password_reset WHERE reset_code = $1;'
                const result = await pool.query(sql, [reset_code])

                if (result.rows.length < 1) {
                    console.log('No duplicates found for the newly generated code in resetpassword.')
                    break
                } else {
                    console.log('Found a duplicate for the newly generated code in resetpassword. Proceeding to generate a new code.')
                    continue
                }
            }

            try {
                var sql = `INSERT INTO password_reset (user_id, reset_code, expire_time)
                            VALUES ($1, $2, (CURRENT_TIMESTAMP + interval '6 hours'))`;
                await pool.query(sql, [rows[0]['id'], reset_code])
                const paramsForMail = { username: username, email: email, reset_code: reset_code }
                return (paramsForMail)
            } catch (error) {
                throw (error)
            }
        }

        const sendResetMail = async (paramsForMail) => {
            var mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: paramsForMail.email,
                subject: 'Here is the link to reset your password',
                html: `<p>Click the link below to reset your password.</p>
                        <a href="http://localhost:3000/resetpassword/${paramsForMail.username}/${paramsForMail.reset_code}">Link</a>
                        <p>- Matcha team</p>`
            }
            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent successfully: ' + info.response)
                }
            })
            return
        }

        checkForUserId()
            .then(rows => generateResetCode(rows))
            .then(paramsForMail => sendResetMail(paramsForMail))
            .then(() => {
                response.send(true)
            }).catch((error) => {
                response.send(error)
            })
    })

    app.post('/api/setnewpassword', async (request, response) => {
        const { user, code, password, confirmPassword } = request.body

        if (password !== confirmPassword) {
            return response.send("The entered passwords are not the same!")
        }
        else if (!password.match(/(?=^.{8,30}$)(?=.*\d)(?=.*[!.@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$/)) {
            return response.send("Please ensure your password has a length between 8 and 30 characters, contains one lowercase character (a-z), one uppercase character (A-Z), one numeric character (0-9), and one special character (!.@#$%^&*).")
        }
        else {
            var sql = `SELECT * FROM password_reset
						INNER JOIN users ON password_reset.user_id = users.id
						WHERE users.username = $1
                        AND password_reset.reset_code = $2`
            const { rows } = await pool.query(sql, [user, code])
            if (rows.length === 0) {
                response.send("Password reset code not found!")
            } else {
                const hash = await bcrypt.hash(password, 10);
                var sql = "UPDATE users SET password = $1 WHERE username = $2"
                await pool.query(sql, [hash, user])
                var sql = "DELETE FROM password_reset WHERE user_id = $1"
                await pool.query(sql, [rows[0]['id']])
                response.send(true)
            }
        }
    })
}