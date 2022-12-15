import { Paper, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import signUpService from '../services/signUpService'

const submitUser = async (event) => {
    event.preventDefault()

    const signedUpUser = {
        username: event.target.username.value,
        firstname: event.target.firstname.value,
        lastname: event.target.lastname.value,
        email: event.target.email.value,
        password: event.target.password.value,
        confirmPassword: event.target.confirm_password.value,
    }

    signUpService.createUser(signedUpUser)
        .then(result => {
            if (result === true) {
                
            }
        })
}

const Signup = () => {
    return (
        <Container maxWidth='sm'>
            <Paper elevation={10}>
                <Typography> <h1>Signup</h1> </Typography>
                <form onSubmit={submitUser}>
                    <TextField name='username' label='Username' placeholder="Username" autoComplete="nickname" required> </TextField>
                    <TextField name='firstname' label='First name' placeholder="First name" autoComplete="given-name" required> </TextField>
                    <TextField name='lastname' label='Last name' placeholder="Last name" autoComplete="family-name" required> </TextField>
                    <TextField type="email" name='email' label='E-mail' placeholder="E-mail" autoComplete="email" required> </TextField>
                    <TextField type="password" name='password' label='Password' placeholder="Password" autoComplete="new-password" required> </TextField>
                    <TextField type="password" name='confirm_password' label='Confirm Password' placeholder="Confirm Password" autoComplete="confirm-password" required> </TextField>
                    
                </form>
            </Paper>
        </Container>
    )
}

export default Signup