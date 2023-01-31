import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { changeNotification } from "../reducers/notificationReducer"
import { changeSeverity } from "../reducers/severityReducer"
import signUpService from "../services/signUpService"
import { setUser } from "../reducers/userReducer"
import { resetUserLists } from "../reducers/userListsReducer"
import { resetUserNotifications } from "../reducers/userNotificationsReducer"
import { resetDisplaySettings } from "../reducers/displaySettingsReducer"
import { resetProfileData } from "../reducers/profileReducer"
import { resetBrowsingCriteria } from "../reducers/browsingReducer"

const Logout = ({ socket }) => {

    const dispatch = useDispatch()
	const navigate = useNavigate()
	const notification = useSelector((state => state.notification))

    useEffect(() => {
		signUpService.logOutUser()
		dispatch(setUser(""))
		dispatch(resetUserLists())
		dispatch(resetUserNotifications())
		dispatch(resetBrowsingCriteria())
		dispatch(resetDisplaySettings())
		dispatch(resetProfileData())
		dispatch(changeSeverity('success'))
		if (notification !== "User has been successfully deleted. Bye bye!")
			dispatch(changeNotification("Logged out. Thank you for using our app!"))
		socket.emit("logOut", { socketID: socket.id })
		navigate('/login')
	}, [dispatch, navigate, socket, notification])
}

export default Logout