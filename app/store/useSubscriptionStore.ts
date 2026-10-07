import { create } from 'zustand';
import api from '@/app/lib/api';
import { unwrap, unwrapList, Pagination } from '@/app/lib/unwrap';
import { getErrorMessage } from '@/app/lib/errors';

/** Row of GET /admin/subscriptions (AdminSubscriptionSerializer). */
export interface Subscription {
    id: string;
    buyer_name: string;
    buyer_email: string;
    plan_name: string;
    status: 'active' | 'cancelled' | 'expired';
    billing_status: string;
    start_date: string;
    next_billing_date: string | null;
}

interface SubscriptionStats {
    activeCount: number;
    cancelledCount: number;
    expiredCount: number;
    mrr: number;
}

interface SubscriptionState {
    subscriptions: Subscription[];
    stats: SubscriptionStats | null;
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    filters: {
        status: string;
        search: string;
    };

    fetchSubscriptions: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    cancelSubscription: (id: string) => Promise<void>;
    setFilter: (key: 'status' | 'search', value: string) => void;
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
            const params: Record<string, string | number> = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/subscriptions', { params });
            const { items, pagination: apiPagination } = unwrapList<Subscription>(response, 'subscriptions');

            set({
                subscriptions: items,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to fetch subscriptions'),
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/subscriptions');
            set({ stats: unwrap<SubscriptionStats>(response) });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to fetch subscription stats') });
        }
    },

    cancelSubscription: async (id) => {
        try {
            await api.post(`/admin/subscriptions/${id}/cancel`);
            await get().fetchSubscriptions(get().pagination.page);
            await get().fetchStats();
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to cancel subscription') });
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
