import React from "react"
import { useState} from "react"
import Axios from 'axios'

const InitialTest = () => {

    //creating a stage to get what we are writing in inputs
    const [firstName, setFirstName] = useState('')

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value)
    }

    const onSubmitForm = async() => {
        
        try {
            Axios.post("http://localhost:3001/users", {
                first_name: firstName, 
            }).then( () => {
                alert('successful insert');
            })
        } catch (err) {
            console.error(err.message)
        }
       
    }

    return( 
        <div className="App"> 
            <h1>INPUT DATA TEST WITH POSTGRES</h1> 

            <div className="form">
                <label>First Name: </label>
                <input type="text" name="First Name" onChange={handleFirstNameChange}/>
                <button onClick={onSubmitForm}>Submit</button>
            </div>
        </div>
    )
}

export default InitialTest