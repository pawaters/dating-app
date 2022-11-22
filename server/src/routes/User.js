const express = require('express')
const router = express.Router()

const controller = require("../controllers/UserController")

// Make requests GET, POST, INSERT, DELETE
// HOWEVER, do the sending data part in "Controller"

router.get("/", controller.get)
//controller.get tells to go to controller to see what a get request means.



//remember to export each route 