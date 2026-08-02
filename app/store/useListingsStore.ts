import { create } from 'zustand';
import api from '@/app/lib/api';

export type ListingStatus = 'draft' | 'active' | 'sold' | 'inactive' | 'suspended';

export interface Listing {
    id: string;
    material_name: string;
    seller_name: string;
    price: string;
    price_unit: string;
    price_per_kg: string | null;
    status: ListingStatus;
    created_date: string;
    quantity: string;
    quantity_kg: string | null;
    total_value: string | null;
}

/** Shape of AdminListingDetailSerializer (Listing with `fields = "__all__"`). */
export interface ListingDetail extends Listing {
    product_code: string;
    material_type: string;
    condition: string;
    quantity_value: string | null;
    quantity_unit: string;
    base_price: string;
    location: string;
    description: string;
    images: string[];
    additional_notes: string | null;
    suspension_reason: string;
    suspended_at: string | null;
    is_deleted: boolean;
    views_count: number;
    bids_count: number;
    created_at: string;
    published_at: string | null;
    seller: {
        id: number;
        name: string;
        email: string;
        company_name: string | null;
        user_type: string;
    } | null;
}

interface ListingsState {
    listings: Listing[];
    stats: {
        totalListings: number;
        activeListings: number;
        soldListings: number;
        suspendedListings: number;
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
        category: string;
    };

    current: ListingDetail | null;
    actionLoading: boolean;
    fetchListings: (page?: number) => Promise<void>;
    fetchListing: (id: string) => Promise<void>;
    fetchStats: () => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    suspendListing: (id: string, reason?: string) => Promise<void>;
    reinstateListing: (id: string) => Promise<void>;
    setFilter: (key: string, value: string) => void;
}

const useListingsStore = create<ListingsState>((set, get) => ({
    listings: [],
    current: null,
    actionLoading: false,
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
        category: '',
    },

    fetchListings: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.category && filters.category !== 'all') params.category = filters.category;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/listings', { params });
            const { listings, pagination: apiPagination } = response.data.data;

            set({
                listings,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch listings',
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/listings');
            set({ stats: response.data.data });
        } catch (error) {
            console.error('Failed to fetch listing stats', error);
        }
    },

    fetchListing: async (id) => {
        set({ loading: true, error: null, current: null });
        try {
            const response = await api.get(`/admin/listings/${id}`);
            set({ current: response.data.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to load listing',
                loading: false,
            });
        }
    },

    deleteListing: async (id) => {
        set({ actionLoading: true });
        try {
            await api.delete(`/admin/listings/${id}`);
            set({ actionLoading: false });
            await get().fetchListings(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete listing',
                actionLoading: false,
            });
            throw error;
        }
    },

    suspendListing: async (id, reason = '') => {
        set({ actionLoading: true });
        try {
            await api.post(`/admin/listings/${id}/suspend`, { reason });
            set({ actionLoading: false });
            if (get().current?.id === id) await get().fetchListing(id);
            // Refetch the list as deleteListing does; without it the row kept
            // its old status until the page was reloaded by hand.
            await get().fetchListings(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to suspend listing',
                actionLoading: false,
            });
            throw error;
        }
    },

    reinstateListing: async (id) => {
        set({ actionLoading: true });
        try {
            await api.post(`/admin/listings/${id}/reinstate`);
            set({ actionLoading: false });
            if (get().current?.id === id) await get().fetchListing(id);
            await get().fetchListings(get().pagination.page);
            await get().fetchStats();
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to reinstate listing',
                actionLoading: false,
            });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, page: 1 }
        }));
        get().fetchListings(1);
    }
}));

export default useListingsStore;
