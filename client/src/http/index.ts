import axios from 'axios';
import { AuthResponse } from '../../models/response/AuthResponse';
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

$api.interceptors.response.use((config) => {
	return config;
}, async (error) => {
	const oringinalRequest = error.config;
	if(error.response.status == 401 && error.config && !oringinalRequest._isRetry) {
		oringinalRequest._isRetry = true;
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
			localStorage.setItem('refreshToken', response.data.accessToken);
			return $api.request(oringinalRequest);
		} catch(e) {
			console.log('Not authorized')
		}
	}
	throw error;
});

export default $api;