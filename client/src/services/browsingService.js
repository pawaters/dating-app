import axios from 'axios'
const baseUrl = '/api/browsing'

const getUsers = searchCriteria => {
	const request = axios.post(`${baseUrl}/sorted`, searchCriteria)
	return request.then(response => response.data)
}

const likeUser = user_id => {
	const request = axios.post(`${baseUrl}/likeuser/${user_id}`)
	return request.then(response => response.data)
}

const unlikeUser = user_id => {
	const request = axios.post(`${baseUrl}/unlikeuser/${user_id}`)
	return request.then(response => response.data)
}

const blockUser = user_id => {
	const request = axios.post(`${baseUrl}/blockuser/${user_id}`)
	return request.then(response => response.data)
}

const reportUser = user_id => {
	const request = axios.post(`${baseUrl}/reportuser/${user_id}`)
	return request.then(response => response.data)
}

const getUserLists = () => {
	const request = axios.get(`${baseUrl}/userlists`)
	return request.then(response => response.data)
}

const getAllTags = () => {
	const request = axios.get(`${baseUrl}/tags`)
	return request.then(response => response.data)
}

const getUserProfile = (id) => {
	const request = axios.get(`${baseUrl}/profile/${id}`)
	return request.then(response => response.data)
}

const browsingService = {
	getUsers, likeUser, unlikeUser, blockUser, reportUser,
	getUserLists, getAllTags, getUserProfile
}

export default browsingService
