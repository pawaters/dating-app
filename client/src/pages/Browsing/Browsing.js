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