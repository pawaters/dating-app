import React from "react"
import { useEffect, useState } from 'react'
import "./style/App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, Container, responsiveFontSizes } from "@mui/material"
import { Provider, useDispatch, useSelector } from "react-redux"
import signUpService from './services/signUpService'

//pages & components
import Home from "./pages/Home.js"
import Signup from "./pages/Signup"
import Browsing from "./pages/Browsing/Browsing"
import Onboarding from "./pages/Profile/Onboarding"
import Profile from "./pages/Profile/Profile"
// import Swipe from "./pages/Swipe"
import RedirectPage from "./pages/RedirectPage"
import Navbar from "./components/navbar/Navbar"
import Login from "./pages/Login/Login"
import ResetPassword, { SetNewPassword } from "./pages/Login/ResetPassword"
import ProfileSettings from "./pages/Profile/ProfileSettings"
import ChangePassword from "./pages/Profile/ChangePassword"
import ConfirmMail from "./pages/Login/ConfirmMail"
import UserProfile from "./pages/Profile/UserProfile"
import Chat from "./pages/Chat/Chat"
import Logout from "./pages/Logout"
import Footer from "./components/Footer"
import { grey, pink } from "@mui/material/colors"
import { borderRadius } from "@mui/system"
import PathNotExists from "./pages/PathNotExists"
import { getProfileData } from "./reducers/profileReducer"
import { getUserLists } from "./reducers/userListsReducer"
import { getUserNotifications } from "./reducers/userNotificationsReducer"
import { setUser } from "./reducers/userReducer"
import { changeOnlineUsers } from './reducers/onlineUsersReducer'
import socketIO from 'socket.io-client'; 
import Loader from "./components/Loader"

const font = "'Readex Pro', sans-serif";

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
                    border: 'none',
                    textTransform: 'none'
                }
            }
        }
    },
    typography: {
        fontFamily: font,
    }
})

const App = () => {
    const [socket, setSocket] = useState(null)
    const [socketConnected, setSocketConnected] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    // SOCKET SETUP TO UPDATE
    useEffect(() => {
        setSocket(socketIO('http://localhost:3001'))
    }, [])

    useEffect(() => {

        console.log("APP.JS l82 :", socket)
		if (!socket) return
        socket.heartbeatTimeout = 20000;
		socket.on('connect', () => {
			setSocketConnected(true)
		})
		socket.on('newUserResponse', (data) => {
			dispatch(changeOnlineUsers(data))
		})
	}, [socket, dispatch, user])

    useEffect(() => {
        dispatch(getProfileData())
        dispatch(getUserLists())
        dispatch(getUserNotifications())
        signUpService
            .getSessionUser()
            .then(result => {
                dispatch(setUser(result))
            })

    }, [dispatch])

    useEffect(() => {
		if (user && socketConnected) {
			if (user.name && socket.id) {
				socket.emit("newUser", { name: user.name, id: user.id, socketID: socket.id })
				socket.emit("join_notification", { id: user.id })
			}
		}
	}, [user, socket, socketConnected])

    if (!socketConnected) return <Loader text="Waiting for socket..." />

    return (
            <ThemeProvider theme={theme}>
                <Container sx={{ height: 'auto', width: 'auto' }}>
                    <BrowserRouter>
                        <RedirectPage />
                        <Navbar socket={socket} />
                        <Routes>
                            <Route path={"/"} element={<Home />} />
                            <Route path={"/login"} element={<Login socket={socket} />} />
                            <Route path={"/login/resetpassword"} element={<ResetPassword />} />
                            <Route path={"/resetpassword/:user/:code"} element={<SetNewPassword />} />
                            <Route path={"/signup"} element={<Signup />} />
                            <Route path={"/settings"} element={<ProfileSettings />} />
                            <Route path={"/changepassword"} element={<ChangePassword />} />
                            <Route path={"/confirm/:user/:code"} element={<ConfirmMail />} />
                            <Route path={"/browsing"} element={<Browsing />} />
                            <Route path={"/onboarding"} element={<Onboarding />} />
                            <Route path={"/profile"} element={<Profile />} />
                            <Route path={"/profile/:id"} element={<UserProfile />} />
                            <Route path={"/chat"} element={<Chat socket={socket} />} />
                            <Route path={"/chat/:id"} element={<Chat socket={socket} />} />
                            <Route path={"/logout"} element={<Logout socket={socket}/>} />
                            <Route path='*' element={<PathNotExists />} />
                        </Routes>
                    </BrowserRouter>
                    <Footer />
                </Container>
            </ThemeProvider>
    )
}

export default App 