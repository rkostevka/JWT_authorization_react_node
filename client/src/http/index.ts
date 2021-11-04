import axios from 'axios';

const API_URL = `http://localhost:5000`;

const $api = axios.create({
	withCredentials:true,
	baseURL: API_URL
});

$api.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('refreshToken')}`;
	return config;
});

export default $api;