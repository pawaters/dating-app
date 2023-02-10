import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Container, Paper, Typography, useMediaQuery, Grid, Box, FormControl, FormLabel, RadioGroup,
	FormControlLabel, Radio
} from '@mui/material'
import browsingService from '../../services/browsingService'
import Loader from '../../components/Loader' 
import { useDispatch, useSelector } from 'react-redux'
import { getUserLists } from '../../reducers/userListsReducer'
import { resetNotification } from '../../reducers/notificationReducer'
import NotificationSnackbar from '../../components/NotificationSnackbar'
import PaginationRow from './Pagination'
import SortAndFilterOptions from './SortAndFilterOptions'
import UserPreviews from './UserPreviews'
import RecommendedPreviews from './RecommendedPreviews'
import { changeNotification } from '../../reducers/notificationReducer'
import { changeSeverity } from '../../reducers/severityReducer'

const filterUsers = (users, filters, profileData) => {
	var filteredUsers = users

	if (filters.nameFilter)
		filteredUsers = users.filter(user => user.username.toLowerCase().includes(filters.nameFilter.toLowerCase()))

	if (filters.locationFilter) {
		filteredUsers = filteredUsers.filter(user =>
			user.user_location.toLowerCase().includes(filters.locationFilter.toLowerCase()))
	}

	if (filters.tagFilter) {
		filteredUsers = filteredUsers.filter(user => {
			
			return filters.tagFilter.every(tag => {
				return tag.tagged_users.includes(user.id)
			})
		})
	}

	const filterSex = () => {
		switch (true) {
			case (profileData.gender === 'male' && profileData.sexual_pref === 'male'):
				return filteredUsers.filter(user => user.gender === 'male' && (user.sexual_pref === 'male' || user.sexual_pref === 'bisexual'))
			case (profileData.gender === 'male' && profileData.sexual_pref === 'female'):
				return filteredUsers.filter(user => user.gender === 'female' && (user.sexual_pref === 'male' || user.sexual_pref === 'bisexual'))
			case (profileData.gender === 'male' && profileData.sexual_pref === 'bisexual'):
				return filteredUsers.filter(user => user.sexual_pref === 'male' || user.sexual_pref === 'bisexual')
			case (profileData.gender === 'female' && profileData.sexual_pref === 'male'):
				return filteredUsers.filter(user => user.gender === 'male' && (user.sexual_pref === 'female' || user.sexual_pref === 'bisexual'))
			case (profileData.gender === 'female' && profileData.sexual_pref === 'female'):
				return filteredUsers.filter(user => user.gender === 'female' && (user.sexual_pref === 'female' || user.sexual_pref === 'bisexual'))
			case (profileData.gender === 'female' && profileData.sexual_pref === 'bisexual'):
				return filteredUsers.filter(user => user.sexual_pref === 'female' || user.sexual_pref === 'bisexual')
			case (profileData.gender === 'other' && profileData.sexual_pref === 'male'):
				return filteredUsers.filter(user => user.gender === 'male' && user.sexual_pref === 'bisexual')
			case (profileData.gender === 'other' && profileData.sexual_pref === 'female'):
				return filteredUsers.filter(user => user.gender === 'female' && user.sexual_pref === 'bisexual')
			case (profileData.gender === 'other' && profileData.sexual_pref === 'bisexual'):
				return filteredUsers.filter(user => user.sexual_pref === 'bisexual')
			default:
				return filteredUsers
		}
	}
	return filterSex()
}

const sortUsers = (filteredUsers, displaySettings) => {
	const sorting = displaySettings.sorting
	const sort_order = displaySettings.sort_order

	switch (true) {
		case (sorting === 'age' && sort_order === 'asc'):
			return filteredUsers.sort((a, b) => (a.age > b.age ? 1 : -1))
		case (sorting === 'age' && sort_order === 'desc'):
			return filteredUsers.sort((a, b) => (a.age > b.age ? -1 : 1))
		case (sorting === 'distance' && sort_order === 'asc'):
			return filteredUsers.sort((a, b) => (a.distance > b.distance ? 1 : -1))
		case (sorting === 'distance' && sort_order === 'desc'):
			return filteredUsers.sort((a, b) => (a.distance > b.distance ? -1 : 1))
		case (sorting === 'fame_rating' && sort_order === 'asc'):
			return filteredUsers.sort((a, b) => (a.fame_rating > b.fame_rating ? 1 : -1))
		case (sorting === 'fame_rating' && sort_order === 'desc'):
			return filteredUsers.sort((a, b) => (a.fame_rating > b.fame_rating ? -1 : 1))
		case (sorting === 'common_tags' && sort_order === 'asc'):
			return filteredUsers.sort((a, b) => (a.common_tags > b.common_tags ? 1 : -1))
		case (sorting === 'common_tags' && sort_order === 'desc'):
			return filteredUsers.sort((a, b) => (a.common_tags > b.common_tags ? -1 : 1))
		default:
			return filteredUsers
	}
}

