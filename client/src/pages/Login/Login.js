import { Button, Paper, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Notification from "../../components/notification/Notification"
import { changeNotification } from "../../reducers/notificationReducer"
import { changeSeverity } from "../../reducers/severityReducer"
import signUpService from "../../services/signUpService"
import { setUser } from "../../reducers/userReducer"



const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(state => state.user)

    useEffect( () => {
        if (user !== undefined && user !== '') {
            navigate('/profile')
        }
    }, [user, navigate])

    const submitUser = async (event) => {
        event.preventDefault()
    
        const signedUpUser = {
            username: event.target.username.value,
            password: event.target.password.value,
        }
        console.log('user:', user,'empty space right before that?')
        console.log(signedUpUser)

        signUpService.logInUser(signedUpUser)
            .then(result => {
                
                if (result.userid) {
                    const sessionUser = { name: result.username, id: result.userid}
                    dispatch(setUser(sessionUser))
                    
                } else {

                }
            })
    }

    const navigateToReset = () => {
        navigate('/login/resetpassword')
    }

    return (
        <Container 
        sx={{ 
            pt:5, 
            pb: 5,
            backgroundImage: `url("https://assets.materialup.com/uploads/cd7deaa7-e263-4c1b-98c9-132d248fc0d4/preview.png")`,
            backgroundSize: 'cover',
            width: 'auto',
            height: 'auto',
            minHeight: '80vh',
        }}
        >
            <Paper elevation={10} sx={{ padding: 3, width:'50%', margin: 'auto'}} >
                <Typography variant="h2"> Login </Typography>
                <form onSubmit={submitUser}>
                    <TextField fullWidth margin='normal' name='username' label='Username' placeholder="Username" autoComplete="nickname" required> </TextField>
                    <TextField fullWidth margin='normal' type="password" name='password' label='Password' placeholder="Password" autoComplete="new-password" required> </TextField>
                    <Button type='submit' variant="contained" size="large" sx={{ mt: 2 }}> Submit </Button>
                </form>
                <Button onClick={navigateToReset} sx={{mt: 1}}> Forgot Password?</Button>
                <Notification />
            </Paper>
        </Container>
    )
}

export default Login