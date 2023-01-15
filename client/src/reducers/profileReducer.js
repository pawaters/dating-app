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
            console.log('Dispathed setProfileData in profileReducer')
            dispatch(setProfileData(profile))
        } else {
            console.log('Went to else in profileReducer')
            dispatch(setProfileData({}))
        }
    }
}

export default profileSlice.reducer