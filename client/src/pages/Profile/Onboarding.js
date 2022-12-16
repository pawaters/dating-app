import { Button, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material"
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
                    
                    {/* <TextField fullWidth margin='normal' name='username' label='Username' placeholder="Username" autoComplete="nickname" required> </TextField>
                    <TextField sx={{ width: '49%', mr: '1%' }} margin='normal' name='firstname' label='First name' placeholder="First name" autoComplete="given-name" required> </TextField>
                    <TextField sx={{ width: '50%'}} margin='normal' name='lastname' label='Last name' placeholder="Last name" autoComplete="family-name" required> </TextField>
                    <TextField fullWidth margin='normal'  name='email' label='E-mail' placeholder="E-mail" autoComplete="email" required> </TextField>
                    <TextField sx={{ width: '49%', mr: '1%' }} margin='normal' type="password" name='password' label='Password' placeholder="Password" autoComplete="new-password" required> </TextField>
                    <TextField sx={{ width: '50%'}} margin='normal' type="password" name='confirm_password' label='Confirm Password' placeholder="Confirm Password" autoComplete="confirm-password" required> </TextField> */}
                    <Button type='submit' variant="contained" size="large" sx={{ mt: 2 }}> Submit </Button>
                </form>
                <Notification />
            </Paper>
        </Container>
    )
}

export default Onboarding