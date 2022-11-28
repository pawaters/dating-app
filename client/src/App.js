import React from "react"
import "./style/App.css"
import { useState, useEffect } from "react"
import Axios from 'axios'

function App() {

    //creating a stage to get what we are writing in inputs
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value)
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value)
    }

    const submitReview = () => {
        Axios.post("http://localhost:3001/api/insert", {
            firstName: firstName, 
            lastName: lastName,
        }).then( () => {
            alert('successful insert');
        })
    }

    return ( 
        <div className="App"> 
            <h1>SIGN UP TEST WITH SQL DB</h1> 

            <div className="form">
                <label>First Name: </label>
                <input type="text" name="First Name" onChange={handleFirstNameChange}/>
                <label>Last Name: </label>
                <input type="text" name="Last Name" onChange={handleLastNameChange}/>
                <button onClick={submitReview}>Submit</button>
            </div>
        </div>
    )
}
 
// REACT COMPONENTS TO DEFINE AND CREATE
    // Header 
    // Tinder cards
    // buttons below cards
    // chats screen
    // indiv chat screen

export default App 