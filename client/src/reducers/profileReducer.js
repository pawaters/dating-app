import { createSlice } from "@reduxjs/toolkit";
import profileService from "../services/profileService";

const profileSlice = createSlice({
    name: 'profile',
    initialState: null,
    reducers: {
        setProfileData(state, action) {
            const content = action.payload
            return content
        },
        resetProfileData(state, action) {
            return {}
        }
    }
})

export const { setProfileData, resetProfileData} = profileSlice.actions

export const getProfileData = () => {
    return async dispatch => {
        const profile = await profileService.getProfileData()
       

        console.log('profile in profileReducer after getProfileData()', profile)
        if (profile) {
            console.log('ProfileReducer: Dispatched setProfileData')
            dispatch(setProfileData(profile))
        } else {
            console.log('ProfileReducer: Profile is empty - setProfileData to empty')
            dispatch(setProfileData({}))
        }
    }
}

export default profileSlice.reducer