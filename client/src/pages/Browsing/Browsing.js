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

const Browsing = () => {
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