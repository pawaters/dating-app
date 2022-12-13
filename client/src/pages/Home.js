import { Box, Paper, Typography } from '@mui/material'
import Button from '@mui/material/button'
import { Container } from '@mui/system'
import { createRoutesFromElements } from 'react-router-dom'

const Home = () => {

    // all the variables needed before the return
    const authToken = false

    const vartest = () => {
    }
    
    const handleClick = () => {
        console.log('clicked')
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
                    <Box>
                        <Typography 
                            variant='h1' 
                            color={'black'} 
                            fontWeight={'bold'} 
                            sx={{ pt:5, pb:5 }}
                        >
                            Swipe Right®
                        </Typography>
                        <Button variant="contained" size="large" onClick={handleClick}>
                            {authToken ? 'Signout' : 'Create Account'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
    )
}

export default Home