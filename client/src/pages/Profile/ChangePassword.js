import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changeNotification } from '../../reducers/notificationReducer'
import { changeSeverity } from '../../reducers/severityReducer'
import { Button, Paper, TextField, Typography } from "@mui/material";
import { Container } from '@mui/system';
import profileService from "../../services/profileService"
import Notification from "../../components/notification/Notification"

const ChangePassword = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const user = useSelector(state => state.user)

	useEffect(() => {
		if (user === undefined || user === '') {
			navigate('/login')
		}
	}, [user, navigate])

	const submitPasswords = async (event) => {
		event.preventDefault()
        

		const passWords = {
			oldPassword: event.target.old_password.value,
			newPassword: event.target.new_password.value,
			confirmPassword: event.target.confirm_password.value
		}
		profileService.changePassword(passWords).then(result => {
			if (result === true) {
				dispatch(changeSeverity('success'))
				dispatch(changeNotification('New password created successfully!'))
				navigate('/profile')
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		})
	}

	return (
		<Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }} align='center'>
				<Typography variant='h5' align='center'
					sx={{ fontWeight: 550 }}>Change password</Typography>
				<form onSubmit={submitPasswords}>
					<TextField type='password' fullWidth margin='dense' name="old_password"
						label='Old Password' placeholder="Old password" required></TextField>
					<TextField type='password' fullWidth margin='dense' name="new_password"
						label='New Password' placeholder="New password" required></TextField>
					<TextField type='password' fullWidth margin='dense' name="confirm_password"
						label='Confirm new password' placeholder="Confirm new password" required></TextField>
					<Button type="submit" variant='contained' size='large' sx={{ mt: 1 }}>Submit</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	)
}


export default ChangePassword