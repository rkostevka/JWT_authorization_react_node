import axios from 'axios';
const API_URL = `http://localhost:5000/api`;


const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL
});

$api.interceptors.request.use(config => {
	if(config) {
		config.headers!.authorization = `Bearer ${localStorage.getItem('token')}`;
	}
	return config;
});

export default $api;