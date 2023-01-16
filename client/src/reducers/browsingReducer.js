import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	min_age: 18,
	max_age: 120,
	min_fame: 0,
	max_fame: 100,
	min_distance: 0,
	max_distance: 20000
}

const browsingSlice = createSlice({
	name: 'browsingCriteria',
	initialState,
	reducers: {
		setBrowsingCriteria(state, action) {
			const content = action.payload
			return content
		},
		resetBrowsingCriteria() {
			return initialState
		}
	},
})

export const { setBrowsingCriteria, resetBrowsingCriteria } = browsingSlice.actions
export default browsingSlice.reducer
