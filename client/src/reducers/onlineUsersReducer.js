import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const onlineUsersSlice = createSlice({
	name: 'onlineUsers',
	initialState,
	reducers: {
		changeOnlineUsers(state, action) {
			const content = action.payload
			return content
		}
	}
})

export const { changeOnlineUsers } = onlineUsersSlice.actions
export default onlineUsersSlice.reducer

