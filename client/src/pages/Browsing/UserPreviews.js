import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
	Button, Paper, Box, Typography, Grid
} from '@mui/material'
import BrowsingUserIcon from './BrowsingUserIcon'
import browsingService from '../../services/browsingService'
import { setBrowsingCriteria } from '../../reducers/browsingReducer'
import { getUserLists } from '../../reducers/userListsReducer'
import { changeNotification } from '../../reducers/notificationReducer'
import { changeSeverity } from '../../reducers/severityReducer'
import PrintTags from './PrintTags'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import BlockIcon from '@mui/icons-material/Block'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import WcIcon from '@mui/icons-material/Wc'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import TodayIcon from '@mui/icons-material/Today';

const NoResults = () => {
	return (
		<Paper sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
			<Typography variant='h1'>😔</Typography>
			<Typography variant='h5' color='#1c1c1c'>No Results</Typography>
			<Typography variant='body2'>PLEASE ADJUST YOUR FILTERS</Typography>
		</Paper>
	)
}

const UserPreviews = ({ pageUsers, browsingCriteria }) => {
	const userLists = useSelector(state => state.userLists)
	const navigate = useNavigate()
	const dispatch = useDispatch()

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
		await browsingService.blockUser(user_id)
		dispatch(getUserLists())
		dispatch(setBrowsingCriteria({ ...browsingCriteria }))
	}

	if (pageUsers.length === 0) {
		return <NoResults />
	}
	return (
		pageUsers.map(user => {
			var button, gender
			//return connected used
			if (userLists.connected.includes(user.id)) {
				button = <>
					<Button onClick={() => { unlikeUser(user.id) }}>Unlike user</Button>
					<Button onClick={() => navigate('/chat')}>Connected</Button>
				</>
			} else if (userLists.liked.includes(user.id)) {
				button = <Button onClick={() => { unlikeUser(user.id) }}><ThumbDownAltIcon sx={{ mr: 1 }} />Unlike user</Button>
			} else {
				button = <Button onClick={() => { likeUser(user.id) }}><ThumbUpIcon sx={{ mr: 1 }} />Like user</Button>
			}

			if (user.gender === 'male') {
				gender = <MaleIcon sx={{
					ml: 1,
					fontSize: '200%',
					color: '#89CFF0',
					filter: 'drop-shadow(0 2px 1px rgb(31, 73, 102))'
				}} />
			} else {
				gender = <FemaleIcon sx={{
					ml: 1,
					fontSize: '200%',
					color: '#FF7779',
					filter: 'drop-shadow(0 2px 1px rgb(184, 84, 86))'
				}} />
			}
			if (!user.id) {
				return (<div key="emptyusers"></div>)
			} else
				return (
					<Paper key={`profile_container${user.id}`} sx={{ mb: 1 }}>
						<Grid container display='flex' sx={{ alignItems: 'center' }}>
							<Grid item>
								<BrowsingUserIcon user={user} />
							</Grid>
							<Grid item>
								<Box key={`profile_data${user.id}`}>
									<Grid display='flex' sx={{ alignItems: 'center' }}>
										<Typography
											variant='h3'
											onClick={() => navigate(`/profile/${user.id}`)}
											sx={{ cursor: 'pointer', fontSize: '150%' }}
										>{user.username}</Typography>
										<Grid item>{gender}</Grid>
									</Grid>
									<Grid display='flex' sx={{ alignItems: 'center', mb: 1 }}>
										<Grid display='flex'
											sx={{
												mr: 1, mt: '4px', border: '1px solid gray',
												borderRadius: '10px', padding: '2px 5px',
												backgroundColor: '#f1f1f1'
											}}>
											<WhatshotIcon sx={{ color: 'red' }} />
											<Typography sx={{ fontWeight: 550 }}>{user.fame_rating}</Typography>
										</Grid>
										<Grid display='flex'>
											{button}
										</Grid>
									</Grid>
									<Box sx={{ ml: 1 }}>
										<Grid display='flex' sx={{ alignItems: 'center' }}>
											<WcIcon sx={{ color: 'gray', mr: 1 }} />
											<Typography sx={{ fontWeight: 550 }}>{user.sexual_pref}</Typography>
										</Grid>
										<Grid display='flex' sx={{ alignItems: 'center' }}>
											<LocationOnIcon sx={{ color: 'gray', mr: 1 }} />
											<Typography sx={{ fontWeight: 550 }}>{user.user_location} ({Math.round(user.distance)} km)</Typography>
										</Grid>
										<Grid display='flex' sx={{ alignItems: 'center' }}>
											<TodayIcon sx={{ color: 'gray', mr: 1 }} />
											<Typography sx={{ fontWeight: 550 }}>{`${user.age} years old`}</Typography>
										</Grid>
										<PrintTags tags={user.tags} common_tags={user.common_tags} />
									</Box>
									<Button onClick={() => { blockUser(user.id) }}>
										<BlockIcon sx={{ mr: 1 }} />
										Block user
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Paper>
				)
		}
		))
}

export default UserPreviews
