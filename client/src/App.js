import React from "react"
import "./style/App.css"
import {Router, Routes, Route} from 'react-router-dom'

//pages
import Home from "./pages/Home.js"
import Signup from "./pages/Signup"
import Browsing from "./pages/Signup"
import NoPage from "./pages/NoPage"
import Onboarding from "./pages/Onboarding"
import Profile from "./pages/Profile"
import Swipe from "./pages/Swipe"
import RedirectPage from "./pages/RedirectPage"

//components 
import InitialTest from "./components/InitialTest"
import Navbar from "./components/navbar/Navbar"
import Login from "./pages/Login/Login"
import ResetPassword from "./pages/Login/ResetPassword"
import SetNewPassword from "./pages/Login/SetNewPassword"


function App() {
   return (
    <Router>
        <RedirectPage />
        <Navbar />
        <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/login/resetpassword"} element={<ResetPassword/>}/>
            <Route path={"/resetpassword/:user/:code"} element={<SetNewPassword/>}/>
            <Route path={"/signup"} element={<Login/>}/>
            <Route path={"/browsing"} element={<Browsing/>}/>
            <Route path={"/onboarding"} element={<Onboarding/>}/>
            <Route path={"/profile"} element={<Profile/>}/>
            <Route path={"/swipe"} element={<Swipe/>}/>
            <Route path={"*"} element={<NoPage/>}/>
        </Routes>
        <InitialTest></InitialTest>
    </Router>
   )
}
 
// REACT COMPONENTS TO DEFINE AND CREATE

export default App 