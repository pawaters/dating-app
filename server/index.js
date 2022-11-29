const express = require("express")
const mysql = require('mysql')
const app = express();
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5433,
    database: "matcha"
});

//ROUTES


//GET ALL USERS
app.get("/api/get", (req, res) => {
	const sqlSelect = 
		"SELECT * FROM users";
	db.query(sqlSelect, (err, result) => {
		console.log('result: ', result)
		console.log('error: ', err)
	})
} );

//CREATE A USER
app.post("/api/insert", async(req, res) => {

	// const firstName = req.body.firstName;
	// const lastName = req.body.lastName;
	// console.log('first name : ', firstName);
	// console.log('last name : ', lastName);
	
	// const sqlInsert = "INSERT INTO users (firstName, lastName) VALUES (?, ?)"

	try{
		console.log(req.body)
	} catch (err) {
		console.error(err.message)
	}
})

//UPDATE A USER

//DELETE A USER

app.listen(3001, () => {
    console.log("Server running on port 3001")
})