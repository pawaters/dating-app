import { Avatar, Box, styled, Badge } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BrowsingUserIcon = ({ user }) => {
	const navigate = useNavigate()
	const onlineUsers = useSelector(state => state.onlineUsers)
	const usernames = onlineUsers.map(user => user.name)

	const StyledBadge = styled(Badge)(({ theme }) => ({
		'& .MuiBadge-badge': {
			backgroundColor: '#44b700',
			color: '#44b700',
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			transform: 'translate(-4px, -4px) scale(2)',
			'&::after': {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				borderRadius: '50%',
				animation: 'ripple 2.2s infinite ease-in-out',
				border: '1px solid currentColor',
				content: '""',
			},
		},
		'@keyframes ripple': {
			'0%': {
				transform: 'scale(.8) translate(-0.9px, -0.9px)',
				opacity: 1,
			},
			'100%': {
				transform: 'scale(2.4) translate(-0.9px, -0.9px)',
				opacity: 0,
			},
		},
	}))

	if (usernames.includes(user.username)) {
		return (
			<Box sx={{ padding: 1 }}>
				<StyledBadge
					overlap="rectangular"
					anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
					variant="dot"
				>
					<Avatar
						variant="rounded"
						key={user.id}
						alt="profile_picture"
						src={user.profile_pic}
						onClick={() => navigate(`/profile/${user.id}`)}
						sx={{ width: '200px', height: '200px', cursor: 'pointer' }}
					/>
				</StyledBadge>
			</Box>
		)
	} else {
		return (
			<Box sx={{ padding: 1 }}>
				<Avatar
					variant="rounded"
					key={user.id}
					alt="profile_picture"
					src={user.profile_pic}
					onClick={() => navigate(`/profile/${user.id}`)}
					sx={{ width: '200px', height: '200px', cursor: 'pointer' }}
				/>
			</Box>
		)
	}
}

export default BrowsingUserIcon
