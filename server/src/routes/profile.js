module.exports = (app, pool) => {
    app.post('/api/profile/setup', async (request, response) => {
        var session = request.session

        const gender = request.body.gender
        const age = request.body.age
        const location = request.body.location
        const gps = request.body.gps
        const sexual_pref = request.body.sexual_pref
        const biography = request.body.biography

        // Validation for above values needs to be implemented here.

        try {
            await pool.query(
                `INSERT INTO user_settings
            (user_id, gender, age, user_location, sexual_pref, biography, ip_location)
            VALUES ($1, $2, $3, $4, $5, $6, point($7,$8))`,
                [session.userid, gender, age, location, sexual_pref, biography, gps[0], gps[1]])
            response.send(true)
        } catch (error) {
            response.send(error)
        }
    })

    app.get('/api/profile', async (request, response) => {
        console.log('Got this far')

        const session = request.session

        console.log('session: ', session)
        console.log('session.userid: ', session.userid)

        if (session.userid) {
            console.log('This one shows if (session.userid) is true in profile.js')
            try {
                var sql = `SELECT * FROM users
						INNER JOIN user_settings
                        ON users.id = user_settings.user_id
						WHERE users.id = $1`
                var { rows } = await pool.query(sql, [session.userid])
                // Or SELECT [all but password] from users...
                console.log('rows[0] after sql: ', rows[0])
                // const { password: censored, ...profileData } = rows[0]
                const profileData = rows[0]
                console.log('profileData: ', profileData)
                response.send(profileData)
            } catch (error) {
                console.log('catching error from profile.js')
                response.send(false)
            }
        } else {
            console.log('sending false from profile.js')
            response.send(false)
        }
    })
}