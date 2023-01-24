import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../reducers/userReducer'
import notificationReducer from '../reducers/notificationReducer'
import severityReducer from '../reducers/severityReducer'
import profileReducer from '../reducers/profileReducer'
import onlineUsersReducer from '../reducers/onlineUsersReducer'
import browsingReducer from '../reducers/browsingReducer'
import userListsReducer from '../reducers/userListsReducer'
import displaySettingsReducer from '../reducers/displaySettingsReducer'
import roomReducer from '../reducers/roomReducer'
import messagesReducer from '../reducers/messagesReducer'
import userNotificationsReducer from '../reducers/userNotificationsReducer'

const store = configureStore({
	reducer: {
		user: userReducer,
		notification: notificationReducer,
		severity: severityReducer,
		profile: profileReducer,
		onlineUsers: onlineUsersReducer,
		browsingCriteria: browsingReducer,
		displaySettings: displaySettingsReducer,
		userLists: userListsReducer,
		room: roomReducer,
		messages: messagesReducer,
		userNotifications: userNotificationsReducer,
	}
})

export default store
