import api from './api';

const authService = {
    // Redirects to backend OAuth login route
    login: () => {
        window.location.href = `${api.defaults.baseURL}/oauth/login`;
    },

    // Fetch current user details
    getCurrentUser: async () => {
        try {
            const response = await api.get('/oauth/user');
            return response.data.userData;
        } catch (error) {
            // If user is not logged in, this will fail
            console.error('Failed to fetch user:', error);
            throw error;
        }
    },

    // Logout (clears cookie on client side if possible, but HTTP-only cookies must be cleared by backend)
    // Since backend api analysis didn't show a specific logout route that clears cookies, 
    // we might just need to rely on the browser or add a logout route to backend.
    // For now, we'll just reload or clear local state.
    logout: () => {
        // Ideally, backend should have a /oauth/logout endpoint to clear the cookie.
        // We will assume for now we just redirect or clear state.
        window.location.href = '/';
    }
};

export default authService;
