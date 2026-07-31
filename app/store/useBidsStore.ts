import { create } from 'zustand';
import api from '@/app/lib/api';

export interface Bid {
    id: string;
    listing_id: string;
    listing_title: string;
    buyer: {
        id: number;
        name: string;
        company: string | null;
        email: string;
    };
    amount: number;
    offer_price_unit: string;
    total_amount: string | null;
    quantity: string;
    date: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn' | 'expired';
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

    current: Bid | null;
    fetchBids: (page?: number) => Promise<void>;
    fetchBid: (id: string) => Promise<void>;
    fetchStats: () => Promise<void>;
    updateBidStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
    setFilter: (key: string, value: string) => void;
}

const useBidsStore = create<BidsState>((set, get) => ({
    bids: [],
    current: null,
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

    fetchBid: async (id: string) => {
        set({ loading: true, error: null, current: null });
        try {
            const response = await api.get(`/admin/bids/${id}`);
            set({ current: response.data.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to load bid',
                loading: false,
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
