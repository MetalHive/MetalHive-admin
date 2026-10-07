import { create } from 'zustand';
import api from '@/app/lib/api';
import { unwrap, unwrapList, Pagination } from '@/app/lib/unwrap';
import { getErrorMessage } from '@/app/lib/errors';

export type UserStatus = 'active' | 'suspended';

/**
 * Row of GET /admin/users (AdminUserSerializer). `name` is the display name;
 * first_name/last_name are usually empty because registration never collects
 * them.
 */
export interface User {
    id: string | number;
    name: string;
    company_name: string | null;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'buyer' | 'seller' | 'admin' | 'unknown';
    status: UserStatus;
    date_joined: string;
    last_login: string | null;
}

/** GET /admin/users/{id} (AdminUserProfileSerializer). */
export interface UserDetail extends User {
    phone?: string | null;
    country?: string | null;
    city?: string | null;
    profile_details?: Record<string, string | null> | null;
}

interface UsersStats {
    totalListings: number;
    completedTransactions: number;
    totalTransactionValue: number;
    activeUsers: number;
    sellersCount: number;
}

interface UsersState {
    users: User[];
    stats: UsersStats | null;
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    filters: {
        status: string;
        user_type: string;
        search: string;
    };

    fetchUsers: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    updateUserStatus: (id: string, status: UserStatus) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    userDetails: UserDetail | null;
    fetchUserDetails: (id: string) => Promise<void>;

    setFilter: (key: 'status' | 'user_type' | 'search', value: string) => void;
}

const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    userDetails: null,
    stats: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },
    filters: {
        status: '',
        user_type: '',
        search: '',
    },

    fetchUsers: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: Record<string, string | number> = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.user_type && filters.user_type !== 'all') params.user_type = filters.user_type;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/users', { params });
            const { items, pagination: apiPagination } = unwrapList<User>(response, 'users');

            set({
                users: items,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to fetch users'),
                loading: false
            });
        }
    },

    fetchUserDetails: async (id: string) => {
        // Keep the current record while refetching the same user so a status
        // change updates the card in place instead of unmounting the page.
        const sameUser = String(get().userDetails?.id) === String(id);
        set({ loading: true, error: null, userDetails: sameUser ? get().userDetails : null });
        try {
            const response = await api.get(`/admin/users/${id}`);
            set({ userDetails: unwrap<UserDetail>(response), loading: false });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to fetch user details'),
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/users');
            set({ stats: unwrap<UsersStats>(response) });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to fetch user stats') });
        }
    },

    updateUserStatus: async (id, status) => {
        try {
            await api.patch(`/admin/users/${id}/status`, { status });
            // Refresh user details if currently viewing that user. The route
            // param is a string while the API returns a numeric id, so compare
            // as strings or the Status card never updates.
            const currentUser = get().userDetails;
            if (currentUser && String(currentUser.id) === String(id)) {
                await get().fetchUserDetails(id);
            }
            // Also refresh list if needed
            await get().fetchUsers(get().pagination.page);
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to update user status') });
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            await get().fetchUsers(get().pagination.page);
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to delete user') });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, page: 1 }
        }));
        get().fetchUsers(1);
    }
}));

export default useUsersStore;
