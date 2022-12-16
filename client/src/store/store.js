import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../reducers/userReducer'
import notificationReducer from '../reducers/notificationReducer'
// import severityReducer from './reducers/severityReducer'

const store = configureStore({
	reducer: {
		user: userReducer,
		notification: notificationReducer,
		// severity: severityReducer,
	}
})

export default store