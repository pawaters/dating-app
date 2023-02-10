import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import Loader from "../../components/Loader";
import { changeNotification } from "../../reducers/notificationReducer";
import { changeSeverity } from "../../reducers/severityReducer";
import profileService from "../../services/profileService";
import Onboarding from "./Onboarding";
import axios from 'axios';
import {
	Typography, Button, Paper, TextField, FormControl, FormLabel,
	RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem, TextareaAutosize, Box
} from '@mui/material'
import { Tooltip, IconButton } from '@mui/material'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { Container } from '@mui/system'
import Notification from "../../components/notification/Notification";
import { TagsInput } from "./TagsInput";

const ProfileSettings = () => {
    const [isLoading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profileData = useSelector(state => state.profile)
    const [settings, changeSettings] = useState({})
    const [tags, setTagState] = useState([])

    useEffect(() => {
        // dispatch(resetNotification())
        if (profileData) {
            changeSettings({
                username: profileData.username,
				firstname: profileData.firstname,
				lastname: profileData.lastname,
				email: profileData.email,
				gender: profileData.gender,
				age: profileData.age,
				location: profileData.user_location,
				gps_lat: Number(profileData.ip_location.x),
				gps_lon: Number(profileData.ip_location.y),
				sexual_pref: profileData.sexual_pref,
				biography: profileData.biography,
				tags: profileData.tags
            })
            setTagState(profileData.tags)
        }
        setLoading(false)
    }, [dispatch, profileData])

    if (isLoading) {
        return <Loader text= "Getting profile data ..."/>
    }

    if (!profileData || !profileData.id) {
        return <Onboarding />
    }

    const submitSettings = (event) => {
        event.preventDefault()

        profileService.editUserSettings(settings).then((result) => {
            
            if (result === true) {
                dispatch(changeSeverity('success'))
                dispatch(changeNotification("Profile updated."))
                navigate('/profile')
            } else {
                dispatch(changeSeverity('error'))
                dispatch(changeNotification(result))
            }
        })
    }

    // TO DO : SEARCH a better way to create a handle functions for each and then map?
    const handleUsername = (event) => {
		changeSettings({ ...settings, username: event.target.value })
	}

	const handleFirstname = (event) => {
		changeSettings({ ...settings, firstname: event.target.value })
	}

	const handleLastname = (event) => {
		changeSettings({ ...settings, lastname: event.target.value })
	}

	const handleEmail = (event) => {
		changeSettings({ ...settings, email: event.target.value })
	}

	const handleGender = (event) => {
		changeSettings({ ...settings, gender: event.target.value })
	}

	const handleAge = (event) => {
		changeSettings({ ...settings, age: event.target.value })
	}

	const handleLocation = (event) => {
		changeSettings({ ...settings, location: event.target.value })
	}

	const handleGPSLat = (event) => {
		changeSettings({ ...settings, gps_lat: event.target.value })
	}

	const handleGPSLon = (event) => {
		changeSettings({ ...settings, gps_lon: event.target.value })
	}

    //TO DO: how to shorten that part?
    const handleLocationSearch = async () => {
		var locationData = await axios.get('https://ipapi.co/json')
		var newGPSLocation = {
			latitude: Number(locationData.data.latitude),
			longitude: Number(locationData.data.longitude),
			location: `${locationData.data.city}, ${locationData.data.country_name}`
		}

		const result = await navigator.permissions.query({ name: "geolocation" });
		if (result.state === 'granted') {
			await navigator.geolocation.getCurrentPosition(position => {
				changeSettings({
					...settings,
					location: newGPSLocation.location,
					gps_lat: Number(position.coords.latitude),
					gps_lon: Number(position.coords.longitude)
				})
				setLoading(false)
			})
		} else {
			changeSettings({
				...settings,
				location: newGPSLocation.location,
				gps_lat: Number(newGPSLocation.latitude),
				gps_lon: Number(newGPSLocation.longitude)
			})
			setLoading(false)
		}
	}

    const handleSexpref = (event) => {
		changeSettings({ ...settings, sexual_pref: event.target.value })
	}

	const handleBiography = (event) => {
		changeSettings({ ...settings, biography: event.target.value })
	}

	const setTags = (tagData) => {
		setTagState(tagData)
		changeSettings({ ...settings, tags: tagData })
	}


    return (
		<Container maxWidth='md' sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Typography variant='h5' align='center'
					sx={{ fontWeight: 550 }}>Profile</Typography>
				<Typography align='center' xs={{ mb: 4 }}>
					Edit your profile
				</Typography>
				<form onSubmit={submitSettings}>
					<TextField fullWidth margin='normal' name="username" label='Username'
						placeholder="Username" value={settings.username} onChange={handleUsername} required></TextField>
					<TextField sx={{ width: '49%', mr: '1%' }} margin='dense' name="firstname"
						label='First name' placeholder="First name" value={settings.firstname} onChange={handleFirstname} required></TextField>
					<TextField sx={{ width: '49%', ml: '1%' }} margin='dense' name="lastname"
						label='Last name' placeholder="Last name" value={settings.lastname} onChange={handleLastname} required></TextField>
					<TextField type="email" fullWidth margin='dense' name="email" label='E-mail' autoComplete="email"
						placeholder="E-mail" value={settings.email} onChange={handleEmail} required />
					<FormControl sx={{ mb: 2 }}>
						<FormLabel id='gender'>Gender</FormLabel>
						<RadioGroup row aria-labelledby='gender' name='gender' value={settings.gender} onChange={handleGender}>
							<FormControlLabel value='female' control={<Radio />} label='Female' />
							<FormControlLabel value='male' control={<Radio />} label='Male' />
							<FormControlLabel value='other' control={<Radio />} label='Other' />
						</RadioGroup>
					</FormControl>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel id='age'>Age</InputLabel>
						<Select labelId='age' id='age' name='age' value={settings.age} onChange={handleAge} required>
							{[...Array(103).keys()].map((i) => (
								<MenuItem value={i + 18} key={i + 18}>{i + 18}</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField fullWidth margin='normal' name="location" label='Location' value={settings.location} onChange={handleLocation}
						placeholder="Location" sx={{ mb: 2 }} required></TextField>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<TextField fullWidth margin='normal' name="gps_lat" label='GPS latitude' value={settings.gps_lat} onChange={handleGPSLat}
							placeholder="GPS latitude" sx={{ mb: 2, width: 300 }} required></TextField>
						<TextField fullWidth margin='normal' name="gps_lon" label='GPS longitude' value={settings.gps_lon} onChange={handleGPSLon}
							placeholder="GPS longitude" sx={{ ml: 2, mb: 2, width: 300 }} required></TextField>
						<Tooltip title="Locate with GPS">
							<IconButton onClick={handleLocationSearch} sx={{ ml: 3 }}>
								<LocationSearchingIcon />
							</IconButton>
						</Tooltip>
					</Box>
					<FormControl sx={{ mb: 2 }}>
						<FormLabel id='sexual_pref'>Sexual Preference</FormLabel>
						<RadioGroup row aria-labelledby='sexual_pref' name='sexual_pref' value={settings.sexual_pref} onChange={handleSexpref} >
							<FormControlLabel value='bisexual' control={<Radio />} label='Bisexual' />
							<FormControlLabel value='male' control={<Radio />} label='Male' />
							<FormControlLabel value='female' control={<Radio />} label='Female' />
						</RadioGroup>
					</FormControl>
					<br />
					<FormLabel id='biography' >Biography</FormLabel>
					<TextareaAutosize
						name='biography'
						style={{ width: '100%', marginTop: '10px' }}
						maxLength={500}
						minRows={5}
						value={settings.biography}
						onChange={handleBiography}
						placeholder='Short description of you here...'
					/>
					<FormLabel id='tags' >Tags</FormLabel>
					<TagsInput tags={tags} setTags={setTags} formerTags={profileData.tags}/>
					<Button type="submit" variant='contained'
						size='large' sx={{ mt: 1 }}>
						Save settings
					</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	)
}

export default ProfileSettings