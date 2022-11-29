const express = require("express")
const mysql = require('mysql')

const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended:true}))

// var morgan = require('morgan')

// morgan.token('body', request => {
// 	return JSON.stringify(request.body)
// })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const db = mysql.createPool({
	host: "127.0.0.1", // does not work with localhost for some reason!
	user: "root", 
	password: "password", 
	database: "matcha",
	port: '3306',
	connectionLimit: 3
});

app.get("/api/get", (req, res) => {
	const sqlSelect = 
		"SELECT * FROM users";
	db.query(sqlSelect, (err, result) => {
		console.log('result: ', result)
		console.log('error: ', err)
	})
} );

app.post("/api/insert", (req, res) => {

	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	console.log('first name : ', firstName);
	console.log('last name : ', lastName);
	
	const sqlInsert = "INSERT INTO users (firstName, lastName) VALUES (?, ?)"
	db.query(sqlInsert, [firstName, lastName], (err, result) => {
		console.log('result: ', result)
		console.log('error: ', err)
	})
})

app.listen(3001, () => {
    console.log("Server running on port 3001")
})