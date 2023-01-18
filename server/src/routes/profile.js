module.exports = (app, pool, upload, fs, path) => {
    app.post('/api/profile/setup', async (request, response) => {
        var session = request.session

        const gender = request.body.gender
        const age = request.body.age
        const location = request.body.location
        const gps = request.body.gps
        const sexual_pref = request.body.sexual_pref
        const biography = request.body.biography
        const tags_of_user = request.body.tags

        // Validation for above values needs to be implemented here.

        try {
            // We do the below last, because we want profileData.id to be false/undefined
            // until all the SQL above has run.
            await pool.query(
                `INSERT INTO user_settings (user_id, gender, age, user_location, sexual_pref, biography, ip_location)
                VALUES ($1, $2, $3, $4, $5, $6, point($7,$8))`,
                [session.userid, gender, age, location, sexual_pref, biography, gps[0], gps[1]])

            // We are removing the user from all the tags they didn't pick as their tags. This is useful in profile settings, but is this necessary in Onboarding?
            var sql = `UPDATE tags SET tagged_users = array_remove(tagged_users, $1)
                    WHERE (array[LOWER($2)] @> array[LOWER(tag_content)]::TEXT[]) IS NOT TRUE
                    RETURNING *;`
            const removed = await pool.query(sql, [session.userid, tags_of_user])
            console.log('removed.rows: ', removed.rows)
            console.log('tags_of_user: ', tags_of_user)

            // We go through all of the tags that the user chose and see if they already exist in the table 'tags.'
            await Promise.all(tags_of_user.map(async (tag_name) => {
                sql = `SELECT * FROM tags
                WHERE LOWER(tag_content) = LOWER($1)`
                const tagAlreadyExistsCheck = await pool.query(sql, [tag_name])

                // If the tag doesn't exist i.e. it's a completely new tag, we insert it as a new row into the 'tags' table.
                if (tagAlreadyExistsCheck.rows.length < 1) {
                    sql = `INSERT INTO tags (tag_content, tagged_users)
                        VALUES (LOWER($1), array[$2]::INT[]);`
                    await pool.query(sql, [tag_name, session.userid])
                    console.log('User created a new tag!: ', tag_name)
                } else {
                    // If the tag is an existing tag, we insert the user_id into the tagged_users for the tag.
                    // We check again that the tag exists and that the user is not already in that tag.
                    sql = `UPDATE tags SET tagged_users = array_append(tagged_users, $1)
                        WHERE LOWER(tag_content) = LOWER($2)
                        AND (tagged_users @> array[$1]::INT[]) IS NOT TRUE;`
                    await pool.query(sql, [session.userid, tag_name])
                    console.log('User chose an existing tag: ', tag_name)
                }
            }))
            response.send(true)
        } catch (error) {
            response.send('An error has occurred in Onboarding: ', error)
        }
    })

    app.get('/api/profile', async (request, response) => {
        console.log('Got to app.get(/api/profile')

        const session = request.session

        console.log('session.userid: ', session.userid)

        if (!session.userid) {
            console.log('sending false from app.get(\'/api/profile\'. User was not signed in.')
            response.send(false)
        }
        console.log('This one shows if (session.userid) is true in profile.js')
        try {
            var sql = `SELECT id, username, firstname, lastname,
                        email, last_connection, verified, running_id,
                        user_id, gender, age, sexual_pref,
                        biography, fame_rating, user_location, ip_location
                        FROM users
						INNER JOIN user_settings
                        ON users.id = user_settings.user_id
						WHERE users.id = $1`
            var result = await pool.query(sql, [session.userid])
            // Or SELECT [all but password] from users...
            // console.log('rows[0] after sql: ', result.rows[0])
            const profileData = result.rows[0]
            // const profileData = rows[0]
            sql = `SELECT * FROM tags
                    WHERE tagged_users @> array[$1]::INT[]
					ORDER BY tag_id ASC`
            var tags_of_user = await pool.query(sql, [session.userid])
            profileData.tags = tags_of_user.rows.map(tag => tag.tag_content)

            // Profile pic stuff goes here:
            sql = `SELECT * FROM user_images
                    WHERE user_id = $1
                    AND profile_pic = $2`
            const profile_pic = await pool.query(sql, [session.userid, true])

            if (profile_pic.rows[0]) {
                console.log('profile pic found in backend.')
                console.log('profile_pic.rows[0]: ', profile_pic.rows[0])
                profileData.profile_pic = profile_pic.rows[0]
                console.log('profileData.profile_pic: ', profileData.profile_pic)
            } else {
                console.log('profile pic NOT found.')
                profileData.profile_pic = { user_id: session.userid, picture_data: null }
            }

            sql = `SELECT * FROM user_images
                    WHERE user_id = $1
                    AND profile_pic = $2
                    ORDER BY picture_id ASC`
            const other_pictures = await pool.query(sql, [session.userid, false])
            if (other_pictures.rows) {
                profileData.other_pictures = other_pictures.rows
            }

            console.log('profileData in profile.js: ', profileData)
            response.send(profileData)
        } catch (error) {
            console.error('catching error from profile.js: ', error)
            response.send(false)
        }
    })

    app.post('/api/profile/editsettings', async (request, response) => {
        const session = request.session

        const username = request.body.username
        const firstname = request.body.firstname
        const lastname = request.body.lastname
        const email = request.body.email
        const gender = request.body.gender
        const age = request.body.age
        const location = request.body.location
        const gps_lat = request.body.gps_lat
        const gps_lon = request.body.gps_lon
        const sexual_pref = request.body.sexual_pref
        const biography = request.body.biography
        const tags_of_user = request.body.tags

        if (!session.userid) {
            console.log('sending false from app.post(\'/api/profile/editsettings\'. User was not signed in.')
            response.send(false)
        }
        try {
            await pool.query(
                `UPDATE user_settings
                SET gender = $1, age = $2, user_location = $3, sexual_pref = $4,
                biography = $5, ip_location = point($6,$7)
                WHERE user_id = $8`,
                [gender, age, location, sexual_pref, biography, gps_lat, gps_lon, session.userid])

            await pool.query(
                `UPDATE users
                SET username = $1, firstname = $2, lastname = $3, email = $4
                WHERE id = $5`,
                [username, firstname, lastname, email, session.userid])

            // Deleting user from tags that they have not chosen when editing their settings.
            var sql = `UPDATE tags SET tagged_users = array_remove(tagged_users, $1)
				    WHERE (array[LOWER($2)] @> array[LOWER(tag_content)]::TEXT[]) IS NOT TRUE`
            await pool.query(sql, [session.userid, tags_of_user])

            // Deleting tags that no user is currently using.
            sql = `DELETE FROM tags WHERE cardinality(tagged_users) = 0`
            await pool.query(sql)

            // We go through all of the tags that the user chose and see if they already exist in the table 'tags.'
            await Promise.all(tags_of_user.map(async (tag_name) => {
                sql = `SELECT * FROM tags
                    WHERE LOWER(tag_content) = LOWER($1)`
                const tagAlreadyExistsCheck = await pool.query(sql, [tag_name])
                // If the tag doesn't exist i.e. it is a completely new tag, we insert it as a new row into the 'tags' table.
                if (tagAlreadyExistsCheck.rows.length < 1) {
                    sql = `INSERT INTO tags (tag_content, tagged_users)
                        VALUES (LOWER($1), array[$2]::INT[]);`
                    await pool.query(sql, [tag_name, session.userid])
                    console.log('User created a new tag!: ', tag_name)
                } else {
                    // If the tag is an existing tag, we insert the user_id into the tagged_users for the tag.
                    // We check again that the tag exists and that the user is not already in that tag.
                    sql = `UPDATE tags SET tagged_users = array_append(tagged_users, $1)
                        WHERE LOWER(tag_content) = LOWER($2)
                        AND (tagged_users @> array[$1]::INT[]) IS NOT TRUE;`
                    await pool.query(sql, [session.userid, tag_name])
                    console.log('User chose an existing tag: ', tag_name)
                }
            }))
            response.send(true)
        } catch (error) {
            console.error(error)
            response.send('Something went wrong when trying to update user\'s settings.')
        }
    })

    app.post('/api/profile/setprofilepic', upload.single('file'), async (request, response) => {
        const session = request.session
        const picture = 'http://localhost:3000/images/' + request.file.filename
        if (!session.userid) {
            response.send('Error in app.post(\'/api/profile/setprofilepic\'. User was not signed in.')
        }
        if (request.file.size > 5242880) {
            response.send("The maximum size for uploaded images is 5 megabytes.")
        }
        try {
            var sql = `SELECT * FROM user_images
                    WHERE user_id = $1
                    AND profile_pic = $2;`
            const profilePic = await pool.query(sql, [session.userid, true])
            // We check for an existing profile picture.
            if (profilePic.rows.length === 0) {
                sql = `INSERT INTO user_images (user_id, picture_data, profile_pic)
                        VALUES ($1, $2, $3);`
                await pool.query(sql, [session.userid, picture, true])
                console.log('session.userid: ', session.userid)
                // fame rate update goes here.
            } else {
                let oldImageData = profilePic.rows[0]['picture_data']
                // path.resolve gets the absolute path of '../images'
                const oldImage = path.resolve(__dirname, '../images') + oldImageData.replace('http://localhost:3000/images', '');
                // fs.existsSync checks if the image already exists, so if there is already an image with same name
                // in the /images folder
                console.log('Did the first part of else.')
                if (fs.existsSync(oldImage)) {
                    console.log('Went to fs.existSync')
                    // If it is, we remove it with fs.unlink
                    fs.unlink(oldImage, (error) => {
                        console.log('called fs.unlink on: ', oldImage)
                        if (error) {
                            console.error('fs.unlink failed: ', error);
                            return;
                        }
                    })
                }
                // We set the profile picture
                sql = `UPDATE user_images SET picture_data = $1
                        WHERE user_id = $2
                        AND profile_pic = $3`
                await pool.query(sql, [picture, session.userid, true])
            }
            response.send(true)
        } catch (error) {
            console.error(error)
            response.send("Something went wrong when trying to upload the image.")
        }
    })

    app.post('/api/profile/imageupload', upload.single('file'), async (request, response) => {
        const session = request.session
        const picture = 'http://localhost:3000/images/' + request.file.filename
        if (!session.userid) {
            response.send('Error in app.post(\'/api/profile/imageupload\'. User was not signed in.')
        }
        if (request.file.size > 5242880) {
            response.send("The maximum size for uploaded images is 5 megabytes.")
        }
        try {
            var sql = `SELECT * FROM user_images
                    WHERE user_id = $1;`
            const number_of_images = await pool.query(sql, [session.userid])
            if (number_of_images.rows.length < 5) {
                sql = `INSERT INTO user_images (user_id, picture_data, profile_pic)
                        VALUES ($1, $2, $3);`
                await pool.query(sql, [session.userid, picture, false])
                response.send(true)
            } else {
                response.send('Your profile can have a maximum of five (5) pictures. Delete a picture to make room for more.')
            }
        } catch (error) {
            console.error(error)
            response.send("Something went wrong when trying to upload the image.")
        }
    })
}