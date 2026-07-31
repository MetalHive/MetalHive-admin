import axios from 'axios';

// NEXT_PUBLIC_API_URL is the server root (e.g. http://localhost:8001). Every
// backend route lives under /api, and Django serves its own admin site at
// /admin — so omitting the prefix sent calls like /admin/listings to Django's
// admin login and returned a 302 instead of JSON. Tolerate either form.
const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001')
    .replace(/\/+$/, '')
    .replace(/\/api$/, '');

const api = axios.create({
    baseURL: `${API_ROOT}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (e.g., token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Could implement refresh token logic here if needed
            // For now, might just clear storage or redirect
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