export const RecommendedUsers = ({ users, browsingCriteria }) => {
	const [sorting, setSorting] = useState('recommended')
	const [sortOrder, setSortOrder] = useState('asc')
	const profileData = useSelector(state => state.profile)

	let filters = { nameFilter: null, locationFilter: null, tagFilter: null }
	const filteredUsers = filterUsers(users, filters, profileData)
	const nearUsers = filteredUsers.filter(user => user.distance < 1000)
	const commonTagUsers = nearUsers.filter(user => user.common_tags > 0)

	let sortedUsers
	if (sorting === 'recommended') {
		sortedUsers = commonTagUsers.sort((a, b) => {
			let aValue = a.distance / Math.pow(a.common_tags, 2)
			let bValue = b.distance / Math.pow(b.common_tags, 2)
			return (aValue > bValue ? 1 : -1)
		})
	} else {
		let recommendedDisplay = {sorting: sorting, sort_order: sortOrder}
		sortedUsers = sortUsers(commonTagUsers, recommendedDisplay)
	}

	const handleSorting = (event) => {
		setSorting(event.target.value)
	}

	const handleSortOrder = async (event) => {
		setSortOrder(event.target.value)
	}

	return (
		<>
			<Paper sx={{ mb: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
				<Typography align='center' sx={{ m: 1, fontWeight: 700, fontSize: 20 }}>Recommended Users for You</Typography>
				<Paper sx={{ mb: 2, display: 'flex', justifyContent: 'center', elevation: 0 }}>
				<FormControl>
					<FormLabel id='sorted_by'>Sorted by:</FormLabel>
					<RadioGroup row aria-labelledby='sorted_by' name='sorted_by' value={sorting} onChange={handleSorting}>
						<FormControlLabel value='recommended' control={<Radio />} label='Recommended' />
						<FormControlLabel value='distance' control={<Radio />} label='Distance' />
						<FormControlLabel value='age' control={<Radio />} label='Age' />
						<FormControlLabel value='fame_rating' control={<Radio />} label='Fame Rating' />
						<FormControlLabel value='common_tags' control={<Radio />} label='Common tags' />
					</RadioGroup>
				</FormControl>
				<Box>
					<FormControl>
						<FormLabel id='asc_desc'>Sort order:</FormLabel>
						<RadioGroup row aria-labelledby='asc_desc' name='asc_desc' value={sortOrder} onChange={handleSortOrder}>
							<FormControlLabel value='asc' control={<Radio />} label='Ascending' />
							<FormControlLabel value='desc' control={<Radio />} label='Descending' />
						</RadioGroup>
					</FormControl>
				</Box>
			</Paper>
				<Container sx={{ display: 'flex', justifyContent: 'left', overflowX: 'auto' }}>
					<RecommendedPreviews
						users={sortedUsers}
						browsingCriteria={browsingCriteria}
					/>
				</Container>
			</Paper>
		</>
	)
}

const Browsing = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const matches = useMediaQuery("(max-width:1000px)")
	const [isLoading, setLoading] = useState(true)
	const [users, setUsers] = useState([])
	const [nameFilter, setNameFilter] = useState()
	const [locationFilter, setLocationFilter] = useState()
	const [tagFilter, setTagFilter] = useState([])

	const profileData = useSelector(state => state.profile)
	const browsingCriteria = useSelector(state => state.browsingCriteria)
	const displaySettings = useSelector(state => state.displaySettings)

	useEffect(() => {
		dispatch(resetNotification())
		const getUsers = async () => {
			const allUsers = await browsingService.getUsers(browsingCriteria)
			if (allUsers && allUsers !== "Fetching users failed") {
				setUsers(allUsers)
				setLoading(false);
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification('Fetching users failed'))
				navigate('/profile')
			}
			await dispatch(getUserLists())
		}
		getUsers()
	}, [dispatch, navigate, browsingCriteria])

	if (isLoading || !profileData) {
		return <Loader text="Getting users data.." />
	}

	let filters = { nameFilter: nameFilter, locationFilter: locationFilter, tagFilter: tagFilter }
	let filteredUsers = filterUsers(users, filters, profileData)
	let sortedUsers = sortUsers(filteredUsers, displaySettings)
	let pageUsers = sortedUsers.slice(displaySettings.offset, displaySettings.offset + displaySettings.amount)

	const paperStyles = {
		padding: '15px',
		marginBottom: '10px',
	}

	return (
		<Container maxWidth='xl' sx={{ pt: 5, pb: 5 }}>
			<RecommendedUsers users={filteredUsers} browsingCriteria={browsingCriteria} />
			<NotificationSnackbar />
			<Grid container columnSpacing={2} direction={matches ? 'column' : 'row'}>
				<Grid item xs={4}>
					<Paper style={paperStyles}>
						<Typography variant='h5' component='h1' sx={{ mb: 2 }}>
							Advanced Search
						</Typography>
						<PaginationRow filteredUsers={filteredUsers} />
						<SortAndFilterOptions
							setLocationFilter={setLocationFilter}
							setNameFilter={setNameFilter}
							setTagFilter={setTagFilter}
							browsingCriteria={browsingCriteria}
							setUsers={setUsers} />
					</Paper>
				</Grid>
				<Grid item xs={8}>
					<UserPreviews
						pageUsers={pageUsers}
						browsingCriteria={browsingCriteria}
					/>
				</Grid>
			</Grid>
		</Container>
	)

}

export default Browsing
