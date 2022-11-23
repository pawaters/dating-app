const express = require("express")
const mysql = require('mysql2')
const cors = require('cors');

const db = mysql.createPool({
	host: 'mysql_db', // the host name MYSQL_DATABASE: node_mysql
	user: 'MYSQL_USER', // database user MYSQL_USER: MYSQL_USER
	password: 'MYSQL_PASSWORD', // database user password MYSQL_PASSWORD: MYSQL_PASSWORD
	database: 'books' // database name MYSQL_HOST_IP: mysql_db
})

const app = express ()

app.get('/', (request, response) => {
    response.send('<h1>nodemon working?</h1>')
  })

app.listen(3001, () => {
    console.log("Server running on port 3001")
})