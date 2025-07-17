// src/api.js (or wherever your Axios instance is defined)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized errors globally (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If a 401 is received, it means the token is invalid or missing.
            // You might want to log out the user or redirect to login.
            console.error('API Error: Unauthorized (401). Please log in again.');
            localStorage.removeItem('token'); // Clear invalid token
            // Optionally, redirect to login page if not already there
            // window.location.href = '/login'; // Use actual router navigate in React components
            // Or you can handle this within specific components as you do in BorrowBooks.jsx
        }
        return Promise.reject(error);
    }
);

export default api;