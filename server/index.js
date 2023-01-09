const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const bcrypt = require('bcrypt')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')
const { pgUser, pgPassword, pgDatabase, pgHost } = require('./src/utils/config')

// middleware
app.use(cors())
app.use(express.json())
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// POSTGRES SETUP
const Pool = require('pg').Pool

const pool = new Pool({
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  database: pgDatabase
})

// TO DO: BETTER DEFINE BEHAVIOR IF NOT EXIST
pool.on('connect', client => {
  client
    .query('CREATE TABLE IF NOT EXISTS test5 (users_id3 SERIAL PRIMARY KEY, first_name3 VARCHAR(255) NOT NULL);') // This is created under certain conditions.
    .catch(err => console.log(err))
})


//ROUTES CRUD


//GET ALL USERS
app.get('/users', async (request, response) => {
  try {
    // const allUsers = await pool.query('SELECT * FROM test_users')
    const allUsers = await pool.query('SELECT * FROM test_users')
    response.json(allUsers.rows)
  } catch (err) {
    console.error(err.message)
  }
})

//GET A SPECIFIC USER
app.get('/users/:id', async (request, response) => {
  try {
    const { id } = request.params
    const user = await pool.query('SELECT * FROM test_users WHERE users_id = $1', [id])

    response.json(user.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})


//CREATE A USER
app.post('/users', async (request, response) => {

  try {
    const firstName = request.body.first_name

    const newUser = await pool.query(
      'INSERT INTO test_users (first_name) VALUES($1) RETURNING *',
      [firstName]
    )

    response.json(newUser.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//UPDATE A USER - THERE FOR TESTING
app.put('/users/:id', async (request, response) => {

  try {
    // define const we use
    // const firstName = req.body.first_name
    const { id } = request.params

    // const with query result
    // const updatedUser = await pool.query(
    //   'UPDATE users SET first_name = $1 WHERE users_id = $2',
    //   [firstName, id]
    // )

    response.json(id)

  } catch (err) {
    console.error(err.message)
  }
})

//DELETE A USER - THERE FOR TESTING

app.delete('/users/:id', async (request, response) => {
  try {
    const { id } = request.params
    const deleteUser = await pool.query('DELETE FROM users WHERE users_id = $1',
      [id])
    response.json('user deleted')
  } catch (err) {
    console.error(err.message)
  }
})

require('./src/routes/login.js')(app, pool, bcrypt);
require('./src/routes/profile.js')(app, pool, bcrypt);
require('./src/routes/signup.js')(app, pool, bcrypt);

app.listen(config.PORT, () => {
  logger.info(` Server running on port ${config.PORT}`)
})