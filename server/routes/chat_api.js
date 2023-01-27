module.exports = (app, pool) => {
    app.get('/api/chat/chat_connections', async (request, response) => {
        const session = request.session

        try {
            if (session.userid) {
                var sql = `SELECT * from connections
                            WHERE user1_id = $1
                            OR user2_id = $1`
                var connections_containing_user = await pool.query(sql, [session.userid])
                var user_connection_info = []
                // Create an array of all connections that contains the other party's ID and the connection ID.
                for (var i = 0; i < connections_containing_user.rows.length; i++) {
                    var row = connections_containing_user.rows[i]
                    if (row.user1_id === session.userid) {
                        user_connection_info.push({
                            connection_id: row.connection_id,
                            user_id: row.user2_id
                        })
                    } else if (row.user2_id === session.userid) {
                        user_connection_info.push({
                            connection_id: row.connection_id,
                            user_id: row.user1_id
                        })
                    }
                }

                // Add to the previous array the username of the other person and their profile_pic for each user.
                for (var i = 0; i < user_connection_info.length; i++) {
                    var chat_partner_id = user_connection_info[i].user_id 
                    sql = `SELECT username FROM users WHERE id = $1`
                    var { rows } = await pool.query(sql, [chat_partner_id])
                    user_connection_info[i].username = rows[0].username

                    sql = `SELECT picture_data FROM user_pictures
    				        WHERE user_id = $1
                            AND profile_pic = 'YES'`
                    var { rows } = await pool.query(sql, [chat_partner_id])
                    user_connection_info[i].picture_data = rows[0].picture_data
                }
                // user_connection_info should contain connection_id, user_id of partner, username of partner, and their profile_pic
                response.send(user_connection_info)
            } else {
                response.send(false)
            }
        } catch (error) {
            console.log(error)
        }
    })

    app.post('/api/chat/room_messages', async (request, response) => {
        const session = request.session
        const connection_id = request.body.room
        try {
            if (session.userid) {
                var sql = `SELECT message AS text, sender_id, username AS name, connection_id AS room, chat_id AS key
                            FROM chat
				            INNER JOIN users ON users.id = chat.sender_id
				            WHERE connection_id = $1
                            ORDER BY time_stamp ASC`
                var { rows } = await pool.query(sql, [connection_id])
                response.send(rows)
            } else {
                response.send(false)
            }
        } catch (error) {
            console.log(error)
        }
    })


}
