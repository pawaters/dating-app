import Button from '@mui/material/button'
import Footer from '../components/Footer'
import Navbar from '../components/navbar/Navbar'

const Home = () => {

    // all the variables needed before the return
    const authToken = true
    
    const handleClick = () => {
        console.log('clicked')
    } 

    // after return, no logic, just the minimum, components
    return (
        <>
        {/* Background image */}
        <div className="home">
            <h1>Swipe Right®</h1>
            <Button variant="contained" onClick={handleClick}>
                {authToken ? 'Signout' : 'Create Account'}
            </Button>
        </div>
        <Footer/>
        </>
    )
}

export default Home