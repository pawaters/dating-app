import CloseIcon from '@mui/icons-material/Close'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { clearUserNotifications, deleteUserNotification } from '../../reducers/userNotificationsReducer'
import { Button, Typography, Box, IconButton, Menu, Card, Avatar, Badge } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import profileService from '../../services/profileService'
import { setNotificationRead, setAllNotificationsRead, addUserNotification } from '../../reducers/userNotificationsReducer'

const MenuButton = ({ unread, setAnchorElNotifications }) => {
	const BaseButton = () => {
		return (
			<Button
				sx={{
					minWidth: 0,
					borderRadius: '50%',
					width: '40px',
					height: '40px',
					mr: 1,
					backgroundColor: 'rgb(255, 99, 92)',
					color: '#FFFFFF',
					'&:hover': {
						backgroundColor: 'rgb(255, 99, 92)',
						boxShadow: 2
					}
				}}>
				<NotificationsIcon sx={{ fontSize: '28px' }} />
			</Button>
		)
	}

	if (unread === 0) {
		return (
			<Badge onClick={(event) => setAnchorElNotifications(event.currentTarget)}
				sx={{ mr: 1 }}>
				<BaseButton />
			</Badge>
		)
	} else {
		return (
			<Badge onClick={(event) => setAnchorElNotifications(event.currentTarget)}
				sx={{ mr: 1 }}
				color="error"
				overlap="circular"
				badgeContent={unread}
			>
				< BaseButton />
			</Badge>
		)
	}
}

const NotificationBadge = ({ is_read, picture }) => {
	const UserPicture = () => {
		return (
			<Avatar
				src={picture}
				alt='user_picture'
			/>
		)
	}
	if (is_read === "NO") {
		return (
			<Badge
				sx={{ mr: 1 }}
				color="error"
				variant="dot"
				overlap="circular"
			>
				<UserPicture />
			</Badge>
		)
	} else {
		return (
			<Badge
				sx={{ mr: 1 }}>
				<UserPicture />
			</Badge>
		)
	}
}

const NotificationMenu = ({ socket }) => {
	const [anchorElNotifications, setAnchorElNotifications] = useState(null);
	const allNotifications = useSelector(state => state.userNotifications)
	const unreadNotifications = allNotifications.filter(notification => notification.read === 'NO')
	const dispatch = useDispatch()

	useEffect(() => {
		socket.on('new_notification', (data) => {
			dispatch(addUserNotification(data))
		})
		return () => socket.off('new_notification')
	}, [socket, dispatch])

	const handleNotificationClick = (id, redirect_path) => {
		if (redirect_path)
			setAnchorElNotifications(null)
		profileService.readNotification(id)
		dispatch(setNotificationRead(id))
	}

	var notificationAmount
	if (unreadNotifications.length !== 0)
		notificationAmount = `${unreadNotifications.length} unread notifications`
	else
		notificationAmount = `no new notifications`

	return (
		<>
			<Menu
				sx={{ mt: '45px' }}
				id="user-notifications"
				anchorEl={anchorElNotifications}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={Boolean(anchorElNotifications)}
				onClose={() => setAnchorElNotifications(null)}
			>
				<Box sx={{ p: '0 5px', maxHeight: 500, overflow: 'auto' }}>
					{notificationAmount}
					{allNotifications.map((notification, i) => {
						var is_read = notification.read
						return (
							<Card
								key={`box${i}`}
								sx={{
									display: 'flex',
									alignItems: 'center',
									margin: '10px 0',
									padding: '5px 10px',
									backgroundColor: is_read ? '#FAFAFA' : '#e8e8e8',
									minHeight: 50,
								}}
							>
								<NotificationBadge is_read={is_read} picture={notification.picture} />
								<Typography
									key={i}
									onClick={() => handleNotificationClick(notification.id, notification.redirect_path)}
									component={notification.redirect_path ? Link : undefined}
									to={notification.redirect_path}
									sx={{ width: 300, color: 'black', textDecoration: 'none' }}
								>
									{notification.text}
								</Typography>
								<IconButton
									size='small'
									onClick={() => dispatch(deleteUserNotification(notification.id))}
								>
									<CloseIcon sx={{ fontSize: 20 }} />
								</IconButton>
							</Card>
						)
					})}
				</Box>
				<Button onClick={() => dispatch(clearUserNotifications())}>Clear notifications</Button>
				<Button onClick={() => dispatch(setAllNotificationsRead())}>Set all as read</Button>
			</Menu>
			<MenuButton unread={unreadNotifications.length} setAnchorElNotifications={setAnchorElNotifications} />
		</>
	)
}

export default NotificationMenu
