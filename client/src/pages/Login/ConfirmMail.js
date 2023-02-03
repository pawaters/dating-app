import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import signUpService from '../../services/signUpService'
import { changeNotification } from '../../reducers/notificationReducer'
import { changeSeverity } from '../../reducers/severityReducer'

const ConfirmMail = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const userToVerify = {
		username: useParams().user,
		code: useParams().code
	}

	signUpService.verifyUser(userToVerify).then((result) => {
		if (result === true) {
			dispatch(changeSeverity('success'))
			dispatch(changeNotification("User verified successfully! Please log in."))
		} else {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification("User verification failed."))
		}
		navigate('/login')
	})
}

export default ConfirmMail