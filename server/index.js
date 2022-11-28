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
// app.use(cors);
// app.use(express.json);

app.get('/', (request, response) => {
	const sqlInsert = "INSERT INTO users (name, surname) VALUES ('from2', 'indexjs');";

	db.query(sqlInsert, (err, result) => {
		console.log(err);
		response.send('<h1>app.get / working</h1>');
		console.log(err);
	});
    
});

app.listen(3001, () => {
    console.log("Server running on port 3001")
})