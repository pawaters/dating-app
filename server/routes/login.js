module.exports = function (app, pool, bcrypt) {
  app.post('/api/login', async (request, response) => {

    const username = request.body.username
    const password = request.body.password

    const verifyLoginAttempt = async () => {
      const userInfo = await pool.query(
        `SELECT * FROM users
        LEFT JOIN user_settings
        ON users.id = user_settings.user_id
        WHERE username = $1
        OR email = $1`,
        [username]
      )
      if (userInfo.rows.length === 0) {
        console.log('User not found')
        throw ('Wrong login details!')
      } else if (userInfo.rows[0]['verified'] === 'NO') {
        console.log('Account not yet verified')
        throw ('Please check your email and verify your account before trying to log in!')
      } else {
        const comparePasswords = await bcrypt.compare(password, userInfo.rows[0]['password'])
        if (comparePasswords) {
          console.log('Auth success!')
          var session = request.session
          session.userid = userInfo.rows[0]['id']
          session.username = userInfo.rows[0]['username']
          session.location = userInfo.rows[0]['ip_location']
          return session
        } else {
          console.log('Auth fail!')
          throw ('Wrong login details!')
        }
      }
    }

    verifyLoginAttempt()
      .then(session => {
        response.send(session)
      }).catch(error => {
        response.send(error)
      })
  })

  app.get('/api/login', (request, response) => {
    var session = request.session
    if (session.username && session.userid)
      response.send({ name: session.username, id: session.userid })
    else
      response.send('')
  })

  app.get('/api/logout', (request, response) => {
    request.session.destroy(error => {
      if (error) {
        return console.log(error)
      }
      // The End method causes the web server to stop processing the script and returns the current result.
      response.end()
    })
  })
}