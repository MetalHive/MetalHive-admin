import { create } from 'zustand';
import api from '@/app/lib/api';

interface Listing {
    id: string;
    material_name: string;
    seller_name: string;
    price: number;
    price_unit: string;
    status: 'active' | 'sold' | 'inactive';
    created_date: string;
    quantity: string;
}

interface ListingsState {
    listings: Listing[];
    stats: {
        totalListings: number;
        activeListings: number;
        soldListings: number;
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

    fetchListings: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    setFilter: (key: string, value: string) => void;
}

const useListingsStore = create<ListingsState>((set, get) => ({
    listings: [],
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

    deleteListing: async (id) => {
        try {
            await api.delete(`/admin/listings/${id}`);
            await get().fetchListings(get().pagination.page);
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete listing' });
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
