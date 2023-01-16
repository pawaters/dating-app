import { Alert, Snackbar } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from "react";
import { changeNotification } from '../reducers/notificationReducer'

const NotificationSnackbar = () => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false);
	const notification = useSelector(state => state.notification)
	const severity = useSelector(state => state.severity)

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		dispatch(changeNotification(''))
		setOpen(false);
	};

	useEffect(() => {
		if (notification !== '') {
			setOpen(true)
		}
	}, [notification])

	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			onClose={handleClose}>
			<Alert
				elevation={2}
				onClose={handleClose}
				severity={severity}
			>
				{notification}
			</Alert>
		</Snackbar>
	)
}

export default NotificationSnackbar
