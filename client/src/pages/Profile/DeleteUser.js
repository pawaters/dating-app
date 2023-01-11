import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import profileService from '../../services/profileService'
import { changeSeverity } from '../../reducers/severityReducer'
import { changeNotification } from '../../reducers/notificationReducer'

const DeleteUser = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		profileService.deleteUser().then(result => {
			if (result === true) {
				dispatch(changeSeverity('success'))
				dispatch(changeNotification("User has been successfully deleted. Next!"))
				navigate('/logout')
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		})
	}, [dispatch, navigate])
}

export default DeleteUser