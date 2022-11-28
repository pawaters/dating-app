const express = require("express")
const mysql = require('mysql')
const cors = require('cors');


const db = mysql.createPool({
	host: "127.0.0.1", // does not work with localhost for some reason!
	user: "root", 
	password: "password", 
	database: "matcha",
	// port: '3306'
});

// con.connect(function(err) {
// 	if (err) throw err;
// 	console.log("connected");
// })

const app = express()
app.use(cors);
app.use(express.json);

app.post('/api/insert', (req, res) => {

	const firstName = req.body.firstName;
	console.log('first name : ', firstName)
	console.log('last name : ', lastName)
	const lastName = req.body.lastName;
	
	const sqlInsert = "INSERT INTO users (firstName, lastName) VALUES (?, ?)"
	db.query(sqlInsert, [firstName, lastName], (err, result) => {
		console.log(result)
	})
})

app.listen(3001, () => {
    console.log("Server running on port 3001")
})