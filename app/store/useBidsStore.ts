import { create } from 'zustand';
import api from '@/app/lib/api';
import { unwrap, unwrapList, Pagination } from '@/app/lib/unwrap';
import { getErrorMessage } from '@/app/lib/errors';

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn' | 'expired';

/** Row of GET /admin/bids (AdminBidSerializer). */
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
    amount: string | number;
    offer_price_unit: string;
    total_amount: string | null;
    quantity: string;
    date: string;
    status: BidStatus;
}

/** GET /admin/bids/{id} (AdminBidDetailSerializer). */
export interface BidDetail {
    id: string;
    amount: string | number;
    offer_price_unit: string;
    offer_price_per_kg: string | null;
    quantity: string;
    quantity_kg: string | null;
    total_amount: string | null;
    message: string | null;
    status: BidStatus;
    buyer: {
        id: number;
        name: string;
        company: string | null;
        email: string;
        phone: string | null;
    };
    seller: {
        id: number;
        name: string;
        email: string;
    };
    listing: {
        id: string;
        product_code: string;
        material_name: string;
        material_type: string;
        condition: string;
        quantity: string;
        location: string;
        status: string;
        base_price: string;
        price_unit: string;
        image: string | null;
    } | null;
    timeline: {
        event: string;
        label: string;
        timestamp: string | null;
        data: unknown;
    }[];
    created_at: string;
    expires_at: string | null;
    accepted_at: string | null;
    rejected_at: string | null;
}

interface BidsStats {
    totalBids: number;
    reviewPendingCount: number;
    acceptedBidsCount: number;
    totalValue: number;
}

interface BidsState {
    bids: Bid[];
    stats: BidsStats | null;
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    filters: {
        status: string;
        search: string;
    };

    current: BidDetail | null;

    /** Bids for one listing, shown on the listing detail page. */
    listingBids: Bid[];
    listingBidsLoading: boolean;
    listingBidsError: string | null;

    fetchBids: (page?: number) => Promise<void>;
    fetchBid: (id: string) => Promise<void>;
    fetchListingBids: (listingId: string) => Promise<void>;
    fetchStats: () => Promise<void>;
    updateBidStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
    setFilter: (key: 'status' | 'search', value: string) => void;
}

const useBidsStore = create<BidsState>((set, get) => ({
    bids: [],
    current: null,
    stats: null,
    loading: false,
    error: null,
    listingBids: [],
    listingBidsLoading: false,
    listingBidsError: null,
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
            const params: Record<string, string | number> = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/bids', { params });
            const { items, pagination: apiPagination } = unwrapList<Bid>(response, 'bids');

            set({
                bids: items,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to fetch bids'),
                loading: false
            });
        }
    },

    fetchBid: async (id: string) => {
        set({ loading: true, error: null, current: null });
        try {
            const response = await api.get(`/admin/bids/${id}`);
            set({ current: unwrap<BidDetail>(response), loading: false });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to load bid'),
                loading: false,
            });
        }
    },

    fetchListingBids: async (listingId: string) => {
        set({ listingBidsLoading: true, listingBidsError: null });
        try {
            const response = await api.get('/admin/bids', {
                params: { listing_id: listingId, limit: 50 },
            });
            const { items } = unwrapList<Bid>(response, 'bids');
            set({ listingBids: items, listingBidsLoading: false });
        } catch (error: unknown) {
            set({
                listingBids: [],
                listingBidsError: getErrorMessage(error, 'Failed to load bids for this listing'),
                listingBidsLoading: false,
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/bids');
            set({ stats: unwrap<BidsStats>(response) });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to fetch bid stats') });
        }
    },

    updateBidStatus: async (id, status) => {
        try {
            await api.patch(`/admin/bids/${id}/status`, { status });
            // Refresh bids after update
            await get().fetchBids(get().pagination.page);
            await get().fetchStats();
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to update status') });
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
