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
app.get("/api/get", async(req, res) => {
	try {
		const allUsers = await pool.query("SELECT * FROM users")
		res.json(allUsers.rows)
	} catch (err) {
		console.error(err.message)
	}
});

//GET A SPECIFIC USER
app.get("/api/get/:id", async(req, res) => {
	try {
		const { id } = req.params
		const user = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])
		 
		res.json(user.rows[0])
	} catch (err) {
		console.error(err.message)
	}
});


//CREATE A USER  
app.post("/api/insert", async(req, res) => {

	try{
		const firstName = req.body.first_name;

		const newUser = await pool.query(
			"INSERT INTO users (first_name) VALUES($1) RETURNING *", 
			[firstName]
		); 

		res.json(newUser.rows[0])
		console.log("user :", req.body);
	} catch (err) {
		console.error(err.message)
	}
})

//UPDATE A USER

//DELETE A USER

app.listen(3001, () => {
    console.log("Server running on port 3001")
})