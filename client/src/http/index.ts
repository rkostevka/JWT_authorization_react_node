import axios from 'axios';
export const API_URL = `http://localhost:5000/api`;


const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL
});

$api.interceptors.request.use(config => {
	if(config) {
		config.headers!.authorization = `Bearer ${localStorage.getItem('refreshToken')}`;
		console.log("interceptors" + config.headers!.authorization);
	}
	return config;
});

export default $api;