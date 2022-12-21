import * as React from 'react'
import { Avatar, Grid, Paper, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useEffect, useState } from "react"
import { AspectRatio } from 'react-aspect-ratio'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate} from 'react-router-dom'
import { getProfileData } from '../../reducers/profileReducer'
import Loader from '../../components/Loader'
import Onboarding from '../../pages/Profile/Onboarding'
import profileService from "../../services/profileService"
import { changeSeverity } from "../../reducers/severityReducer"
import { changeNotification } from "../../reducers/notificationReducer"

const Profile = () => {
    // const [isLoading, setLoading] = useState(true)
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    // const profileData = useSelector(state => state.profile)

    // useEffect(() => {
    //     const getData = async () => {
    //         await dispatch(getProfileData())
    //         setLoading(false)
    //     }
    //     getData()
    // }, [dispatch])

    // // if (isLoading) {
    // //     return <Loader  text= "Getting profile data ..."/>
    // // }

    // // if (!profileData.id) {
    // //     return <Onboarding />
    // // }

    // const profile_pic = profileData.profile_pic['picture_data']
    // const other_pictures = profileData.other_pictures

    // _______________________
    // DATA REQUESTED FROM BACKEND _______________________
    // _______________________

    // const ProfileData = {
	// 	'First name:': profileData.firstname,
	// 	'Last name:': profileData.lastname,
	// 	'Email address:': profileData.email,
	// 	'Gender:': profileData.gender,
	// 	'Age:': profileData.age,
	// 	'Sexual preference:': profileData.sexual_pref,
	// 	'Location:': profileData.user_location,
		// 'GPS:': Object.values(profileData.ip_location).map((value, i) => ((i ? ', ' : '') + value)),
		// 'Tags:': profileData.tags.map((tag, i) => ((i ? ', ' : '') + tag)),
    // }
    // _______________________
    
    // //replace with a hook as this code might be repeated in other parts?
    // const deleteImage = async (id) => {
	// 	if (window.confirm("Are you sure you want to delete this picture?")) {
	// 		await profileService.deletePicture(id)
	// 		dispatch(getProfileData())
	// 	}
	// }

    // //replace with a hook as this code is repeated from other parts?
    // const uploadImage = async (event) => {
	// 	const image = event.target.files[0]
	// 	if (image.size > 5242880) {
	// 		dispatch(changeSeverity('error'))
	// 		dispatch(changeNotification("The maximum size for uploaded images is 5 megabytes."))
	// 	} else {
	// 		let formData = new FormData()
	// 		formData.append('file', image)
	// 		const result = await profileService.uploadPicture(formData)
	// 		if (result === true) {
	// 			dispatch(getProfileData())
	// 			dispatch(changeSeverity('success'))
	// 			dispatch(changeNotification("Image uploaded successfully!"))
	// 		} else {
	// 			dispatch(changeSeverity('error'))
	// 			dispatch(changeNotification(result))
	// 		}
	// 	}
	// 	event.target.value = ''
	// }

    // const setProfilePicture = async (event) => {
	// 	const image = event.target.files[0]
	// 	if (image.size > 5242880) {
	// 		dispatch(changeSeverity('error'))
	// 		dispatch(changeNotification("The maximum size for uploaded images is 5 megabytes."))

	// 	} else {
	// 		let formData = new FormData()
	// 		formData.append('file', image)
	// 		const result = await profileService.setProfilePic(formData)
	// 		if (result === true) {
	// 			dispatch(getProfileData())
	// 			dispatch(changeSeverity('success'))
	// 			dispatch(changeNotification("Profile picture set!"))
	// 		} else {
	// 			dispatch(changeSeverity('error'))
	// 			dispatch(changeNotification(result))
	// 		}
	// 	}
	// 	event.target.value = ''
	// }

    // const deleteUser = () => {
	// 	if (window.confirm("Are you sure you want to completely delete your account?")) {
	// 		if (window.confirm("Are you really really sure?")) {
	// 			navigate('/deleteuser')
	// 		}
	// 	}
	// }

    return (
        <Container>
            <Paper>
                <Grid>
                    <Box>
                        <AspectRatio>
                            <Avatar 
                                src="/src/images/profilepic.jpeg"
                                alt="profile"
                            />
                        </AspectRatio>
                    </Box>
                    <Box>
                        <Typography>
                            Username
                        </Typography>
                    </Box>
                </Grid>
            </Paper>
        </Container>
        
    )

}

export default Profile