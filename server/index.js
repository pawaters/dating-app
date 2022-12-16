const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')
const { pgUser, pgPassword, pgDatabase, pgHost } = require('./src/utils/config')

// middleware
app.use(cors())
app.use(express.json())

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
    .query('CREATE TABLE IF NOT EXISTS users( users_id SERIAL PRIMARY KEY, first_name VARCHAR(255) NOT NULL);')
    .catch(err => console.log(err))
})


//ROUTES CRUD


//GET ALL USERS
app.get('/users', async (req, res) => {
  try {
    // const allUsers = await pool.query('SELECT * FROM test_users')
    const allUsers = await pool.query('SELECT * FROM test_users')
    res.json(allUsers.rows)
  } catch (err) {
    console.error(err.message)
  }
})

//GET A SPECIFIC USER
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await pool.query('SELECT * FROM test_users WHERE users_id = $1', [id])

    res.json(user.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})


//CREATE A USER
app.post('/users', async (req, res) => {

  try {
    const firstName = req.body.first_name

    const newUser = await pool.query(
      'INSERT INTO test_users (first_name) VALUES($1) RETURNING *',
      [firstName]
    )

    res.json(newUser.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})


//CREATE A USER IN SIGNUP
app.post('/api/signup', async (req, res) => {

  try {
    const userName = req.body.username
    const firstName = req.body.firstname
    const lastName = req.body.lastname
    const email = req.body.email
    const password = req.body.password

    const newUser = await pool.query(
      'INSERT INTO users (username, firstname, lastname, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [userName, firstName, lastName, email, password]
    )
    res.json(newUser.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

// VIEW USERS CREATED IN SIGNUP
app.get('/signup/users', async (req, res) => {

  try {
    const allUsers = await pool.query('SELECT * FROM users')
    res.json(allUsers.rows)
  } catch (err) {
    console.error(err.message)
  }
})

// GET A SPECIFIC SIGNED UP USER
app.get('/signup/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    res.json(user.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//UPDATE A USER - THERE FOR TESTING

app.put('/users/:id', async (req, res) => {

  try {
    // define const we use
    // const firstName = req.body.first_name
    const { id } = req.params

    // const with query result
    // const updatedUser = await pool.query(
    //   'UPDATE users SET first_name = $1 WHERE users_id = $2',
    //   [firstName, id]
    // )

    res.json(id)

  } catch (err) {
    console.error(err.message)
  }
})

//DELETE A USER - THERE FOR TESTING

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteUser = await pool.query('DELETE FROM users WHERE users_id = $1',
      [id])
    res.json('user deleted')
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(config.PORT, () => {
  logger.info(` Server running on port ${config.PORT}`)
})