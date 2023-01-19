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
      await pool.query(
        `INSERT INTO user_settings (user_id, gender, age, user_location, sexual_pref, biography, ip_location)
                VALUES ($1, $2, $3, $4, $5, $6, point($7,$8))`,
        [session.userid, gender, age, location, sexual_pref, biography, gps[0], gps[1]])
      // Will be needed later in browsing.
      session.location = { x: Number(gps[0]), y: Number(gps[1]) }

      // Fame rates. Adjust later.
      sql = `UPDATE fame_rates SET setup_pts = setup_pts + 5, total_pts = total_pts + 5
				    WHERE user_id = $1 AND setup_pts < 5 AND total_pts <= 95`
      pool.query(sql, [session.userid])

      // We are removing the user from all the tags they didn't pick as their tags. This is useful in profile settings, but is this necessary in Onboarding?
      var sql = `UPDATE tags SET tagged_users = array_remove(tagged_users, $1)
                    WHERE (array[LOWER($2)] @> array[LOWER(tag_content)]::TEXT[]) IS NOT TRUE
                    RETURNING *;`
      const removed = await pool.query(sql, [session.userid, tags_of_user])
      console.log('removed.rows: ', removed.rows)

      // We go through all of the tags that the user chose and see if they already exist in the table 'tags.'
      // 'await Promise.all' ensures all of them are mapped before the code speeds on forward.
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

      // Fame rates. Adjust later.
      var tagPoints = tags_of_user.length
      if (tagPoints > 5)
        tagPoints = 5
      var sql = `UPDATE fame_rates SET total_pts = total_pts - tag_pts + $2, tag_pts = $2
							WHERE user_id = $1`
      await pool.query(sql, [session.userid, tagPoints])

      response.send(true)
    } catch (error) {
      response.send('An error has occurred in Onboarding: ', error)
    }
  })

  app.get('/api/profile', async (request, response) => {
    const session = request.session

    if (!session.userid) {
      console.log('sending false from app.get(\'/api/profile\'. User was not signed in.')
      response.send(false)
    }
    try {
      console.log('session.userid right before doing SQL query for getprofile',session.userid)
      // var sql = `SELECT id, username, firstname, lastname,
      // email, last_connection, verified, running_id,
      // user_settings.user_id, gender, age, sexual_pref,
      // biography, user_location, ip_location,
      // famerate_id, fame_rates.user_id, setup_pts
      // picture_pts, tag_pts, like_pts, connection_pts
      // total_pts
      // FROM users
      // INNER JOIN user_settings ON users.id = user_settings.user_id
      // LEFT JOIN fame_rates ON users.id = fame_rates.user_id
      // WHERE users.id = $1;`
      var sql = `SELECT * FROM users
						INNER JOIN user_settings ON users.id = user_settings.user_id
						LEFT JOIN fame_rates ON users.id = fame_rates.user_id
						WHERE users.id = $1`
      // YOU ARE HERE! Rows not working for some reason :/
      var { rows } = await pool.query(sql, [session.userid])
      console.log('rows: ', rows)
      console.log('rows[0]: ', rows[0])
      const profileData = rows[0]
      console.log('profileData: ', profileData)
      sql = `SELECT * FROM tags   
                    WHERE tagged_users @> array[$1]::INT[]
					ORDER BY tag_id ASC;`
      var tags_of_user = await pool.query(sql, [session.userid])
      profileData.tags = tags_of_user.rows.map(tag => tag.tag_content)

      // Profile pic and other pics' retrieval below:
      sql = `SELECT * FROM user_images
                    WHERE user_id = $1
                    AND profile_pic = $2;`
      const profile_pic = await pool.query(sql, [session.userid, true])

      if (profile_pic.rows[0]) {
        profileData.profile_pic = profile_pic.rows[0]
        console.log('profileData.profile_pic: ', profileData.profile_pic)
      } else {
        console.log('profile pic NOT found.')
        profileData.profile_pic = { user_id: session.userid, picture_data: null }
      }

      sql = `SELECT * FROM user_images
                    WHERE user_id = $1
                    AND profile_pic = $2
                    ORDER BY image_id ASC;`
      const other_pics = await pool.query(sql, [session.userid, false])
      if (other_pics.rows) {
        profileData.other_pictures = other_pics.rows
      }

      // Likes and watches
      sql = `SELECT target_id, username
					FROM likes INNER JOIN users on likes.target_id = users.id
					WHERE liker_id = $1
					GROUP BY target_id, username`
      const liked = await pool.query(sql, [session.userid])
      profileData.liked = liked.rows

      sql = `SELECT watcher_id, username
					FROM watches INNER JOIN users on watches.watcher_id = users.id
					WHERE target_id = $1
					GROUP BY watcher_id, username`
      const watchers = await pool.query(sql, [session.userid])
      profileData.watchers = watchers.rows

      sql = `SELECT liker_id, username
					FROM likes INNER JOIN users on likes.liker_id = users.id
					WHERE target_id = $1
					GROUP BY liker_id, username`
      const likers = await pool.query(sql, [session.userid])
      profileData.likers = likers.rows

      console.log('profileData JUST BEFORE RESPONSE.SEND : ', profileData)
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

      // Needed for browsing.
      session.location = { x: Number(gps_lat), y: Number(gps_lon) }
      // Deleting user from tags that they have not chosen when editing their settings.
      var sql = `UPDATE tags SET tagged_users = array_remove(tagged_users, $1)
				    WHERE (array[LOWER($2)] @> array[LOWER(tag_content)]::TEXT[]) IS NOT TRUE`
      await pool.query(sql, [session.userid, tags_of_user])

      // Deleting tags that no user is currently using.
      sql = 'DELETE FROM tags WHERE cardinality(tagged_users) = 0'
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

      // Fame rates. Adjust later.
      var tagPoints = tags_of_user.length
      if (tagPoints > 5)
        tagPoints = 5
      sql = `UPDATE fame_rates SET total_pts = total_pts - tag_pts + $2, tag_pts = $2
							WHERE user_id = $1`
      await pool.query(sql, [session.userid, tagPoints])
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
      response.send('The maximum size for uploaded images is 5 megabytes.')
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

        // Fame rates. Adjust later.
        sql = `UPDATE fame_rates SET picture_pts = picture_pts + 2, total_pts = total_pts + 2
					    WHERE user_id = $1 AND picture_pts < 10 AND total_pts <= 98`
        await pool.query(sql, [session.userid])
      } else {
        let oldImageData = profilePic.rows[0]['picture_data']
        // path.resolve gets the absolute path of '../images'
        const oldImage = path.resolve(__dirname, '../images') + oldImageData.replace('http://localhost:3000/images', '')
        // fs.existsSync checks if the image already exists, so if there is already an image with same name
        // in the /images folder
        console.log('Did the first part of else.')
        if (fs.existsSync(oldImage)) {
          console.log('Went to fs.existSync')
          // If it is, we remove it with fs.unlink
          fs.unlink(oldImage, (error) => {
            console.log('called fs.unlink on: ', oldImage)
            if (error) {
              console.error('fs.unlink failed: ', error)
              return
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
      response.send('Something went wrong when trying to upload the image.')
    }
  })

  app.post('/api/profile/imageupload', upload.single('file'), async (request, response) => {
    const session = request.session
    const picture = 'http://localhost:3000/images/' + request.file.filename
    if (!session.userid) {
      response.send('Error in app.post(\'/api/profile/imageupload\'. User was not signed in.')
    }
    if (request.file.size > 5242880) {
      response.send('The maximum size for uploaded images is 5 megabytes.')
    }
    try {
      var sql = `SELECT * FROM user_images
                    WHERE user_id = $1;`
      const number_of_images = await pool.query(sql, [session.userid])
      if (number_of_images.rows.length < 5) {
        sql = `INSERT INTO user_images (user_id, picture_data, profile_pic)
                        VALUES ($1, $2, $3);`
        await pool.query(sql, [session.userid, picture, false])
        sql = `UPDATE fame_rates SET picture_pts = picture_pts + 2, total_pts = total_pts + 2
					    WHERE user_id = $1 AND picture_pts < 10 AND total_pts <= 98`

        //Fame rates. Adjust later.
        await pool.query(sql, [session.userid])
        response.send(true)
      } else {
        response.send('Your profile can have a maximum of five (5) pictures. Delete a picture to make room for more.')
      }
    } catch (error) {
      console.error(error)
      response.send('Something went wrong when trying to upload the image.')
    }
  })
}