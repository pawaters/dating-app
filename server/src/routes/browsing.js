module.exports = (app, pool) => {
  app.get('/api/browsing/tags', async (request, response) => {
    try {
      var sql = 'SELECT tag_content FROM tags ORDER BY tag_id ASC;'
      const result = await pool.query(sql)
      console.log('result.rows: ', result.rows)
      response.send(result.rows)
    } catch (error) {
      console.log('catching error from browsing.js')
      response.send(false)
    }
  })

  app.get('/api/browsing/profile/:id', async (request, response) => {
    const session = request.session

    if (!session.userid) {
      response.send('Error in app.post(\'/api/browsing/profile/:id\'. User was not signed in.')
    }
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
      response.send(profileData)
    } catch (error) {
      response.send(false)
    }
  })
}