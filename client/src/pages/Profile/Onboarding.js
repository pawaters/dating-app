import { Button, FormControl, FormControlLabel, FormLabel, InputLabel, Menu, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Notification from "../../components/notification/Notification"
import { changeNotification } from "../../reducers/notificationReducer"
import { getProfileData } from "../../reducers/profileReducer"
import { changeSeverity } from "../../reducers/severityReducer"
import profileService from "../../services/profileService"


const Onboarding = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [gender, setGender] = useState('female');
	const [age, setAge] = useState('');
	const [sexual_pref, setSexpref] = useState('bisexual');

    const user = useSelector(state => state.user)

    useEffect( () => {
        if (user !== undefined && user !== '') {
            navigate('/profile')
        }
    }, [user, navigate])

    const submitUserInfo = async (event) => {
        event.preventDefault()
    
        const ProfileSettings = {
            gender: event.target.gender.value,
            age: event.target.age.value,
            location: event.target.location.value,
            gps: [event.target.gps_lat.value, event.target.gps_lon.value],
            sexual_pref: event.target.sexual_pref.value,
            biography: event.target.biography.value,
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
		//
	}

	const handleGPSLat = (event) => {
		//
	}

	const handleGPSLon = (event) => {
		//
	}

	const handleLocationSearch = async () => {
		//
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
                    <FormControl fullWidth>
                        <InputLabel id='age' required>Age</InputLabel>
                        <Select labelId="age" id='age' name="age" value={age} onChange={handleAge} required> 
                            {[...Array(103).keys()].map((i) => (
                                <MenuItem value={i + 18} key={i + 18}> {i + 18} </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                   
                    <Button type='submit' variant="contained" size="large" sx={{ mt: 2 }}> Submit </Button>
                </form>
                <Notification />
            </Paper>
        </Container>
    )
}

export default Onboarding