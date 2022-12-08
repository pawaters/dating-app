import React from "react"
import "./style/App.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ThemeProvider, createTheme, Container  } from "@mui/material"

//pages & components
import Home from "./pages/Home.js"
import Signup from "./pages/Signup"
import Browsing from "./pages/Browsing/Browsing"
import NoPage from "./pages/NoPage"
import Onboarding from "./pages/Onboarding"
import Profile from "./pages/Profile/Profile"
import Swipe from "./pages/Swipe"
// import RedirectPage from "./pages/RedirectPage"
import InitialTest from "./components/InitialTest"
import Navbar from "./components/navbar/Navbar"
import Login from "./pages/Login/Login"
import ResetPassword from "./pages/Login/ResetPassword"
import SetNewPassword from "./pages/Login/SetNewPassword"
import ProfileSettings from "./pages/Profile/ProfileSettings"
import ChangePassword from "./pages/Profile/ChangePassword"
import ConfirmMail from "./pages/Login/ConfirmMail"
import UserProfile from "./pages/Profile/UserProfile"
import Chat from "./pages/Chat/Chat"
import Logout from "./pages/Logout"
import DeleteUser from "./pages/Profile/DeleteUser"
import Footer from "./components/Footer"
import { grey, pink} from "@mui/material/colors"
import { borderRadius } from "@mui/system"

const theme = createTheme({
    palette: {
        primary: {
            main: pink[500], 
            // TO DO: GRADIENT TO IMPLEMENT
            // mainGradient: "linear-gradient(to right, tomato, cyan)"
        },
        secondary: {
            main: grey[500],
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    border: 'none'
                }
            }
        }
    }
})

function App() {
   return (
    <div className="content-wrap">
    <ThemeProvider theme={theme}>
        <Container >
            <BrowserRouter>
                {/* <RedirectPage /> */}
                <Navbar />
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/login/resetpassword"} element={<ResetPassword/>}/>
                    <Route path={"/resetpassword/:user/:code"} element={<SetNewPassword/>}/>
                    <Route path={"/signup"} element={<Signup/>}/>
                    <Route path={"/settings"} element={<ProfileSettings/>}/>
                    <Route path={"/changepassword"} element={<ChangePassword/>}/>
                    <Route path={"/confirm/:user/:code"} element={<ConfirmMail/>}/>
                    <Route path={"/browsing"} element={<Browsing/>}/>
                    <Route path={"/onboarding"} element={<Onboarding/>}/>
                    <Route path={"/profile"} element={<Profile/>}/>
                    <Route path={"/profile/:id"} element={<UserProfile/>}/>
                    <Route path={"/chat"} element={<Chat/>}/>
                    <Route path={"/chat/:id"} element={<Chat/>}/>
                    <Route path={"/swipe"} element={<Swipe/>}/>
                    <Route path={"/logout"} element={<Logout/>}/>
                    <Route path={"/deleteuser"} element={<DeleteUser/>}/>
                    <Route path={"*"} element={<NoPage/>}/>
                </Routes>
                <InitialTest></InitialTest>
            </BrowserRouter>
            <Footer />
        </Container>
    </ThemeProvider>
    </div>
   )
}

export default App 