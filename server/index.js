const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const config = require('./config')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { pgUser, pgPassword, pgDatabase, pgHost, EMAIL_ADDRESS, EMAIL_PASSWORD } = require('./config')
const http = require('http').Server(app) //required for socket to work

// middleware
app.use(cors())
app.use(express.json())
app.use(
  express.static(path.join(__dirname, "../client/build"))
)
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    sameSite: 'strict'
  }
}))

app.use('/images', express.static('./images')) // to serve static files to path /images, from images folder

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// POSTGRES SETUP
const Pool = require('pg').Pool

const pool = new Pool({
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  database: pgDatabase,
  port: 5432
})

const connectToDatabase = () => {
  pool.connect((err, client, release) => {
    if (err) {
      console.log('Error acquiring client', err.stack)
      console.log('Retrying in 5 seconds...')
      setTimeout(connectToDatabase, 5000)
    } else {
      console.log('Connected to database')
    }
  })
}
connectToDatabase()


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD
  }
})

// Think about adding fieldname to naming if necessary.
const storage = multer.diskStorage({
  destination: (request, file, callbackFunction) => {
    callbackFunction(null, 'images/')
  },
  filename: (request, file, callbackFunction) => {
    console.log('file: ', file)
    callbackFunction(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

require('./routes/login.js')(app, pool, bcrypt)
require('./routes/profile.js')(app, pool, upload, fs, path, bcrypt)
require('./routes/signup.js')(app, pool, bcrypt, transporter, crypto)
require('./routes/browsing.js')(app, pool, transporter, socketIO)
require('./routes/resetpassword.js')(app, pool, bcrypt, transporter, crypto)
require('./routes/chat_api.js')(app, pool)
require('./routes/chat.js')(pool, socketIO)

const PORT = config.PORT || 3001

http.listen(config.PORT, () => {
  console.log(` Server running on port ${config.PORT}`)
})