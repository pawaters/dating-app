import { Paper, Typography, Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import ChatIcon from './ChatIcon'

const ChatBar = ({ connections, joinRoom }) => {
	const room = useSelector(state => state.room)


	const textColor = {
		true: 'white',
		false: 'black'
	}

	const statusColor = {
		true: 'rgb(255, 78, 104)',
		false: '#f7f7f7'
	}

	return (
		<Paper color='gray'>
			<Typography variant='h5' align='center' sx={{ pt: 1 }}>Connected</Typography>
			<Box sx={{ p: 1 }} >
				<Box>
					{connections.map(user => {
						return (
							<Button
								key={user.connection_id}
								onClick={() => joinRoom(user.connection_id)}
								sx={{
									mb: 1,
									width: 1,
									backgroundColor: statusColor[user.connection_id === room],
									color: textColor[user.connection_id === room],
									':hover': {
										backgroundColor: 'rgb(255, 78, 104, 0.95)',
										color: 'white'
									}
								}}
							>
								<Box key={user.connection_id} sx={{
									display: 'flex',
									borderBottom: '1px solid #e0e0e0',
									width: 1
								}}>
									<Box key={user.connection_id} sx={{
										display: 'inline-flex',
										alignItems: 'center',
										m: 'auto', pt: 1, pb: 1,
									}}>
										<ChatIcon
											username={user.username}
											image={user.picture_data}
										/>
										<Typography
											key={user.connection_id} variant='h6'
											sx={{
												width: 'fit-content',
												ml: 1,
												textTransform: 'none'
											}}>
											{user.username}
										</Typography>
									</Box>
								</Box>
							</Button>
						)
					})}
				</Box>
			</Box>
		</Paper>
	)
}

export default ChatBar
