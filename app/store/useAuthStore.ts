import { create } from 'zustand';
import api, { clearTokens } from '@/app/lib/api';

interface User {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

// /auth/me exposes neither is_staff nor is_superuser, and role comes back null
// for the superuser — so there is nothing on the user object to gate on. Ask
// the backend instead: it answers 403 on the admin routes for everyone who
// isn't an admin, which makes it the authority rather than a second guess at
// one. Any other failure (network, 5xx) is not treated as "not an admin".
const confirmAdminAccess = async (): Promise<boolean> => {
    try {
        await api.get('/admin/stats/overview');
        return true;
    } catch (error: any) {
        if (error.response?.status === 403) return false;
        throw error;
    }
};

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false,
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login/', credentials);
            const { user, tokens } = response.data.data;

            localStorage.setItem('accessToken', tokens.access);
            // Previously discarded, which is why sessions died with the access
            // token after 5 minutes.
            if (tokens.refresh) localStorage.setItem('refreshToken', tokens.refresh);

            if (!(await confirmAdminAccess())) {
                clearTokens();
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: 'This account does not have admin access.',
                });
                throw new Error('Not an admin account');
            }

            set({
                user,
                accessToken: tokens.access,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error: any) {
            set((state) => ({
                error: state.error ?? error.response?.data?.message ?? 'Login failed',
                isLoading: false
            }));
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await api.post('/auth/logout/');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            clearTokens();
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            set({ user: null, accessToken: null, isAuthenticated: false });
            return;
        }

        try {
            // Trailing slash matters: without it Django 301s to /auth/me/ and
            // every auth check pays a second round trip.
            const response = await api.get('/auth/me/');
            if (!(await confirmAdminAccess())) throw new Error('Not an admin account');
            set({ user: response.data.data, accessToken: token, isAuthenticated: true });
        } catch (error) {
            clearTokens();
            set({ user: null, accessToken: null, isAuthenticated: false });
        }
    }
}));

export default useAuthStore;
