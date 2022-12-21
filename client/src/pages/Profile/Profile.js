import * as React from 'react'
import { Avatar, Button, Grid, Paper, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate} from 'react-router-dom'
import { getProfileData } from '../../reducers/profileReducer'
import Loader from '../../components/Loader'
import Onboarding from '../../pages/Profile/Onboarding'
import profileService from "../../services/profileService"
import { changeSeverity } from "../../reducers/severityReducer"
import { changeNotification } from "../../reducers/notificationReducer"

const ProfileInput = ({ text, input }) => {
    return (
        <Grid item xs={12} sm={6} sx={{ display: 'inline'}}>
            <Typography sx={{ width: 170, display: 'inline-block', textAlign: 'left'}}>
                {text}
            </Typography>
            <Typography sx={{ width: 'fit-content', display: 'inline', textAlign: 'left'}}>
                {input}
            </Typography>
        </Grid>
    )
}

const Profile = () => {
    // const [isLoading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
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

    //Fake data to start building
    const profileData = {}
    
    profileData.firstname = 'Pierre'
    profileData.lastname = 'Waters'
    profileData.email = 'email'
    profileData.gender = 'Male'
    profileData.age = '37'
    profileData.sexual_pref = 'Hetero'
    profileData.user_location = 'Helsinki'
    profileData.Username = 'pwaters'
    profileData.biography = 'super interesting bio'

    const ProfileData = {
		'First name:': profileData.firstname,
		'Last name:': profileData.lastname,
		'Email address:': profileData.email,
		'Gender:': profileData.gender,
		'Age:': profileData.age,
		'Sexual preference:': profileData.sexual_pref,
		'Location:': profileData.user_location,
	// 	'GPS:': Object.values(profileData.ip_location).map((value, i) => ((i ? ', ' : '') + value)),
	// 	'Tags:': profileData.tags.map((tag, i) => ((i ? ', ' : '') + tag)),
    }
    // _______________________

    // //replace with a hook as this code might be repeated in other parts?

    // const deleteImage = async (id) => {
	// 	if (window.confirm("Are you sure you want to delete this picture?")) {
	// 		await profileService.deletePicture(id)
	// 		dispatch(getProfileData())
	// 	}
	// }

    // //replace with a hook as this code is repeated from other parts?

    const uploadImage = async (event) => {
		const image = event.target.files[0]
		if (image.size > 5242880) {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification("The maximum size for uploaded images is 5 megabytes."))
		} else {
			let formData = new FormData()
			formData.append('file', image)
			const result = await profileService.uploadPicture(formData)
			if (result === true) {
				dispatch(getProfileData())
				dispatch(changeSeverity('success'))
				dispatch(changeNotification("Image uploaded successfully!"))
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		}
		event.target.value = ''
	}

    const setProfilePicture = async (event) => {
		const image = event.target.files[0]
		if (image.size > 5242880) {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification("The maximum size for uploaded images is 5 megabytes."))

		} else {
			let formData = new FormData()
			formData.append('file', image)
			const result = await profileService.setProfilePic(formData)
			if (result === true) {
				dispatch(getProfileData())
				dispatch(changeSeverity('success'))
				dispatch(changeNotification("Profile picture set!"))
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		}
		event.target.value = ''
	}

    const deleteUser = () => {
		if (window.confirm("Are you sure you want to completely delete your account?")) {
			if (window.confirm("Are you really really sure?")) {
				navigate('/deleteuser')
			}
		}
	}

    return (
        <Container maxWidth='md' sx={{ pt: 5, pb: 5 }} >
            <Paper elevation={10} sx={{ padding: 3 }}>
                <Grid 
                    sx={{
                        display: 'flex',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    <Box sx={{ width: '200px', display: 'inline-block' }}>
                        <Avatar 
                            src='https://v3.mui.com/static/images/avatar/1.jpg' 
                            sx={{ width: 156, height: 156 }}
                        />
                    </Box> 
                    <Box>
                        <Typography variant='h2'>
                            {profileData.Username}
                        </Typography>
                        <Typography variant='h5'>Fame rating - pending</Typography>
                    </Box>
                </Grid>
                <Grid container spacing={1} direction="row" sx={{mb:2}}>
                    {Object.keys(ProfileData).map((key, index) => {
                            return <ProfileInput key={index} text={key} input={ProfileData[key]} />
                        })}
                </Grid>
                <Grid>
                    <Typography>
                        {"Biography: "}
                    </Typography>
                    <Grid>
                        <Typography>
                            {profileData.biography}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid >
                    <Button variant='outlined' onClick={() => navigate('/settings')}> Edit profile</Button>
                    <Button variant='outlined' onClick={() => navigate('/changepassword')}> Change password</Button>
                    <Button>
                        <label>Change profile picture</label>
                        <input type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture}></input>
                    </Button>
                    <Button>
                        <label>Add new picture</label>
                        <input type="file" name="file" id="image_upload" accept="image/jpeg, image/png, image/jpg" onChange={uploadImage}></input>
                    </Button>
                    <Button variant='contained' onClick={() => deleteUser}> Delete user </Button>
                </Grid>
            </Paper>
        </Container>
        
    )

}

export default Profile