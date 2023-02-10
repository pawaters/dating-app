import { Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextareaAutosize, TextField, Tooltip, Typography } from "@mui/material"
import { Container } from "@mui/system"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/Loader"
import Notification from "../../components/notification/Notification"
import { changeNotification } from "../../reducers/notificationReducer"
import { getProfileData } from "../../reducers/profileReducer"
import { changeSeverity } from "../../reducers/severityReducer"
import profileService from "../../services/profileService"
import LocationSearchIcon from "@mui/icons-material/LocationSearching"
import { TagsInput } from "./TagsInput"


const Onboarding = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [gender, setGender] = useState('female')
	const [age, setAge] = useState('')
	const [sexual_pref, setSexpref] = useState('bisexual')
    const [GPSlocation, setGPSLocation] = useState()
    const [isLoading, setLoading] = useState(true)
    const [tags, setTagState] = useState([])

    const getLocationData = async () => {
        var locationData = await axios.get('https://ipapi.co/json')
        var newGPSLocation = {
            latitude: Number(locationData.data.latitude),
            longitude: Number(locationData.data.longitude),
            location: `${locationData.data.city}, ${locationData.data.country_name}`
        }

        const result = await navigator.permissions.query({ name: "geolocation"})

        const successGeolocation = async (position) => {
            newGPSLocation.latitude = Number(position.coords.latitude)
            newGPSLocation.longitude = Number(position.coords.longitude)
            var city_data = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
            newGPSLocation.location = `${city_data.data.city}, ${city_data.data.country_name}`
            setGPSLocation(newGPSLocation)
            setLoading(false)
        }

        const geoLocationOptions = {
            enableHighAccuracy: true,
            maximumAge: 0
        }

        if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
                successGeolocation,
                null,
                geoLocationOptions
            )
        } else {
            setGPSLocation(newGPSLocation)
            setLoading(false)
        }
    }

    useEffect( () => {
        getLocationData()
    }, [])

    if (isLoading) {
        return <Loader text="Finding your location..." />
    }


    const submitUserInfo = async (event) => {
        event.preventDefault()
    
        const ProfileSettings = {
            gender: event.target.gender.value,
            age: event.target.age.value,
            location: event.target.location.value,
            gps: [event.target.gps_lat.value, event.target.gps_lon.value],
            sexual_pref: event.target.sexual_pref.value,
            biography: event.target.biography.value,
            tags: tags
        }

        profileService.setUpProfile(ProfileSettings)
            .then(result => {
                
                if (result === true) {
                    dispatch(changeSeverity('success'))
                    dispatch(changeNotification('Profile updated successfully. Loading Profile now with new data...'))
                    dispatch(getProfileData())
                    navigate('/profile')
                } else {
                    dispatch(changeSeverity('error'))
                    dispatch(changeNotification(result))
                }
            })
    }

    const handleGender = (event) => {
		setGender(event.target.value);
	}

    const handleAge = (event) => {
		setAge(event.target.value);
	}

	const handleSexpref = (event) => {
		setSexpref(event.target.value);
	}

    const handleLocation = (event) => {
		setGPSLocation({ ...GPSlocation, location: event.target.value})
	}

	const handleGPSLat = (event) => {
		setGPSLocation({ ...GPSlocation, latitude: event.target.value})
	}

	const handleGPSLon = (event) => {
		setGPSLocation({ ...GPSlocation, longitude: event.target.value})
	}

	const handleLocationSearch = async () => {
		getLocationData()
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

    return (
        <Container 
        sx={{ 
            pt:5, 
            pb: 5,
            backgroundImage: `url("https://assets.materialup.com/uploads/cd7deaa7-e263-4c1b-98c9-132d248fc0d4/preview.png")`,
            backgroundSize: 'cover',
            width: 'auto',
            height: 'auto',
            minHeight: '80vh',
        }}
        >
            <Paper elevation={10} sx={{ padding: 3, width:'50%', margin: 'auto'}} >
                <Typography variant="h2"> Complete your profile </Typography>
                <form onSubmit={submitUserInfo}>
                    <FormControl margin="dense"> 
                        <FormLabel id="gender">Gender:</FormLabel>
                        <RadioGroup row aria-labelledby='gender' name="gender" value={gender} onChange={handleGender}>
                            <FormControlLabel value='female' control={<Radio />} label='Female' />
                            <FormControlLabel value='male' control={<Radio />} label='Male' />
                            <FormControlLabel value='other' control={<Radio />} label='Other' />
                        </RadioGroup>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id='age' required>Age</InputLabel>
                        <Select labelId="age" id='age' name="age" value={age} onChange={handleAge} required> 
                            {[...Array(103).keys()].map((i) => (
                                <MenuItem value={i + 18} key={i + 18}> {i + 18} </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField fullWidth margin="normal" name="location" label="location" value={GPSlocation.location} 
                    onChange={handleLocation} required />
                    <Box sx={{ display: 'flex'}}>
                        <TextField fullWidth margin="normal" name="gps_lat" label="GPS latitude" value={GPSlocation.latitude}
                        onChange={handleGPSLat} required />
                        <TextField fullWidth margin="normal" name="gps_lon" label="GPS longitude" value={GPSlocation.longitude}
                        onChange={handleGPSLon} required />
                        <Tooltip title="Locate with GPS">
                            <IconButton onClick={handleLocationSearch}>
                                <LocationSearchIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <FormControl margin="dense"> 
                        <FormLabel id="sexual_pref">Sexual Preference:</FormLabel>
                        <RadioGroup row aria-labelledby='sexual_pref' name="sexual_pref" value={sexual_pref} onChange={handleSexpref}>
                            <FormControlLabel value='bisexual' control={<Radio />} label='Bisexual' />
                            <FormControlLabel value='male' control={<Radio />} label='Male' />
                            <FormControlLabel value='female' control={<Radio />} label='Female' />
                        </RadioGroup>
                    </FormControl>
                    <br />
                    <FormLabel id='biography' required margin="dense">Biography:</FormLabel>
                    <TextareaAutosize 
                        name="biography"
						style={{ width: '95%'}}
						maxLength={500}
						minRows={5}
						placeholder='Short description of you here...'
						required
                    />
                    <TagsInput tags={tags} setTags={setTagState} formerTags={[]} />
                    <Box>
                        <Button>
                            <label> Set profile picture</label>
                            <input type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture} />
                        </Button>
                        <Button>
                            <label> Add other picture</label>
                            <input type="file" name="file" id="image_upload" accept="image/jpeg, image/png, image/jpg" onChange={uploadImage} />
                        </Button>
                    </Box>
                    <br />
                    {/* <Tags to be added after profilesettings page*/}
                    <Button type='submit' variant="contained" size="large" sx={{ mt: 2 }}> Save Profile </Button>
                </form>
                <Notification />
            </Paper>
        </Container>
    )
}

export default Onboarding