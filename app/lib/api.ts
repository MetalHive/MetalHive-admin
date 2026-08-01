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

export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

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

// Access tokens live 5 minutes, so without this every admin was thrown back to
// the login screen mid-task. Refreshes are funnelled through one shared promise
// so a burst of parallel 401s produces a single refresh call rather than one
// per request (the extras would fail anyway once the token rotates).
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    // Bare axios, not `api`: going through the instance would re-enter this
    // interceptor and loop if the refresh itself 401s.
    const { data } = await axios.post(
        `${API_ROOT}/api/auth/token/refresh/`,
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
    );

    const access = data?.data?.access ?? data?.access;
    if (!access) throw new Error('Refresh response contained no access token');

    localStorage.setItem('accessToken', access);
    const rotated = data?.data?.refresh ?? data?.refresh;
    if (rotated) localStorage.setItem('refreshToken', rotated);

    return access;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            typeof window !== 'undefined'
        ) {
            originalRequest._retry = true;

            try {
                refreshPromise = refreshPromise ?? refreshAccessToken();
                const access = await refreshPromise;
                refreshPromise = null;

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch {
                refreshPromise = null;
                clearTokens();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
