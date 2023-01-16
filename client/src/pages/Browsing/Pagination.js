import { useDispatch, useSelector } from 'react-redux'
import { setDisplaySettings } from '../../reducers/displaySettingsReducer'
import { Box, Typography, FormControl, Select, MenuItem, Pagination } from '@mui/material'

const PaginationRow = ({ filteredUsers }) => {
	const dispatch = useDispatch()
	const displaySettings = useSelector(state => state.displaySettings)

	var total_results
	var final_page
	if (filteredUsers.length === 0)
		total_results = 0
	else
		total_results = filteredUsers.length
	if (total_results === 0)
		final_page = 1
	else
		final_page = Math.ceil(total_results / displaySettings.amount)

	const handleAmount = (event) => {
		dispatch(setDisplaySettings({ ...displaySettings, page: 1, amount: event.target.value }))
	}

	const handlePageChange = (event, newPage) => {
		dispatch(setDisplaySettings({ ...displaySettings, page: newPage, offset: (newPage - 1) * displaySettings.amount }))
	}

	return <>
		<Box>
			<FormControl fullWidth sx={{ mb: 2 }}>
				<Typography sx={{fontSize: "14px"}}>Amount of results per page:</Typography>
				<Select labelId='amount' id='amount' name='amount' value={displaySettings.amount} onChange={handleAmount} required>
					<MenuItem value={10} key={10}>{10}</MenuItem>
					<MenuItem value={50} key={50}>{50}</MenuItem>
					<MenuItem value={100} key={100}>{100}</MenuItem>
					<MenuItem value={250} key={250}>{250}</MenuItem>
					<MenuItem value={500} key={500}>{500}</MenuItem>
				</Select>
			</FormControl>
		</Box>
		<Pagination
			count={final_page}
			onChange={handlePageChange}
			sx={{display: 'flex', justifyContent: 'center'}}
		/>
	</>
}

export default PaginationRow
