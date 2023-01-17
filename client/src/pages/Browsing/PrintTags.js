import { Grid, Typography } from '@mui/material'
import TurnedInIcon from '@mui/icons-material/TurnedIn'

const SplitTags = ({ tags }) => {
	let result = ''
	for (let i = 0; i < tags.length; i++) {
		if (i < 3) {
			if (i === 1 && tags.length === 3) {
				result += tags[i] + ' and '
			}
			else if (i === tags.length - 1 || i === 2) {
				result += tags[i]
			} else {
				result += tags[i] + ', '
			}
		} else {
			result += ` and ${tags.length - 3} more`
			break
		}
	}
	return result
}

const PrintTags = ({ tags, common_tags }) => {
	if (tags.length === 0) return null

	return (
		<Grid display='flex' sx={{ alignItems: 'center' }}>
			<TurnedInIcon sx={{ color: 'gray', mr: 1 }} />
			<Typography sx={{ fontWeight: 550 }}>
				<SplitTags tags={tags} />
			</Typography>
			<Typography sx={{ fontWeight: 550, ml: 1, color: 'gray' }}>({common_tags} common)</Typography>
		</Grid>
	)
}

export default PrintTags
