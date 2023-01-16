import { createSlice } from '@reduxjs/toolkit'
import profileService from '../services/profileService'

const initialState = []

const userNotificationSlice = createSlice({
	name: 'userNotifications',
	initialState,
	reducers: {
		setUserNotifications(state, action) {
			const content = action.payload
			return content
		},
		resetUserNotifications() {
			return initialState
		},
		removeUserNotification(state, action) {
			const id = action.payload
			return state.filter(notification =>
				notification.id !== id
			)
		},
		readUserNotification(state, action) {
			const id = action.payload
			return state.map(notification =>
				notification.id !== id
					? notification
					: { ...notification, read: 'YES' }
			)
		},
		readAllUserNotifications(state) {
			return state.map(notification => {
				return { ...notification, read: 'YES' }
			})
		},
		addUserNotification(state, action) {
			const content = action.payload
			return [content, ...state]
		}
	},
})

export const { setUserNotifications, resetUserNotifications, removeUserNotification,
	readUserNotification, readAllUserNotifications, addUserNotification } = userNotificationSlice.actions

export const getUserNotifications = () => {
	return async dispatch => {
		const notifications = await profileService.getNotifications()
		if (notifications)
			dispatch(setUserNotifications(notifications))
	}
}

export const clearUserNotifications = () => {
	return dispatch => {
		profileService.clearNotifications().then(result => {
			if (result === true)
				dispatch(resetUserNotifications())
		})
	}
}

export const deleteUserNotification = id => {
	return dispatch => {
		profileService.deleteNotification(id).then(result => {
			if (result === true)
				dispatch(removeUserNotification(id))
		})
	}
}

export const setNotificationRead = id => {
	return dispatch => {
		profileService.readNotification(id).then(result => {
			if (result === true)
				dispatch(readUserNotification(id))
		})
	}
}

export const setAllNotificationsRead = () => {
	return dispatch => {
		profileService.readAllNotifications().then(result => {
			if (result === true)
				dispatch(readAllUserNotifications())
		})
	}
}

export default userNotificationSlice.reducer
