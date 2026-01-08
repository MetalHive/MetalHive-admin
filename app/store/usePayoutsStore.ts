import { create } from 'zustand';
import api from '@/app/lib/api';

interface Transaction {
    id: string;
    seller_name: string;
    amount: number;
    request_date: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    method: string;
}

interface PayoutsState {
    transactions: Transaction[];
    stats: {
        pendingPayouts: number;
        totalPaidOut: number;
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
        search: string;
    };

    fetchPayouts: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    approvePayout: (id: string) => Promise<void>;
    rejectPayout: (id: string) => Promise<void>;
    setFilter: (key: string, value: string) => void;
}

const usePayoutsStore = create<PayoutsState>((set, get) => ({
    transactions: [],
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
        search: '',
    },

    fetchPayouts: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/payouts', { params });
            const { transactions, pagination: apiPagination } = response.data.data;

            set({
                transactions,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch payouts',
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/payouts');
            set({ stats: response.data.data });
        } catch (error) {
            console.error('Failed to fetch payout stats', error);
        }
    },

    approvePayout: async (id) => {
        try {
            await api.post(`/admin/payouts/${id}/approve`);
            await get().fetchPayouts(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to approve payout' });
            throw error;
        }
    },

    rejectPayout: async (id) => {
        try {
            await api.post(`/admin/payouts/${id}/reject`);
            await get().fetchPayouts(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to reject payout' });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, page: 1 }
        }));
        get().fetchPayouts(1);
    }
}));

export default usePayoutsStore;
