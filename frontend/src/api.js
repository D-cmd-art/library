// src/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Ensure this base URL matches your Node.js backend server's address and API prefix
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor to include the token in headers
// This is useful for protected routes after login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
