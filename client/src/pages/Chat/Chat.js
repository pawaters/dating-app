import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Paper, Grid, useMediaQuery, Typography, Button } from '@mui/material'
import { addMessage } from '../../reducers/messagesReducer'
import chatService from '../../services/chatService'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { changeRoom } from '../../reducers/roomReducer'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader'

const NoConnections = () => {
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: '50vh' }}
		>
			<Paper sx={{ p: 2, mt: 2, pl: 5, pr: 5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
				<Typography variant='h1'>😔</Typography>
				<Typography variant='h5' color='#1c1c1c'>No Connections</Typography>
				<Button component={Link} to='/browsing'>Browse more</Button>
			</Paper>
		</Grid>
	)
}

const Chat = ({ socket }) => {
	const matches = useMediaQuery("(max-width:650px)");
	const room = useSelector(state => state.room)
	const user = useSelector(state => state.user)
	const [connections, setConnections] = useState(undefined)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const params = useParams()

	const joinRoom = useCallback((connection_id) => {
		if (user !== '') {
			socket.emit('leave_room', { room })
			if (connection_id !== '') {
				dispatch(changeRoom(connection_id))
				socket.emit('join_room', {
					room: connection_id, user_id: user.id, username: user.name
				})
				navigate(`/chat/${connection_id}`)
			}
		}
	}, [dispatch, navigate, room, socket, user])

	useEffect(() => {
		const getConnections = async () => {
			const connections = await chatService.chat_connections()
			setConnections(connections)
		}
		getConnections()
	}, [])


	useEffect(() => {
		if (params.id && connections && room !== params.id && params.id !== ''
			&& connections.find(connection => connection.connection_id === Number(params.id))) {
			joinRoom(Number(params.id))
		}
	}, [params.id, connections, room, joinRoom])

	useEffect(() => {
		socket.on('receive_message', (data) => {
			dispatch(addMessage(data))
		})
		return () => socket.off('receive_message')
	}, [socket, dispatch])

	if (!connections) return <Loader text="Loading chat..." />
	if (connections.length === 0) return <NoConnections />

	return (
		<Container maxWidth='lg' sx={{ pt: 5, pb: 5 }}>
			<Grid container spacing={2} direction={matches ? 'column' : 'row'}>
				<Grid item xs={4} md={4}>
					<ChatBar
						connections={connections}
						joinRoom={joinRoom}
					/>
				</Grid>
				<Grid item xs={8} md={8}>
					<Paper>
						<ChatBody
							connections={connections}
						/>
						<ChatFooter
							socket={socket}
							connections={connections}
						/>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	)
}

export default Chat
