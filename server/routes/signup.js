module.exports = function (app, pool, bcrypt, transporter, crypto) {
  //CREATE A USER IN SIGNUP
  app.post('/api/signup', async (request, response) => {

    const username = request.body.username
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const email = request.body.email
    const password = request.body.password
    const confirmPassword = request.body.confirmPassword

    const validateSignupData = (username, firstname, lastname, email, password, confirmPassword) => {

      const validateCharacters = async () => {
        if (username.length < 4 || username.length > 25) {
          throw ("Username has to be between 4 and 25 characters.")
        }
        if (!username.match(/^[a-z0-9]+$/i))
          throw ("Username should only include alphabetical characters (a to z and/or A to Z) and numbers (0 to 9).")
        if (firstname.length > 50 || lastname.length > 50 || firstname.length < 1 || lastname.length < 1)
          throw ("Maximum length for first name and last name is 50 characters. Minimum length is 1 character.")
        if (!firstname.match(/^[a-zåäö-]+$/i) || !lastname.match(/^[a-zåäö-]+$/i))
          throw ("First name and last name can only include characters a to z, å, ä, ö, and hyphen (-).")
        if (email.length > 254 || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
          throw ("Please enter a valid e-mail address.")
        if (!password.match(/(?=^.{8,30}$)(?=.*\d)(?=.*[!.@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$/)) {
          throw (`Please enter a password with a length between 8 and 30 characters, 
                  at least one lowercase alphabetical character (a to z), 
                  at least one uppercase alphabetical character (A to Z), 
                  at least one numeric character (0 to 9), 
                  and at least one special character (!.@#$%^&*)`)
        }
        if (password !== confirmPassword)
          throw ("The entered passwords are not the same!")
        return
      }

      const checkUsername = async () => {
        var sql = "SELECT * FROM users WHERE username = $1";
        const { rows } = await pool.query(sql, [username])
        if (rows.length) {
          throw ("Username already exists! Choose a different username")
        } else
          return
      }

      const checkEmail = async () => {
        var sql = "SELECT * FROM users WHERE email = $1";
        const { rows } = await pool.query(sql, [email])
        if (rows.length) {
          throw ("User with this e-mail already exists! Choose a different email address.")
        } else {
          return
        }
      }

      return (
        validateCharacters()
          .then(() => checkUsername())
          .then(() => checkEmail())
          .then(() => {
            return (true)
          }).catch((error) => {
            return (error)
          })
      )
    }

    const signupValidationResult = await validateSignupData(username, firstname, lastname, email, password, confirmPassword)

    if (signupValidationResult === true) {
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
            console.log('No duplicates found for the newly generated verification code in signup.')
            break
          } else {
            console.log('Found a duplicate for the newly generated verification code in signup. Proceeding to generate a new code.')
            continue
          }
        }

        retrieveUserId()
          .then((user_id) => {
            var sql = 'INSERT INTO email_verify (user_id, email, verify_code) VALUES ($1, $2, $3);'
            pool.query(sql, [user_id, email, code])
          }).catch(error => {
            console.error('Error in signup: ', error)
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
    } else {
      response.send(signupValidationResult)
    }
  })

  app.post('/api/signup/verifyuser', async (request, response) => {
    const username = request.body.username
    const code = request.body.code

    const checkCodeValidity = async () => {
      var sql =
        `SELECT * FROM email_verify
          INNER JOIN users
          ON email_verify.user_id = users.id
          WHERE email_verify.verify_code = $1;`
      const result = await pool.query(sql, [code])
      if (result.rows.length < 1) {
        console.error('Verification failed.')
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
}