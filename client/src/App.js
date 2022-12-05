import React from "react"
import "./style/App.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

//pages
import Home from "./pages/Home.js"

//components 
import InputUser from "./components/InputUser"

function App() {
   return (
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Home/>}/>
        </Routes>
        <InputUser></InputUser>
    </BrowserRouter>
   )
}
 
// REACT COMPONENTS TO DEFINE AND CREATE
    // Header 
    // Tinder cards
    // buttons below cards
    // chats screen
    // indiv chat screen

export default App 