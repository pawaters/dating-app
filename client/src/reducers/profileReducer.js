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
        console.log('In profileReducer, profile is: ', profile)
        if (profile) {
            dispatch(setProfileData(profile))
            console.log('Performed dispatch(setProfileData(profile)), I think and I hope.')
        } else {
            console.log('Couldn\'t get profileData. Went to else.')
            dispatch(setProfileData({}))
        }
    }
}

export default profileSlice.reducer