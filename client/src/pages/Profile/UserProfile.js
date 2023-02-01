import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
	Typography, Paper, Box, Grid, Button, createTheme
} from '@mui/material'
import { Container } from '@mui/system'
import browsingService from '../../services/browsingService'
import { getUserLists } from '../../reducers/userListsReducer'
import Notification from "../../components/notification/Notification"
import Loader from "../../components/Loader"
import { changeSeverity } from "../../reducers/severityReducer"
import { changeNotification } from "../../reducers/notificationReducer"
import UserAvatar from './UserAvatar'
import PathNotExists from '../PathNotExists'

const themelike = createTheme({
	palette: {
		primary: {
			main: '#4CBB17',
		},
		secondary: {
			main: '#F5F5F5',
		},
	}
})

const themeunlike = createTheme({
	palette: {
		primary: {
			main: '#FF1E56',
		},
		secondary: {
			main: '#F5F5F5',
		},
	}
})

const ProfileInput = ({ text, input }) => {
	return (
		<Grid item xs={12} sm={6} sx={{ display: 'inline' }}>
			<Typography sx={{ width: 170, display: 'inline-block', fontWeight: '700' }}>
				{text}
			</Typography>
			<Typography sx={{ width: 'fit-content', display: 'inline' }}>
				{input}
			</Typography>
		</Grid>
	)
}

const UserProfile = () => {
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const userLists = useSelector(state => state.userLists)
	const [userData, setUserData] = useState([])
	const params = useParams()
	const onlineUsers = useSelector(state => state.onlineUsers)
	const usernames = onlineUsers.map(user => user.name)

	useEffect(() => {
		const getData = async () => {
			const userProfile = await browsingService.getUserProfile(params.id)
			setUserData(userProfile)
			setLoading(false)
			dispatch(changeNotification(''))
		}
		getData()
	}, [params, dispatch])

	if (isLoading) {
		return <Loader text="Getting user profile..." />
	}

	if (userData === false) {
		return <PathNotExists />
	}

	const other_pictures = userData.other_pictures

	const ProfileData = {
		'First name:': userData.firstname,
		'Last name:': userData.lastname,
		'Gender:': userData.gender,
		'Age:': userData.age,
		'Sexual preference:': userData.sexual_pref,
		'Location:': userData.user_location,
		'Tags:': userData.tags.map((tag, i) => ((i ? ', ' : '') + tag))
	}

	const likeUser = async (user_id) => {
		const result = await browsingService.likeUser(user_id)
		if (result === 'No profile picture') {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification('You must set a profile picture before you can like other users.'))
		} else {
			dispatch(getUserLists())
		}
	}

	const unlikeUser = async (user_id) => {
		await browsingService.unlikeUser(user_id)
		dispatch(getUserLists())
	}

	const blockUser = async (user_id) => {
		const result = await browsingService.blockUser(user_id)
		if (result === "You have already blocked this user!") {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification(`You have already blocked this user!
			If this person is still bothering you, or you accidentally blocked this user, contact the administration by e-mail.`))
		} else {
			dispatch(changeSeverity('success'))
			dispatch(changeNotification(`This user has been blocked and will not show up in your search results.
		Neither can they see you or like you anymore.`))
		}
		dispatch(getUserLists())
	}

	const reportUser = async (user_id) => {
		const result = await browsingService.reportUser(user_id)
		if (result === 'Reported user!') {
			dispatch(changeSeverity('success'))
			dispatch(changeNotification(`The user has been reported as a fake account.
						Our admin will deal with the matter as soon as possible.`))
		} else {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification(result))
		}
	}

	var likeButton
	if (userLists.connected.includes(Number(params.id))) {
		likeButton = <>
			<Button theme={themeunlike} onClick={() => { unlikeUser(params.id) }}>Unlike user</Button>
			<Button onClick={() => navigate('/chat')}>Connected</Button>
		</>
	} else if (userLists.liked.includes(Number(params.id))) {
		likeButton = <Button theme={themeunlike} onClick={() => { unlikeUser(params.id) }}>Unlike user</Button>
	} else {
		likeButton = <Button theme={themelike} onClick={() => { likeUser(params.id) }}>Like user</Button>
	}

	return (
		<Container maxWidth='md' sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Grid sx={{
					display: 'flex',
					alignContent: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 2,
				}}>
					<UserAvatar userData={userData} />
					<Box sx={{ width: 'fit-content', ml: 5 }}>
						<Grid container display='flex' sx={{ alignItems: 'center' }}>
							<Typography variant='h2' sx={{ fontSize: '250%' }}>
								{userData.username}
							</Typography>
							{usernames.includes(userData.username) ?
								<Box
									sx={{
										ml: 2,
										fontSize: 25,
										width: 'fit-content',
										height: 'fit-content',
										padding: '2px 5px',
										borderRadius: '10px',
										backgroundColor: 'rgb(68, 183, 0)',
										color: 'white',
										filter: 'drop-shadow(0px 0px 2px rgb(40, 163, 0))',
									}}>online</Box>
								: null}
						</Grid>
						<Typography variant='h5'>Fame Rating: {userData.total_pts}</Typography>
						<Box>
							{likeButton}
							<Button theme={themeunlike} onClick={() => { blockUser(params.id) }}>Block user</Button>
							<Button theme={themeunlike} onClick={() => { reportUser(params.id) }}>Report as fake account</Button>
						</Box>
					</Box>
				</Grid>
				<Grid container spacing={1} direction="row" sx={{ mb: 2 }}>
					{Object.keys(ProfileData).map((key, index) => {
						return <ProfileInput key={index} text={key} input={ProfileData[key]} />
					})}
					{!usernames.includes(userData.username) ?
						<Grid item xs={12} sm={6} sx={{ display: 'inline' }}>
							<Typography sx={{ width: 170, display: 'inline-block', fontWeight: '700' }}>
								Last connected:
							</Typography>
							<Typography sx={{ width: 'fit-content', display: 'inline' }}>
								{userData.connection_time}
							</Typography>
						</Grid>
						: null}
				</Grid>
				<Grid container sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
					<Typography sx={{ width: 'fit-content', fontWeight: '700' }}>
						{"Biography: "}
					</Typography>
					<Grid item xs={12} sm={10}>
						<Typography sx={{ width: 'fit-content' }}>
							{userData.biography}
						</Typography>
					</Grid>
				</Grid>
				<Box>
					{other_pictures.map((picture, i) =>
						<img onError={({ currentTarget }) => {
							currentTarget.onerror = null
							currentTarget.src = 'http://localhost:3000/images/default_profilepic.jpeg'
						}}
							key={picture.picture_id} alt="random_picture" height="200px" src={picture.picture_data}></img>
					)}
				</Box>
			</Paper>
			<Notification />
		</Container>
	)
}

export default UserProfile
