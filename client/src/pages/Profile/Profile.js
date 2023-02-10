import * as React from 'react'
import { Avatar, Button, Grid, Paper, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { getProfileData } from '../../reducers/profileReducer'
import Loader from '../../components/Loader'
import profileService from "../../services/profileService"
import { changeSeverity } from "../../reducers/severityReducer"
import { changeNotification } from "../../reducers/notificationReducer"
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Notification from '../../components/notification/Notification'
import Onboarding from './Onboarding'

const ProfileInput = ({ text, input }) => {
    return (
        <Grid item xs={12} sm={6} sx={{ display: 'inline' }}>
            <Typography sx={{ width: 170, display: 'inline-block', textAlign: 'left' }}>
                {text}
            </Typography>
            <Typography sx={{ width: 'fit-content', display: 'inline', textAlign: 'left' }}>
                {input}
            </Typography>
        </Grid>
    )
}

const Profile = () => {
    const [isLoading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profileData = useSelector(state => state.profile)

    useEffect(() => {
        const getData = async () => {
            await dispatch(getProfileData())
            setLoading(false)
        }
        getData()
    }, [dispatch])

    if (isLoading) {
        return <Loader text="Getting profile data ..." />
    }

    if (!profileData.id) {
        return <Onboarding />
    }

    const profile_pic = profileData.profile_pic['picture_data']
    const other_pictures = profileData.other_pictures

    const userid = profileData.id;
    const ProfileData = {
        'First name:': profileData.firstname,
        'Last name:': profileData.lastname,
        'Email address:': profileData.email,
        'Gender:': profileData.gender,
        'Age:': profileData.age,
        'Sexual preference:': profileData.sexual_pref,
        'Location:': profileData.user_location,
        'GPS:': Object.values(profileData.ip_location).map((value, i) => ((i ? ', ' : '') + value)),
        'Tags:': profileData.tags.map((tag, i) => ((i ? ', ' : '') + tag)),
        'Users you have liked:': profileData.liked.map((liked, i) => {
            return (
                <Typography key={i}
                    component={Link} to={`/profile/${liked.target_id}`}>
                    {(i ? ', ' : '') + liked.username}
                </Typography>)
        }),
        'Users who liked you:': profileData.likers.map((liker, i) => {
            return (
                <Typography key={i}
                    component={Link} to={`/profile/${liker.liker_id}`}>
                    {(i ? ', ' : '') + liker.username}
                </Typography>)
        }),
        'Users who watched your profile:': profileData.watchers.map((watcher, i) => {
            return (
                <Typography key={i}
                    component={Link} to={`/profile/${watcher.watcher_id}`}>
                    {(i ? ', ' : '') + watcher.username}
                </Typography>)
        })
    }
    // _______________________

    // //replace with a hook as this code might be repeated in other parts?

    const deleteImage = async (id) => {
        if (window.confirm("Are you sure you want to delete this picture?")) {
            const result = await profileService.deletePicture(id)
            if (result === 'Picture deleted') {
                dispatch(getProfileData())
                dispatch(changeSeverity('success'))
                dispatch(changeNotification("Picture deleted successfully!"))
            } else {
                dispatch(changeSeverity('error'))
                dispatch(changeNotification(result))
            }
        }
    }


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

    const deleteUser = (id) => {
        if (window.confirm("Are you sure you want to completely delete your account?")) {
            if (window.confirm("Are you sure? There is no way to retrieve your data afterwards.")) {
                profileService.deleteUser().then(result => {
                    if (result === true) {
                        dispatch(changeSeverity('success'))
                        dispatch(changeNotification("User has been successfully deleted. Next!"))
                        navigate('/logout')
                    } else {
                        dispatch(changeSeverity('error'))
                        dispatch(changeNotification(result))
                    }
                })
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
                            src={profile_pic}
                            alt='profile'
                            sx={{ width: 112, height: 112 }}
                        />
                    </Box>
                    <Box>
                        <Typography variant='h2'>
                            {profileData.Username}
                        </Typography>
                        <Typography variant='h5'>Fame rating: {profileData.total_pts} </Typography>
                    </Box>
                </Grid>
                <Grid container spacing={1} direction="row" sx={{ mb: 2 }}>
                    {Object.keys(ProfileData).map((key, index) => {
                        return <ProfileInput key={index} text={key} input={ProfileData[key]} />
                    })}
                </Grid>
                <Grid sx={{ mb: 2 }} >
                    <Typography>
                        {"Biography: "}
                    </Typography>
                    <Typography style={{ wordWrap: "break-word" }}>
                        {profileData.biography}
                    </Typography>
                </Grid>
                <Stack direction="row" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />} spacing={2} mb={2}>
                    <Button variant='outlined' onClick={() => navigate('/settings')}>Edit profile</Button>
                    <Button variant='outlined' onClick={() => navigate('/changepassword')}>Change password</Button>
                </Stack>
                <Stack justifyContent="center" alignItems="flex-start" mb={2} spacing={2}>
                    <Button>
                        <label>   Change profile picture : </label>
                        <input type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture}></input>
                    </Button>
                    <div id="other_pictures">
                        {other_pictures.map((picture, i) =>
                            <div key={i}>
                                <img onError={({ currentTarget }) => {
                                    currentTarget.onerror = null
                                    currentTarget.src = 'http://localhost:3000/images/default_profilepic.jpeg'
                                }}
                                    key={picture.picture_id} alt="random_picture" height="100px" src={picture.picture_data}></img>
                                <Button onClick={() => { deleteImage(picture.picture_id) }} >Delete picture</Button>
                            </div>
                        )}
                    </div>
                    <Button>
                        <label>   Add new picture : </label>
                        <input type="file" name="file" id="image_upload" accept="image/jpeg, image/png, image/jpg" onChange={uploadImage}></input>
                    </Button>
                    <Button variant='outlined' onClick={() => deleteUser(userid)}>Delete user </Button>
                </Stack>
            </Paper>
            <Notification />
        </Container>

    )
}

export default Profile