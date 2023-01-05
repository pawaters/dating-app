import { Paper, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Notification from "../components/notification/Notification"
import Loader from '../components/Loader'
import { changeNotification } from "../reducers/notificationReducer"
import { changeSeverity } from "../reducers/severityReducer"
import signUpService from "../services/signUpService"
import { setUser } from "../reducers/userReducer"
import { getUserLists } from "../reducers/userListsReducer"

const Logout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        signUpService.logOutUser()
        dispatch(setUser(''))
        console.log()
        navigate('/login')
    }, [navigate])
}

export default Logout