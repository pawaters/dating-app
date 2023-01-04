import axios from 'axios'
const baseUrl = '/api/profile'

const setUpProfile = ProfileSettings => {
	const request = axios.post(`${baseUrl}/setup`, ProfileSettings)
	return request.then(response => response.data)
}

// ProfileSettings.

const editUserSettings = ProfileSettings => {
	const request = axios.post(`${baseUrl}/editsettings`, ProfileSettings)
	return request.then(response => response.data)
}

const changePassword = passWords => {
	const request = axios.post(`${baseUrl}/changepassword`, passWords)
	return request.then(response => response.data)
}

const getProfileData = () => {
	const request = axios.get(`${baseUrl}`)
	return request.then(response => response.data)
}

const getNotifications = () => {
	const request = axios.get(`${baseUrl}/notifications`)
	return request.then(response => response.data)
}

const clearNotifications = () => {
	const request = axios.delete(`${baseUrl}/notifications`)
	return request.then(response => response.data)
}

const deleteNotification = id => {
	const request = axios.delete(`${baseUrl}/notification/${id}`)
	return request.then(response => response.data)
}

const readNotification = id => {
	const request = axios.patch(`${baseUrl}/readnotification/${id}`)
	return request.then(response => response.data)
}

const readAllNotifications = () => {
	const request = axios.patch(`${baseUrl}/readnotifications`)
	return request.then(response => response.data)
}

const setProfilePic = Picture => {
	const request = axios.post(`${baseUrl}/setprofilepic`, Picture)
	return request.then(response => response.data)
}

const uploadPicture = Picture => {
	const request = axios.post(`${baseUrl}/imageupload`, Picture)
	return request.then(response => response.data)
}

const deletePicture = PictureId => {
	const request = axios.delete(`${baseUrl}/deletepicture/${PictureId}`)
	return request.then(response => response.data)
}

const deleteUser = () => {
	const request = axios.delete(`${baseUrl}/deleteuser`)
	return request.then(response => response.data)
}

const profileService = {
	setUpProfile, getProfileData, getNotifications, clearNotifications,
	deleteNotification, readNotification, readAllNotifications, setProfilePic,
	uploadPicture, deletePicture, editUserSettings, changePassword, deleteUser
}

export default profileService