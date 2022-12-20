import { Avatar, Grid, Paper, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useEffect, useState } from "react"
import { AspectRatio } from 'react-aspect-ratio'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate} from 'react-router-dom'
// import { getProfileData } from '../reducers/profileReducer.js'

const Profile = () => {
    const [isLoading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profileData = useSelector(state => state.profile)

    useEffect(() => {
        const getData = async () => {
            // await dispatch(getProfileData())
            setLoading(false)
        }
    }, [dispatch])

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