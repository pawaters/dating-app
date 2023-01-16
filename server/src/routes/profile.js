module.exports = (app, pool) => {
    app.post('/api/profile/setup', async (request, response) => {
        var session = request.session

        const gender = request.body.gender
        const age = request.body.age
        const location = request.body.location
        const gps = request.body.gps
        const sexual_pref = request.body.sexual_pref
        const biography = request.body.biography
        const users_chosen_tags = request.body.tags

        // Validation for above values needs to be implemented here.

        try {
            await pool.query(
                `INSERT INTO user_settings (user_id, gender, age, user_location, sexual_pref, biography, ip_location)
                VALUES ($1, $2, $3, $4, $5, $6, point($7,$8))`,
                [session.userid, gender, age, location, sexual_pref, biography, gps[0], gps[1]])

            // We are removing the user from all the tags they didn't pick as their tags. This is useful in profile settings, but is this necessary in Onboarding?
            var sql = `UPDATE tags SET tagged_users = array_remove(tagged_users, $1)
                    WHERE (array[LOWER($2)] @> array[LOWER(tag_content)]::TEXT[]) IS NOT TRUE
                    RETURNING *;`
            await pool.query(sql, [session.userid, users_chosen_tags])

            // We will go through all of the tags that the user chose and see if they already exist in the table 'tags.'
            users_chosen_tags.map(async (tag_name) => {
                sql = `SELECT * FROM tags WHERE
                    LOWER(tag_content) = LOWER($1)`
                const tagAlreadyExistsCheck = await pool.query(sql, [tag_name])

                // If the tag doesn't exist i.e. it's a completely new tag, we insert it as a new row into the 'tags' table.
                if (tagAlreadyExistsCheck.rows.length < 1) {
                    sql = `INSERT INTO tags (tag_content, tagged_users)
                        VALUES ($1, $2);`
                    await pool.query(tag_name, session.userid)
                } else {
                    // If the tag is an existing tag, we insert the user_id into the tagged_users for the tag.
                    sql = `UPDATE tags SET tagged_users = array_append(tagged_users, $1)
                        WHERE LOWER(tag_content) = LOWER($2)
                        AND (tagged_users @> array[$1]::INT[]) IS NOT TRUE;`
                    await pool.query(sql, [session.userid, tag_name])
                }
            })
            response.send(true)
        } catch (error) {
            response.send('An error has occurred in Onboarding: ', error)
        }
    })

    app.get('/api/profile', async (request, response) => {
        console.log('Got to app.get(/api/profile')

        const session = request.session

        console.log('session.userid: ', session.userid)

        if (session.userid) {
            console.log('This one shows if (session.userid) is true in profile.js')
            try {
                var sql = `SELECT * FROM users
						INNER JOIN user_settings
                        ON users.id = user_settings.user_id
						WHERE users.id = $1`
                var result = await pool.query(sql, [session.userid])
                console.log('rows: ', result.rows)
                // Or SELECT [all but password] from users...
                console.log('rows[0] after sql: ', result.rows[0])
                const { password: censored, ...profileData } = result.rows[0]
                // const profileData = rows[0]
                sql = `SELECT * FROM tags
                        WHERE tagged_users @> array[$1]::INT[]
						ORDER BY tag_id`
				var tags_of_user = await pool.query(sql, [session.userid])
				profileData.tags = tags_of_user.rows.map(tag => tag.tag_content)

                console.log('profileData in profile.js: ', profileData)
                response.send(profileData)
            } catch (error) {
                console.error('catching error from profile.js: ', error)
                response.send(false)
            }
        } else {
            console.log('sending false from profile.js')
            response.send(false)
        }
    })
}