import { create } from 'zustand';
import api from '@/app/lib/api';
import { unwrap, unwrapList, Pagination } from '@/app/lib/unwrap';
import { getErrorMessage } from '@/app/lib/errors';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Row of GET /admin/payouts (AdminPayoutSerializer over Transaction).
 * Withdrawals are stored with a NEGATIVE amount; display Math.abs().
 */
export interface PayoutTransaction {
    id: string;
    seller_name: string;
    amount: number | string;
    request_date: string;
    status: PayoutStatus;
    method: string;
}

interface PayoutStats {
    pendingPayouts: number;
    totalPaidOut: number;
}

interface PayoutsState {
    transactions: PayoutTransaction[];
    stats: PayoutStats | null;
    loading: boolean;
    error: string | null;
    actionLoading: string | null;
    pagination: Pagination;
    filters: {
        status: string;
        search: string;
    };

    fetchPayouts: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    approvePayout: (id: string) => Promise<void>;
    rejectPayout: (id: string) => Promise<void>;
    setFilter: (key: 'status' | 'search', value: string) => void;
}

const usePayoutsStore = create<PayoutsState>((set, get) => ({
    transactions: [],
    stats: null,
    loading: false,
    error: null,
    actionLoading: null,
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
            const params: Record<string, string | number> = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/payouts', { params });
            const { items, pagination: apiPagination } = unwrapList<PayoutTransaction>(response, 'transactions');

            set({
                transactions: items,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to fetch payouts'),
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/payouts');
            set({ stats: unwrap<PayoutStats>(response) });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to fetch payout stats') });
        }
    },

    approvePayout: async (id) => {
        set({ actionLoading: id, error: null });
        try {
            await api.post(`/admin/payouts/${id}/approve`);
            set({ actionLoading: null });
            await get().fetchPayouts(get().pagination.page);
            await get().fetchStats();
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to approve payout'), actionLoading: null });
            throw error;
        }
    },

    rejectPayout: async (id) => {
        set({ actionLoading: id, error: null });
        try {
            await api.post(`/admin/payouts/${id}/reject`);
            set({ actionLoading: null });
            await get().fetchPayouts(get().pagination.page);
            await get().fetchStats();
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to reject payout'), actionLoading: null });
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
