import axios from 'axios'
const baseUrl = '/api'

const createUser = signedUpUser => {
	const request = axios.post(`${baseUrl}/signup`, signedUpUser)
	return request.then(response => response.data)
}

