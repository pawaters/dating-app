module.exports = function (app, pool, bcrypt, transporter, crypto) {
  //CREATE A USER IN SIGNUP
  app.post('/api/signup', async (request, response) => {

    // const validateSignupData = (body) => {

    // }

    const username = request.body.username
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const email = request.body.email
    const password = request.body.password

    const generateVerificationCode = async () => {
      const retrieveUserId = async () => {
        var sql = 'SELECT id FROM users WHERE username = $1;'
        const result = await pool.query(sql, [username])
        return result.rows[0]['id']
      }

      // Generating a code and checking for the very unlikely case that a similar code already exists in the table.
      while (true) {
        var code = crypto.randomBytes(20).toString('hex')
        var sql = 'SELECT * FROM email_verify WHERE verify_code = $1;'
        const result = await pool.query(sql, [code])
        if (result.rows.length < 1) {
          console.log('No duplicates found for the newly generated code in signup.')
          break
        } else {
          console.log('Found a duplicate for the newly generated code in signup. Proceeding to generate a new code.')
          continue
        }
      }

      retrieveUserId()
        .then((user_id) => {
          var sql = 'INSERT INTO email_verify (user_id, email, verify_code) VALUES ($1, $2, $3);'
          pool.query(sql, [user_id, email, code])
        }).catch(error => {
          console.log(error)
        })

      return (code)
    }

    const sendVerificationCodeByEmail = (email, username, code) => {

      var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Verify your email address for Matcha',
        html: `<p>Click the link below to verify your account for Matcha</p>
                    <a href="http://localhost:3000/confirm/${username}/${code}">Link</a>
                    <p>- Matcha team</p>`
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Something went wrong when trying to send email: ', error)
        } else {
          console.log('Email sent successfully: ' + info.response)
        }
      })
    }

    const hashPasswordAndSaveUser = async () => {
      const hash = await bcrypt.hash(password, 10)
      try {
        const newUser = await pool.query(
          'INSERT INTO users (username, firstname, lastname, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *',
          [username, firstname, lastname, email, hash]
        )
        sql = "INSERT INTO fame_rates (user_id) VALUES ($1)";
        await pool.query(sql, [newUser.rows[0]['id']])
        return
      } catch (error) {
        console.error("Something went wrong when trying to create a new user: ", error)
        throw ('Something went wrong when trying to create the new user. Please try again!')
      }
    }

    // if (validateSignupData(request.body) == -1) {
    // response.json('error')
    // }

    hashPasswordAndSaveUser()
      .then(() => generateVerificationCode())
      .then((code) => sendVerificationCodeByEmail(email, username, code))
      .then(() => {
        response.send(true)
      }).catch((error) => {
        response.send(error)
      })
  })

  app.post('/api/signup/verifyuser', async (request, response) => {
    const username = request.body.username
    const code = request.body.code

    const checkCodeValidity = async () => {
      var sql =
        `SELECT * FROM email_verify
                INNER JOIN users
                ON email_verify.user_id = users.id
                WHERE email_verify.code = $1;`
      const result = await pool.query(sql, [code])
      if (result.rows.length < 1) {
        throw ('Invalid code!')
      } else {
        return (true)
      }
    }

    const setAccountVerified = () => {
      var sql = 'UPDATE users SET verified = \'YES\' WHERE username = $1'
      pool.query(sql, [username])
      var sql = 'DELETE FROM email_verify WHERE verify_code = $1'
      pool.query(sql, [code])
    }

    checkCodeValidity()
      .then(() => {
        setAccountVerified()
        response.send(true)
      }).catch((error) => {
        response.send(error)
      })
  })

  // These ones below are for testing.
  // VIEW USERS CREATED IN SIGNUP
  app.get('/signup/users', async (request, response) => {

    try {
      const allUsers = await pool.query('SELECT * FROM users')
      response.json(allUsers.rows)
    } catch (err) {
      console.error(err.message)
    }
  })

  // GET A SPECIFIC SIGNED UP USER
  app.get('/signup/users/:id', async (request, response) => {
    try {
      const { id } = request.params
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])

      response.json(user.rows[0])
    } catch (err) {
      console.error(err.message)
    }
  })
}