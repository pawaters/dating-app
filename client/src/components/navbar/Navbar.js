import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	AppBar, Container, Toolbar, Box, IconButton,
	Menu, MenuItem, Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { ReactComponent as Logo } from '../../images/white-tinder-logo.svg'
import { useSelector } from 'react-redux'
// import UserMenu from './UserMenu'

const NavBar = ({ socket }) => {
	const [anchorElNav, setAnchorElNav] = useState(null)

	const user = useSelector(state => state.user)
	// const user = "user" 


	let pages = {}

	if (user === '') {
		pages = {
			'Login': '/login',
			'Signup': '/signup',
		}
	} else {
		pages = {
			'Profile': '/profile',
			'Browsing': '/browsing',
			'Chat': '/chat',
			'Log Out': '/logout'
		}
	}

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Box
						component={Link}
						to='/'
						sx={{
							display: { xs: 'none', md: 'flex', marginRight: 20 },
							height: '40px'
						}}
					>
					  <Logo width="100%" height="100%"/>
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							keepMounted
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							{
								Object.keys(pages).map((page) => {
									return (
										<MenuItem key={page} onClick={handleCloseNavMenu} component={Link} to={pages[page]}>
											{page}
										</MenuItem>
									)
								})
							}
						</Menu>
					</Box>
					<Box
						sx={{
							flexGrow: 1,
							height: '40px',
							display: { xs: 'flex', md: 'none' }
						}}
						component={Link}
						to='/'
					>
						<Logo width="100%" height="100%" />
					</Box>

					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{
							Object.keys(pages).map((page) => {
								return (
									<Button
										color="inherit"
										key={page}
										onClick={handleCloseNavMenu}
										sx={{ mr: 2 }}
										component={Link} to={pages[page]}
									>
										{page}
									</Button>
								)
							})
						}
					</Box>
					{/* <UserMenu user={user} socket={socket} /> */}
				</Toolbar>
			</Container>
		</AppBar >
	)
}

export default NavBar