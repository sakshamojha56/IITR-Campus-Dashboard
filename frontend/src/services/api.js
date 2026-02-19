import axios from 'axios';

// Backend URL from environment variable (VITE_API_URL must be set in .env.local)
// Falls back to localhost:8081 for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for handling HTTP-only cookies (JWT)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle 401 errors (expired session)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If we get a 401, the user is likely not logged in or session expired
            // We could redirect to login or clear local state here
            // window.location.href = '/'; 
            console.warn('Unauthorized access - session might be expired');
        }
        return Promise.reject(error);
    }
);

export default api;
