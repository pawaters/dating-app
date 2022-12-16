import { createSlice } from "@reduxjs/toolkit";
import BrowsingService from "../services/browsingService";

const initialState = { liked: [], connected: [], blocked: [] }

const userListSlice = createSlice({
    name: 'userLists',
    initialState,
    reducers: {
        setUserLists(state,action) {
            const content = action.payload
            return content
        },
        resetUserLists() {
            return initialState
        }
    }
})

export const { setUserLists, resetUserLists} = userListSlice.actions

export const getUserLists = () => {
    return async dispatch => {
        const userLists = await BrowsingService.getUserLists()
        if (userLists) {
            dispatch(setUserLists(userLists))
        }
    }
}

export default userListSlice.reducer