import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Your backend API base URL
});

// Add a request interceptor to include the Authorization header with the JWT token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
        console.log('Token:', token); // Log the token
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
