import { create } from 'zustand';
import api from '@/app/lib/api';

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
            set({
                user,
                accessToken: tokens.access,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false
            });
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
            localStorage.removeItem('accessToken');
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
        if (!token) return;

        try {
            const response = await api.get('/auth/me');
            set({ user: response.data.data, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('accessToken');
            set({ user: null, accessToken: null, isAuthenticated: false });
        }
    }
}));

export default useAuthStore;
