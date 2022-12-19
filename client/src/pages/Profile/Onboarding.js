import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, Menu, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/Loader"
import Notification from "../../components/notification/Notification"
import { changeNotification } from "../../reducers/notificationReducer"
import { getProfileData } from "../../reducers/profileReducer"
import { changeSeverity } from "../../reducers/severityReducer"
import profileService from "../../services/profileService"


const Onboarding = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [gender, setGender] = useState('female')
	const [age, setAge] = useState('')
	const [sexual_pref, setSexpref] = useState('bisexual')
    const [GPSlocation, setGPSLocation] = useState()
    const [isLoading, setLoading] = useState(true)
    const [tags, setTagstate] = useState([])

    const getLocationData = async() => {
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
        return <Loader text="Finding your location..."/>
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
        // console.log('user:', user,'empty space right before that?')
        // console.log(ProfileSettings)

        profileService.setUpProfile(ProfileSettings)
            .then(result => {
                
                if (result === true) {
                    dispatch(changeSeverity('success'))
                    dispatch(changeNotification('Profile updated successfully'))
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
                    <FormControl>
                        <FormLabel id="gender">gender</FormLabel>
                        <RadioGroup row name="gender" value={gender} onChange={handleGender}>
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
                    <Box>
                        <TextField fullWidth margin="normal" name="gps_lat" label="GPS latitude" value={GPSlocation.latitude}
                        onChange={handleGPSLat} required />
                        <TextField fullWidth margin="normal" name="gps_lon" label="GPS longitude" value={GPSlocation.longitude}
                        onChange={handleGPSLon} required />
                        
                    </Box>
                   
                    <Button type='submit' variant="contained" size="large" sx={{ mt: 2 }}> Submit </Button>
                </form>
                <Notification />
            </Paper>
        </Container>
    )
}

export default Onboarding