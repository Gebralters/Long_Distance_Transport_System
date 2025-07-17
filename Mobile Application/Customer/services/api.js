import axios from 'axios';

const API_URL = 'http://192.168.31.74:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (credentials) => api.post('/login', credentials);
export const createRideBooking = (bookingData) => api.post('/ride-bookings', bookingData);
export const getAvailableRides = () => api.get('/rides');
export const getCustomerProfile = (userId) => api.get(`/customerProfile/${userId}`);
