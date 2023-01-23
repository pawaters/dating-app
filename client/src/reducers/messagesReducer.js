import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		setMessages(state, action) {
			const content = action.payload
			return content
		},
		addMessage(state, action) {
			const content = action.payload
			return [...state, content]
		},
		resetMessage(state, action) {
			return initialState
		}
	}
})

export const { setMessages, addMessage, resetMessage } = messagesSlice.actions
export default messagesSlice.reducer
