import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Container, Paper, Typography, useMediaQuery, Grid, Box, FormControl, FormLabel, RadioGroup,
	FormControlLabel, Radio
} from '@mui/material'
import browsingService from '../../services/browsingService'
import { useDispatch, useSelector } from 'react-redux'
import { getUserLists } from '../../reducers/userListsReducer'
import { resetNotification } from '../../reducers/notificationReducer'
import { changeNotification } from '../../reducers/notificationReducer'
import { changeSeverity } from '../../reducers/severityReducer'
import Loader from '../../components/Loader'

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

const Browsing = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const matches = useMediaQuery("(max-width:1000px)") //depending on true / false, we will display in diff direction
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
		return <Loader text="Getting users data.."/>
	}

	let filters = { nameFilter: nameFilter, locationFilter: locationFilter, tagFilter: tagFilter }
	let filteredUsers = filterUsers(users, filters, profileData)
	let sortedUsers = sortUsers(filteredUsers, displaySettings)
	let pageUsers = sortedUsers.slice(displaySettings.offset, displaySettings.offset + displaySettings.amount)


    return (
		<Container maxWidth='xl' sx={{ pt: 5, pb: 5 }}>
			{/* <RecommendedUsers users={filteredUsers} browsingCriteria={browsingCriteria} /> */}
			{/* <NotificationSnackbar /> */}
			<Grid container columnSpacing={2} >
            {/* direction={matches ? 'column' : 'row'} */}
				<Grid item xs={4}>
					<Paper>
						<Typography variant='h5' component='h1' sx={{ mb: 2 }}>
							Advanced Search
						</Typography>
						{/* <PaginationRow filteredUsers={filteredUsers} /> */}
						{/* <SortAndFilterOptions
							setLocationFilter={setLocationFilter}
							setNameFilter={setNameFilter}
							setTagFilter={setTagFilter}
							browsingCriteria={browsingCriteria}
							setUsers={setUsers} /> */}
					</Paper>
				</Grid>
				<Grid item xs={8}>
					{/* <UserPreviews
						pageUsers={pageUsers}
						browsingCriteria={browsingCriteria}
					/> */}
				</Grid>
			</Grid>
		</Container>
	)

}

export default Browsing