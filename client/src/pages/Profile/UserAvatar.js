import { Box, Avatar } from '@mui/material'
import AspectRatio from '@mui/joy/AspectRatio'
import { useSelector } from 'react-redux'

const UserAvatar = ({ userData }) => {
	const onlineUsers = useSelector(state => state.onlineUsers)
	const usernames = onlineUsers.map(user => user.name)
	const profile_pic = userData.profile_pic['picture_data']

	if (usernames.includes(userData.username)) {
		return (
			<Box sx={{ width: '200px', display: 'inline-block' }}>
				<AspectRatio ratio={1}>
					<Avatar
						src={profile_pic}
						alt='profile'
						sx={{
							border: 4,
							borderColor: 'rgb(68, 183, 0)',
							filter: 'drop-shadow(0px 0px 1px rgb(68, 183, 0))',
						}}
					/>
				</AspectRatio>
			</Box>
		)
	} else {
		return (
			<Box sx={{ width: '200px', display: 'inline-block' }}>
				<AspectRatio ratio={1}>
					<Avatar
						src={profile_pic}
						alt='profile'
					/>
				</AspectRatio>
			</Box>
		)
	}
}

export default UserAvatar
