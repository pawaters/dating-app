import { useSelector } from 'react-redux'
import { Avatar, Tooltip, styled, Badge } from '@mui/material'

const ChatIcon = ({ username, image }) => {
	const onlineUsers = useSelector(state => state.onlineUsers)
	const usernames = onlineUsers.map(user => user.name)

	const StyledBadge = styled(Badge)(({ theme }) => ({
		'& .MuiBadge-badge': {
			backgroundColor: '#44b700',
			color: '#44b700',
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			'&::after': {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				borderRadius: '50%',
				animation: 'ripple 1.2s infinite ease-in-out',
				border: '1px solid currentColor',
				content: '""',
			},
		},
		'@keyframes ripple': {
			'0%': {
				transform: 'scale(.8)',
				opacity: 1,
			},
			'100%': {
				transform: 'scale(2.4)',
				opacity: 0,
			},
		},
	}));

	if (usernames.includes(username)) {
		return (
			<StyledBadge
				overlap="circular"
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				variant="dot"
			>
				<Tooltip title={username}>
					<Avatar src={image} alt={username} />
				</Tooltip>
			</StyledBadge>
		)
	} else {
		return (
			<Tooltip title={username}>
				<Avatar src={image} alt={username} />
			</Tooltip>
		)
	}
}

export default ChatIcon
