import { Box, Paper, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import { useNavigate} from 'react-router-dom'

const Home = () => {

    // all the variables needed before the return
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const handleClick = () => {
        if (user !== undefined && user !== '') {
            navigate('/logout')
        } else
        {
            navigate('/signup')
        }
    }       

    // after return, no logic, just the minimum, components
    return (
            <Paper 
                // component={Stack} direction="column" 
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
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                    <Box textAlign='center'>
                        <Typography 
                            variant='h1' 
                            color={'black'} 
                            fontWeight={'bold'} 
                            aligh="center"
                            sx={{ pt:5, pb:5 }}
                        >
                            Swipe Right®
                        </Typography>
                        <Button variant="contained" size="large" onClick={handleClick} >
                            {(user !== undefined && user !== '') ? 'Signout' : 'Create Account'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
    )
}

export default Home