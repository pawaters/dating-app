module.exports = function (app, pool, bcrypt) {

    app.post('/api/login', async (request, response) => {

        const userName = request.body.username
        const password = request.body.password

        console.log('userName', userName)

        const verifyLoginAttempt = async () => {
            // To ponder: do we actually need to join users with user_settings because at this point we just need created accounts?
            const user = await pool.query(
                `SELECT * FROM users
                LEFT JOIN user_settings
                ON users.id = user_settings.user_id
                WHERE username = $1`,
                [userName]
            )
            console.log('User data here to the right: ', user)
            console.log('User.rows[0] data here to the right: ', user.rows[0])
            if (user.rows.length === 0) {
                console.log('User not found')
                throw ('Wrong username/password combination.')
            } else {
                const comparePasswords = await bcrypt.compare(password, user.rows[0]['password'])
                if (comparePasswords) {
                    console.log('Auth success!')
                    var session = request.session
                    session.userid = user.rows[0]['id']
                    session.username = user.rows[0]['username']
                    console.log('session after defining userid and username: ', session)
                    return session
                } else {
                    console.log('Auth fail!')
                    throw ('Wrong username/password combination!')
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
        console.log('session right before logout: ', request.session)
        request.session.destroy(error => {
            if (error) {
                return console.log(error)
            }
            console.log('session after logout: ', request.session)
            // The End method causes the Web server to stop processing the script and return the current result.
            response.end()
        });
    });
}