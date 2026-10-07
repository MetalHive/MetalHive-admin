import { create } from 'zustand';
import api, { clearTokens } from '@/app/lib/api';
import { unwrap } from '@/app/lib/unwrap';
import { getErrorMessage, isHttpStatus } from '@/app/lib/errors';

/** Shape of /auth/me and the `user` member of the login response. */
export interface AuthUser {
    id: number | string;
    email: string;
    role: string | null;
    date_joined?: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginPayload {
    user: AuthUser;
    tokens: { access: string; refresh?: string };
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
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
    } catch (error: unknown) {
        if (isHttpStatus(error, 403)) return false;
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
            const { user, tokens } = unwrap<LoginPayload>(response);

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
        } catch (error: unknown) {
            set((state) => ({
                error: state.error ?? getErrorMessage(error, 'Login failed'),
                isLoading: false
            }));
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            // The backend blacklists the refresh token so it can no longer
            // mint access tokens; without it the call is a no-op server side.
            const refresh = localStorage.getItem('refreshToken');
            if (refresh) await api.post('/auth/logout/', { refresh });
        } catch (error: unknown) {
            // The session is being discarded either way.
            console.error('Logout error', error);
        } finally {
            clearTokens();
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
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
            set({ user: unwrap<AuthUser>(response), accessToken: token, isAuthenticated: true });
        } catch {
            clearTokens();
            set({ user: null, accessToken: null, isAuthenticated: false });
        }
    }
}));

export default useAuthStore;
