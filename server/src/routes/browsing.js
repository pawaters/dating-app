module.exports = (app, pool) => {
  app.get('/api/browsing/tags', async (request, response) => {
    try {
      var sql = 'SELECT tag_content FROM tags ORDER BY tag_id ASC;'
      const result = await pool.query(sql)
      response.send(result.rows)
    } catch (error) {
      console.error('catching error from browsing.js')
      response.send(false)
    }
  })

  app.post('/api/browsing/sorted', async (request, response) => {
    const session = request.session

    const min_age = request.body.min_age
    const max_age = request.body.max_age
    const min_fame = request.body.min_fame
    const max_fame = request.body.max_fame
    const min_distance = request.body.min_distance
    const max_distance = request.body.max_distance

    console.log('session.userid: ', session.userid)
    console.log('session.location: ', session.location)

    if (session.userid && session.location) {
      try {
        var sql = `SELECT id, username, firstname, lastname, gender, age,
                  sexual_pref, biography, total_pts AS fame_rating, user_location,
                  picture_data AS profile_pic, blocker_id, target_id,
						      calculate_distance($6, $7, ip_location[0], ip_location[1], 'K') AS distance,
						      (SELECT COUNT(*) FROM tags WHERE tagged_users @> array[$1, users.id]) AS common_tags
						      FROM users
						      INNER JOIN user_settings ON users.id = user_settings.user_id
						      INNER JOIN fame_rates ON users.id = fame_rates.user_id
						      LEFT JOIN user_images ON users.id = user_images.user_id
                    AND user_images.profile_pic = $10
						      LEFT JOIN blocks ON (users.id = blocks.target_id
                    AND blocks.blocker_id = $1)
                    OR (users.id = blocks.blocker_id AND blocks.target_id = $1)
						      WHERE users.id != $1
                  AND users.verified = $10
                  AND blocker_id IS NULL AND target_id IS NULL
						      AND age BETWEEN $2 and $3 AND total_pts BETWEEN $4 and $5
						      AND calculate_distance($6, $7, ip_location[0], ip_location[1], 'K') BETWEEN $8 and $9
						      ORDER BY username ASC;`
        var { rows } =
          await pool.query(sql, [session.userid, min_age, max_age, min_fame, max_fame,
          session.location.x, session.location.y, min_distance, max_distance, true])

        // Check rows if not working.
        console.log('Made it here.')

        const doTags = async (rows) => {
          for (let i = 0; i < rows.length; i++) {
            var sql = `SELECT tag_content FROM tags WHERE tagged_users @> array[$1]::INT[]`
            var { rows: tags } = await pool.query(sql, [rows[i].id])
            for (let j = 0; j < tags.length; j++) {
              tags[j] = tags[j].tag_content
            }
            rows[i].tags = tags
          }
          return (rows)
        }
        doTags(rows)
          .then((rows) => {
            console.log('rows in browsing/sorted: ', rows)
            response.send(rows)
          })
        // for (let i = 0; i < sortingFilter.rows.length; i++) {
        //   var sql = `SELECT tag_content FROM tags WHERE tagged_users @> array[$1]::INT[]`
        //   sortingFilter.tags = await pool.query(sql, [sortingFilter.rows[i].id])
        //   for (let j = 0; j < tags.length; j++) {
        //     tags[j] = tags[j].tag_content
        //   }
        //   sortingFilter.rows[i].tags = tags
        // }
        // response.send(sortingFilter.rows)
      } catch (error) {
        response.send("Fetching users failed")
      }
    }
  })


  app.get('/api/browsing/userlists', async (request, response) => {
    const session = request.session
    if (session.userid) {
      var sql = `SELECT target_id FROM likes WHERE liker_id = $1`
      const likedusers = await pool.query(sql, [session.userid])
      const likedUserIds = likedusers.rows.map(user => user.target_id)

      var sql = `SELECT user2_id FROM connections WHERE user1_id = $1`
      var results1 = await pool.query(sql, [session.userid])
      var sql = `SELECT user1_id FROM connections WHERE user2_id = $1`
      var results2 = await pool.query(sql, [session.userid])
      const connectedusers = results1.rows.concat(results2.rows)
      const connectedUserIds = connectedusers.map(result => {
        if (result.user1_id)
          return (result.user1_id)
        else if (result.user2_id)
          return (result.user2_id)
      })

      var sql = `SELECT target_id FROM blocks WHERE blocker_id = $1`
      const blockedusers = await pool.query(sql, [session.userid])
      const blockedUserIds = blockedusers.rows.map(user => user.target_id)

      const userLists = { liked: likedUserIds, connected: connectedUserIds, blocked: blockedUserIds }
      response.send(userLists)
    } else {
      response.send(false)
    }
  })

  app.get('/api/browsing/profile/:id', async (request, response) => {
    const session = request.session

    if (session.userid) {
      try {
        const profile_id = request.params.id
        var sql = `SELECT users.id AS id, username, firstname, lastname,
                gender, user_location, age, biography,
                sexual_pref, fame_rating,
                TO_CHAR(last_connection AT time zone 'UTC' AT time zone 'Europe/Helsinki', 'dd.mm.yyyy hh24:mi:ss')
                AS last_connected
                FROM users
                INNER JOIN user_settings ON users.id = user_settings.user_id
                INNER JOIN fame_rates ON users.id = fame_rates.user_id
                WHERE users.id = $1;`
        const requestedUserData = await pool.query(sql, [profile_id])
        const { ...profileData } = requestedUserData.rows[0]

        sql = `SELECT * FROM tags
            WHERE tagged_users @> array[$1]::INT[]
            ORDER BY tag_id ASC`
        const requestedUserTags = await pool.query(sql, [profile_id])

        // Test if this needs a promise operation.
        profileData.tags = requestedUserTags.rows.map(tag => tag.tag_content)

        sql = `SELECT * FROM user_images WHERE user_id = $1 AND profile_pic = $2`
        const profile_pic = await pool.query(sql, [profile_id, true])

        if (profile_pic.rows[0]) {
          profileData.profile_pic = profile_pic.rows[0]
        } else {
          // For cases where the profile doesn't have a picture yet.
          profileData.profile_pic = { user_id: session.userid, picture_data: null }
        }

        sql = `SELECT * FROM user_images WHERE user_id = $1 AND profile_pic = $2`
        const other_pics = await pool.query(sql, [profile_id, false])

        // Check with console.log, if you should use other_pics.rows.length instead.
        if (other_pics.rows) {
          profileData.other_pictures = other_pics.rows
        }

        sql = `INSERT INTO watches (watcher_id, target_id) VALUES ($1,$2)`
        pool.query(sql, [session.userid, profile_id])

        var notification = `The user ${session.username} just checked your profile`
        sql = `INSERT INTO notifications (user_id, notification_text, redirect_path, sender_id)
							VALUES ($1,$2, $3, $4) RETURNING notification_id`
        const inserted_id = await pool.query(sql, [profile_id, notification, `/profile/${session.userid}`, session.userid])

        // Wait until Socket.IO implementation.
        // sendNotification(session.userid, inserted_id.rows[0]['notification_id'], notification,
        // profile_id, `/profile/${session.userid}`)

        response.send(profileData)
      } catch (error) {
        response.send(false)
      }
    }
  })
}