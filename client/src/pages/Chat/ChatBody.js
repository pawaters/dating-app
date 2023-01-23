import { useSelector, useDispatch } from 'react-redux'
import { Typography, Box, Paper } from '@mui/material'
import ChatIcon from './ChatIcon'
import chatService from '../../services/chatService'
import { useEffect } from 'react'
import { setMessages } from '../../reducers/messagesReducer'

const ChatBody = ({ connections }) => {
	const profileData = useSelector(state => state.profile)
	const room = useSelector(state => state.room)
	const user = useSelector(state => state.user)
	const messages = useSelector(state => state.messages)
	const dispatch = useDispatch()

	useEffect(() => {
		if (room !== '') {
			chatService.getRoomMessages(room)
				.then(data => dispatch(setMessages(data)))
		}
	}, [room, dispatch])

	if (room === '') return (
		<Typography
			variant='h4'
			align='center'
			sx={{ p: 2 }}
		>
			Choose your Matcha!
		</Typography>
	)

	return (
		<>
			<div className='chat_mainHeader'>
				<Typography variant='h5'>Find your true love</Typography>
			</div>

			{messages.map(message => {
				if (message.name === user.name) {
					return (
						<Box key={message.key} sx={{
							display: 'flex', alignItems: "flex-start",
							justifyContent: 'flex-end', mb: 1
						}}>
							<Box sx={{ width: 3 / 4 }}>
								<Paper sx={{ ml: 1, background: 'rgb(240, 246, 233)' }}>
									<Typography sx={{ p: 1 }}>{message.text}</Typography>
								</Paper>
							</Box>
							<Box sx={{ ml: 1, mr: 1 }}>
								<ChatIcon username={message.name} image={profileData?.profile_pic['picture_data']} />
							</Box>
						</Box>
					)
				} else {
					var userFromConnections = connections.find(user => user.username === message.name)
					if (!userFromConnections) return null
					var profile_pic = userFromConnections?.picture_data
					return (
						<Box key={message.key} sx={{
							display: 'flex', alignItems: "flex-start",
							justifyContent: 'flex-start', mb: 1
						}}>
							<Box sx={{ ml: 1 }}>
								<ChatIcon username={message.name} image={profile_pic} />
							</Box>
							<Box sx={{ width: 3 / 4 }}>
								<Paper sx={{ ml: 1, background: 'rgb(233, 240, 243)' }}>
									<Typography sx={{ p: 1 }}>{message.text}</Typography>
								</Paper>
							</Box>
						</Box>
					)
				}
			})}
		</>
	)
}

export default ChatBody
