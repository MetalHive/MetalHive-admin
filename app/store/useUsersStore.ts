import { create } from 'zustand';
import api from '@/app/lib/api';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'buyer' | 'seller' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    date_joined: string;
    last_login: string;
}

interface UsersState {
    users: User[];
    stats: {
        totalListings: number;
        completedTransactions: number;
        totalTransactionValue: number;
        activeUsers: number;
        sellersCount: number;
    } | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    filters: {
        status: string;
        user_type: string;
        search: string;
        date_range: string;
    };

    fetchUsers: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    updateUserStatus: (id: string, status: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    userDetails: User | null;
    fetchUserDetails: (id: string) => Promise<void>;

    setFilter: (key: string, value: string) => void;
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
        date_range: '30 days',
    },

    fetchUsers: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.user_type && filters.user_type !== 'all') params.user_type = filters.user_type;
            if (filters.search) params.search = filters.search;
            // Note: date_range handling depends on backend implementation

            const response = await api.get('/admin/users', { params });
            const { users, pagination: apiPagination } = response.data.data;

            set({
                users,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch users',
                loading: false
            });
        }
    },

    fetchUserDetails: async (id: string) => {
        set({ loading: true, error: null, userDetails: null });
        try {
            const response = await api.get(`/admin/users/${id}`);
            set({ userDetails: response.data.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch user details',
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/users');
            set({ stats: response.data.data });
        } catch (error) {
            console.error('Failed to fetch user stats', error);
        }
    },

    updateUserStatus: async (id, status) => {
        try {
            await api.patch(`/admin/users/${id}/status`, { status });
            // Refresh user details if currently viewing that user
            const currentUser = get().userDetails;
            if (currentUser && currentUser.id === id) {
                await get().fetchUserDetails(id);
            }
            // Also refresh list if needed
            await get().fetchUsers(get().pagination.page);
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update user status' });
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            await get().fetchUsers(get().pagination.page);
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete user' });
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
