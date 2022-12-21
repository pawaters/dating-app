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
    .query('CREATE TABLE IF NOT EXISTS users( users_id SERIAL PRIMARY KEY, first_name VARCHAR(255) NOT NULL);')
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

//CREATE A USER IN SIGNUP
app.post('/api/signup', async (request, response) => {

  const userName = request.body.username
  const firstName = request.body.firstname
  const lastName = request.body.lastname
  const email = request.body.email
  const password = request.body.password

  const hashPasswordAndSave = async () => {
    const hash = await bcrypt.hash(password, 10);
    try {
      const newUser = await pool.query(
        'INSERT INTO users (username, firstname, lastname, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [userName, firstName, lastName, email, hash]
      )
      response.json(newUser.rows[0])
    } catch (err) {
      console.error(err.message)
    }
  }

  hashPasswordAndSave()
})

// VIEW USERS CREATED IN SIGNUP
app.get('/signup/users', async (request, response) => {

  try {
    const allUsers = await pool.query('SELECT * FROM users')
    response.json(allUsers.rows)
  } catch (err) {
    console.error(err.message)
  }
})

// GET A SPECIFIC SIGNED UP USER
app.get('/signup/users/:id', async (request, response) => {
  try {
    const { id } = request.params
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    response.json(user.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

app.post('/api/login', async (request, response) => {

  const userName = request.body.username
  const password = request.body.password

  console.log('userName', userName)

  const verifyLoginAttempt = async () => {
    const user = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [userName]
    )
    console.log('User data here to the right: ', user)
    console.log('User.rows[0] data here to the right: ', user.rows[0])
    if (user.rows.length === 0) {
      console.log('User not found')
    } else {
      const comparePasswords = await bcrypt.compare(password, user.rows[0]['password'])
      if (comparePasswords) {
        console.log('Auth success!')
        var session = request.session
        console.log('session here: ', session)
        session.userid = user.rows[0]['id']
        session.username = user.rows[0]['username']
        return session
      } else {
        console.log('Auth fail!')
      }
    }
  }

  verifyLoginAttempt()
    .then(session => {
      response.send(session)
    }).catch(error => {
      response.send(error)
    })
})

app.get('/api/login', (request, response) => {
  var session = request.session
  if (session.username && session.userid)
    response.send({ name: session.username, id: session.userid })
  else
    response.send('')
})

app.get('/api/logout', (request, response) => {
  request.session.destroy(error => {
    if (error) {
      return console.log(error)
    }
    response.end()
  });
});

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

app.listen(config.PORT, () => {
  logger.info(` Server running on port ${config.PORT}`)
})