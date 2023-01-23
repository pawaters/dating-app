import { Button, Input } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const ChatFooter = ({ socket, connections }) => {
	const [message, setMessage] = useState('')
	const room = useSelector(state => state.room)
	const user = useSelector(state => state.user)

	if (room === '') return null
	const receiver_user = connections.find(user => user.connection_id === room)
	if (receiver_user === undefined) return null

	const handleSendMessage = (e) => {
		e.preventDefault()
		if (message.trim() && user) {
			socket.emit('send_message', {
				text: message,
				sender_id: user.id,
				receiver_id: receiver_user.id,
				name: user.name,
				room: room,
				key: `${user.id}-${room}-${Date.now()}`
			})
		}
		setMessage('')
	}

	return (
		<div className='chat_footer'>
			<form className='form' onSubmit={handleSendMessage}>
				<Input
					type='text'
					placeholder='Type a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button type='submit'>Send</Button>
			</form>
		</div>
	)
}

export default ChatFooter
