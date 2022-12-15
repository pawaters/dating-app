import { createSlice } from "@reduxjs/toolkit";

const severitySlice = createSlice({
    name: 'severity',
    initialState: 'success',
    reducers: {
        changeSeverity(state, action) {
            const content = action.payload
            return content
        }
    }
})

export const { changeSeverity } = severitySlice.actions
export default severitySlice.reducer