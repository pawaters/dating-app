import React from "react"
import "./style/App.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

//pages
import Home from "./pages/Home.js"

//components 
import InputUser from "./components/InputUser"
import Signup from "./pages/Signup"
import Browsing from "./pages/Signup"
import NoPage from "./pages/NoPage"
import Onboarding from "./pages/Onboarding"
import Profile from "./pages/Profile"
import Swipe from "./pages/Swipe"

function App() {
   return (
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/signup"} element={<Signup/>}/>
            <Route path={"/browsing"} element={<Browsing/>}/>
            <Route path={"/onboarding"} element={<Onboarding/>}/>
            <Route path={"/profile"} element={<Profile/>}/>
            <Route path={"/swipe"} element={<Swipe/>}/>
            <Route path={"*"} element={<NoPage/>}/>
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