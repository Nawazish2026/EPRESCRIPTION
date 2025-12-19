import axios from 'axios';

// The base URL is now handled by the Vite proxy in development.
// For production, you would set VITE_API_URL to your deployed backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies (like for session-based auth or httpOnly cookies)
});

// Add a request interceptor to include the token in headers for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global errors, like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is 401, it could mean the token is expired or invalid.
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token may be invalid or expired.");
      localStorage.removeItem('authToken');
      // Force a reload to redirect to the login page via the routing logic in App.jsx
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;