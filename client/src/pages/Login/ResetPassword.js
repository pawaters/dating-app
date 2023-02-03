import { useDispatch } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import signUpService from '../../services/signUpService'
import { Container, Paper, TextField, Typography, Button } from '@mui/material'
import { changeNotification } from '../../reducers/notificationReducer'
import { changeSeverity } from '../../reducers/severityReducer'
import Notification from '../../components/notification/Notification'
import { MailForward } from 'tabler-icons-react';

export const SetNewPassword = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const params = useParams()

	const sendNewPassword = async (event) => {
		event.preventDefault()

		const passwords = {
			user: params.user,
			code: params.code,
			password: event.target.password.value,
			confirmPassword: event.target.confirm_password.value
		}

		signUpService.setNewPassword(passwords).then(result => {
			if (result === true) {
				dispatch(changeSeverity('success'))
				dispatch(changeNotification("Password successfully changed! Please log in."))
				navigate('/login')
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		})
	}

	return (
		<>
			<Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
				<Paper elevation={10} sx={{ padding: 3 }}>
					<Typography variant='h5' align='center'
						sx={{ fontWeight: 550 }}>Set new password</Typography>
					<Typography align='center'>Enter a new secure password for your account.</Typography>
					<form onSubmit={sendNewPassword}>
						<TextField type='password' fullWidth margin='dense' name="password"
							label='New Password' placeholder="New password" required></TextField>
						<TextField type='password' fullWidth margin='dense' name="confirm_password"
							label='Confirm new password' placeholder="Confirm new password" required></TextField>
						<Button type="submit" variant='contained' size='large' sx={{ mt: 1 }}>Submit</Button>
					</form>
					<Notification />
				</Paper>
			</Container>
		</>
	)
}


const ResetPasswordForm = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const sendPasswordMail = (event) => {
		event.preventDefault()

		const resetInfo = {
			resetvalue: event.target.reset.value
		}

		signUpService.resetPassword(resetInfo).then((result) => {
			const message = `If an account with these details was found, a reset email was sent.
							Please check your inbox to reset your password.`

			if (result === true) {
				dispatch(setNotification(message, 10))
				navigate('/login')
			} else {
				dispatch(setNotification(message, 10))
			}
		})
	}

	return (
		<Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ p: 3 }}>
				{/* <IconMailFor size={100} color="#F11926" /> */}
                <MailForward />
				<Typography variant='h5' align='center' sx={{ frontWeight: 550 }}>
					Reset Password
				</Typography>
				<Typography align='center'>
					Please enter your e-mail address to reset your password.
				</Typography>
				<form onSubmit={sendPasswordMail}>
					<TextField fullWidth margin='normal' name='reset' size="30"
						placeholder="Username / Email address"
						label="Username / Email address"
						autoComplete='email' required
					/>
					<Button type="submit" size='large' sx={{ mt: 1 }}>Reset password</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	)
}

export default ResetPasswordForm
