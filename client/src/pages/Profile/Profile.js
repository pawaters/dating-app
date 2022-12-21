import { Avatar, Grid, Paper, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useEffect, useState } from "react"
import { AspectRatio } from 'react-aspect-ratio'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate} from 'react-router-dom'
import { getProfileData } from '../../reducers/profileReducer'
import Loader from '../../components/Loader'
import Onboarding from '../../pages/Profile/Onboarding'

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
        return <Loader  text= "Getting profile data ..."/>
    }

    if (!profileData.id) {
        return <Onboarding />
    }

    const profile_pic = profileData.profile_pic['picture_data']
    const other_pictures = profileData.other_pictures

    const ProfileData = {
		'First name:': profileData.firstname,
		'Last name:': profileData.lastname,
		'Email address:': profileData.email,
		'Gender:': profileData.gender,
		'Age:': profileData.age,
		'Sexual preference:': profileData.sexual_pref,
		'Location:': profileData.user_location,
		'GPS:': Object.values(profileData.ip_location).map((value, i) => ((i ? ', ' : '') + value)),
		// 'Tags:': profileData.tags.map((tag, i) => ((i ? ', ' : '') + tag)),
    }

    return (
        <Container>
            <Paper>
                <Grid>
                    <Box>
                        <AspectRatio>
                            <Avatar 
                                // src={profile_pic}
                                alt='profile'
                            
                            />
                        </AspectRatio>
                    </Box>
                </Grid>
            </Paper>
        </Container>
        
    )

}

export default Profile