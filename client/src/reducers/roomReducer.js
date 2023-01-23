import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		changeRoom(state, action) {
			const content = action.payload
			return content
		}
	}
})

export const { changeRoom } = notificationSlice.actions
export default notificationSlice.reducer
