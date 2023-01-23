const { faker } = require('@faker-js/faker')
const { Pool } = require('pg').Pool
const axios = require('axios')

const { pgUser, pgPassword, pgDatabase, pgHost } = require('../server/src/utils/config')

const tags = []
const tag_names = ["work", "dog", "music", "travel", "outdoors", "books",
	"adventure", "food", "hiking", "sports", "gaming", "movies", "tv", "art",
	"nature", "animals", "cars", "tech", "fashion", "beauty", "fitness",
	"health", "science", "history", "politics", "religion", "philosophy",
	"psychology", "education", "family", "friends", "cats"]

const pool = new Pool({
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  database: pgDatabase
})

const initTags = async () => {
	for (let i = 0; i < tag_names.length; i++) {
		let sql = `SELECT * FROM tags WHERE tag_content = LOWER($1)`
		let values = [tag_names[i]]
		let res = await pool.query(sql, values)
		if (res.rows.length === 0) {
			sql = `INSERT INTO tags (tag_content) VALUES (LOWER($1))`
			values = [tag_names[i]]
			await pool.query(sql, values)
		}
		let tag = {
			tag_content: tag_names[i],
			tagged_user: []
		}
		tags.push(tag)
	}
}

const connectToDatabase = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.log('Error acquiring client', err.stack)
			console.log('Retrying in 5 seconds...')
			setTimeout(connectToDatabase, 5000)
		} else {
			console.log('Connected to database')
			initTags()
			// initUsers()
				.then(() => {
					console.log("User creating finished, you can close this window")
				})
		}
	})
}
connectToDatabase()