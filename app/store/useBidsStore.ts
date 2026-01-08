import { create } from 'zustand';
import api from '@/app/lib/api';

interface Bid {
    id: string;
    listing_id: string;
    listing_title: string;
    buyer: {
        name: string;
        email: string;
    };
    amount: number;
    date: string;
    status: 'pending' | 'accepted' | 'rejected';
}

interface BidsState {
    bids: Bid[];
    stats: {
        totalBids: number;
        reviewPendingCount: number;
        acceptedBidsCount: number;
        totalValue: number;
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

    fetchBids: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    updateBidStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
    setFilter: (key: string, value: string) => void;
}

const useBidsStore = create<BidsState>((set, get) => ({
    bids: [],
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
        status: '', // 'pending', 'accepted', 'rejected' or empty
        search: '',
    },

    fetchBids: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/bids', { params });
            const { bids, pagination: apiPagination } = response.data.data;

            set({
                bids,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch bids',
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/bids');
            set({ stats: response.data.data });
        } catch (error) {
            console.error('Failed to fetch bid stats', error);
        }
    },

    updateBidStatus: async (id, status) => {
        try {
            await api.patch(`/admin/bids/${id}/status/`, { status });
            // Refresh bids after update
            await get().fetchBids(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update status' });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, page: 1 } // Reset to page 1 on filter change
        }));
        get().fetchBids(1);
    }
}));

export default useBidsStore;
