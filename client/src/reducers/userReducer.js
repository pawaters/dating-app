import { createSlice } from "@reduxjs/toolkit";

const initialState = ''

const userSlice = createSlice({
    name: 'filter',
    initialState,
    reducers:{
        setUser(state, action) {
            const content = action.payload
            return content
        }
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer