import { Container, Paper, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
const PathNotExists = () => {
	return (
		<Container maxWidth='sm' sx={{ paddingTop: 6, paddingBottom: 6 }}>
			<Paper sx={{ padding: 2 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
					<Typography variant='h1' align='center'>
						404
					</Typography>
					<Typography variant='h3' align='center'>
						Page not found
					</Typography>
					<Typography align='center' sx={{ margin: 2 }}>
						Oops... We're sorry, but the page you requested cannot be found.
					</Typography>
					<Typography align='center'>
						If you're having trouble locating a destination, try visiting the:
					</Typography>
					<Button component={Link} to='/' align='center' sx={{ fontSize: 20 }}>home page</Button>
				</Box>
			</Paper>
		</Container>
	)
}

export default PathNotExists
