import { create } from 'zustand';
import api from '@/app/lib/api';
import { unwrap, unwrapList, Pagination } from '@/app/lib/unwrap';
import { getErrorMessage } from '@/app/lib/errors';

export type ListingStatus = 'draft' | 'active' | 'sold' | 'inactive' | 'suspended';

/** Row of GET /admin/listings (AdminListingSerializer). */
export interface Listing {
    id: string;
    material_name: string;
    seller_name: string;
    price: string;
    price_unit: string;
    /** Alias some backend builds emit instead of `price_unit`. */
    priceUnit?: string;
    price_per_kg: string | null;
    status: ListingStatus;
    created_date: string;
    quantity: string;
    quantity_kg: string | null;
    total_value: string | null;
}

/** `seller` on the detail response (AdminUserSerializer). */
export interface ListingSeller {
    id: number;
    name: string;
    company_name: string | null;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    status: string;
    date_joined: string;
    last_login: string | null;
}

/**
 * GET /admin/listings/{id} (AdminListingDetailSerializer): every list field
 * above plus the raw model fields.
 */
export interface ListingDetail extends Listing {
    seller: ListingSeller | null;
    product_code: string;
    material_type: string;
    condition: string;
    quantity_value: string | null;
    quantity_unit: string;
    base_price: string;
    location: string;
    description: string;
    additional_notes: string | null;
    images: string[];
    suspension_reason: string;
    suspended_at: string | null;
    is_deleted: boolean;
    deleted_at: string | null;
    views_count: number;
    bids_count: number;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    sold_at: string | null;
}

interface ListingsStats {
    totalListings: number;
    activeListings: number;
    soldListings: number;
    suspendedListings: number;
}

interface ListingsState {
    listings: Listing[];
    stats: ListingsStats | null;
    loading: boolean;
    error: string | null;
    pagination: Pagination;
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
    setFilter: (key: 'status' | 'search' | 'category', value: string) => void;
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
            const params: Record<string, string | number> = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.category && filters.category !== 'all') params.category = filters.category;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/listings', { params });
            const { items, pagination: apiPagination } = unwrapList<Listing>(response, 'listings');

            set({
                listings: items,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to fetch listings'),
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/stats/listings');
            set({ stats: unwrap<ListingsStats>(response) });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to fetch listing stats') });
        }
    },

    fetchListing: async (id) => {
        set({ loading: true, error: null, current: null });
        try {
            const response = await api.get(`/admin/listings/${id}`);
            set({ current: unwrap<ListingDetail>(response), loading: false });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to load listing'),
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
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to delete listing'),
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
            if (String(get().current?.id) === String(id)) await get().fetchListing(id);
            // Refetch the list as deleteListing does; without it the row kept
            // its old status until the page was reloaded by hand.
            await get().fetchListings(get().pagination.page);
            await get().fetchStats();
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to suspend listing'),
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
            if (String(get().current?.id) === String(id)) await get().fetchListing(id);
            await get().fetchListings(get().pagination.page);
            await get().fetchStats();
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Failed to reinstate listing'),
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
