module.exports = function (app, pool, bcrypt) {
    //CREATE A USER IN SIGNUP
    app.post('/api/signup', async (request, response) => {

        const userName = request.body.username
        const firstName = request.body.firstname
        const lastName = request.body.lastname
        const email = request.body.email
        const password = request.body.password

        const hashPasswordAndSave = async () => {
            const hash = await bcrypt.hash(password, 10);
            try {
                const newUser = await pool.query(
                    'INSERT INTO users (username, firstname, lastname, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *',
                    [userName, firstName, lastName, email, hash]
                )
                // Look into replacing with just return
                response.json(newUser.rows[0])
            } catch (err) {
                console.error(err.message)
            }
        }

        hashPasswordAndSave()
    })

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