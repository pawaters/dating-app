import { Typography, withStyles } from '@mui/material'
import Button from '@mui/material/button'
import { Container } from '@mui/system'

const Home = () => {

    // all the variables needed before the return
    const authToken = false
    // const WhiteTextTypography = withStyles({
    //     root: {
    //         color: "#FFFFFF",
    //     }
    // })
    
    const handleClick = () => {
        console.log('clicked')
    } 

    // after return, no logic, just the minimum, components
    return (
        <div style={{ backgroundImage: `url("https://assets.materialup.com/uploads/cd7deaa7-e263-4c1b-98c9-132d248fc0d4/preview.png")` }}>
            <Container maxWidth='sm' sx={{ pt:5, pb: 5}}>
                <Typography variant='h1' color={'black'} fontWeight={'bold'} sx={{ pt:5, pb:5 }}>Swipe Right®</Typography>
                <Button variant="contained" size="large" onClick={handleClick}>
                    {authToken ? 'Signout' : 'Create Account'}
                </Button>
            </Container>
        </div>
    )
}

export default Home