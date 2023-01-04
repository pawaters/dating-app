import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../reducers/userReducer'
import notificationReducer from '../reducers/notificationReducer'
import severityReducer from '../reducers/severityReducer'
import profileReducer from '../reducers/profileReducer'


const store = configureStore({
	reducer: {
		user: userReducer,
		notification: notificationReducer,
		severity: severityReducer,
		profile: profileReducer,
	}
})

export default store