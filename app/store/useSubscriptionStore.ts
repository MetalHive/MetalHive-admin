import { create } from 'zustand';
import api from '@/app/lib/api';

interface Subscription {
    id: string;
    buyer_name: string;
    buyer_email: string;
    plan_name: string;
    status: 'active' | 'cancelled' | 'expired';
    billing_status: string;
    start_date: string;
    next_billing_date: string;
}

interface SubscriptionState {
    subscriptions: Subscription[];
    stats: {
        activeCount: number;
        cancelledCount: number;
        expiredCount: number;
        mrr: number;
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

    fetchSubscriptions: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    cancelSubscription: (id: string) => Promise<void>;
    setFilter: (key: string, value: string) => void;
}

const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
    subscriptions: [],
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

    fetchSubscriptions: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/subscriptions', { params });
            const { subscriptions, pagination: apiPagination } = response.data.data;

            set({
                subscriptions,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch subscriptions',
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/subscriptions');
            set({ stats: response.data.data });
        } catch (error) {
            console.error('Failed to fetch subscription stats', error);
        }
    },

    cancelSubscription: async (id) => {
        try {
            await api.post(`/admin/subscriptions/${id}/cancel/`);
            await get().fetchSubscriptions(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to cancel subscription' });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, page: 1 }
        }));
        get().fetchSubscriptions(1);
    }
}));

export default useSubscriptionStore;
