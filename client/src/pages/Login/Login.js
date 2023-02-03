import { Button, Paper, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Notification from "../../components/notification/Notification"
import { changeNotification } from "../../reducers/notificationReducer"
import { changeSeverity } from "../../reducers/severityReducer"
import signUpService from "../../services/signUpService"
import { setUser } from "../../reducers/userReducer"
import { getProfileData } from '../../reducers/profileReducer'
import { getUserLists } from "../../reducers/userListsReducer"
import { getUserNotifications } from "../../reducers/userNotificationsReducer"


const Login = ({ socket }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitUser = async (event) => {
        event.preventDefault()

        const signedUpUser = {
            username: event.target.username.value,
            password: event.target.password.value,
        }

        signUpService.logInUser(signedUpUser)
            .then(result => {
                if (result.userid) {
                    const sessionUser = { name: result.username, id: result.userid }
                    dispatch(setUser(sessionUser))

                    dispatch(getUserLists())
                    dispatch(getUserNotifications())
                    dispatch(getProfileData())
                    dispatch(changeNotification(""))
                    socket.emit("newUser", { name: result.username, id: result.userid, socketID: socket.id })
                    socket.emit("join_notification", { id: result.userid })

                } else {
                    dispatch(changeSeverity('error'))
                    dispatch(changeNotification(result))

                }
            })
    }

    const navigateToReset = () => {
        navigate('/login/resetpassword')
    }

    return (
        <Container
            sx={{
                pt: 5,
                pb: 5,
                backgroundImage: `url("https://assets.materialup.com/uploads/cd7deaa7-e263-4c1b-98c9-132d248fc0d4/preview.png")`,
                backgroundSize: 'cover',
                width: 'auto',
                height: 'auto',
                minHeight: '80vh',
            }}
        >
            <Paper elevation={10} align='center' sx={{ padding: 3, width: '50%', margin: 'auto' }} >
                <Typography variant="h2" align='center'> Login </Typography>
                <form onSubmit={submitUser} align='center'>
                    <TextField fullWidth margin='normal' name='username' label='Username' placeholder="Username" autoComplete="nickname" required> </TextField>
                    <TextField fullWidth margin='normal' type="password" name='password' label='Password' placeholder="Password" autoComplete="new-password" required> </TextField>
                    <Button type='submit' variant="contained" size="large" sx={{ mt: 2}}> Submit </Button>
                </form>
                <Button onClick={navigateToReset} sx={{ mt: 1 }}> Forgot Password?</Button>
                <Notification />
            </Paper>
        </Container>
    )
}

export default Login