import { create } from 'zustand';
import api from '@/app/lib/api';

export interface VerificationRequest {
    id: string | number;
    buyerName: string;
    email: string;
    companyName: string;
    status: 'pending' | 'verified' | 'rejected';
    dateSubmitted: string;
    daysPending: number; // or calculate from dateSubmitted
    verification_document?: string;
}

interface VerificationStats {
    pendingReviews: number;
    verifiedBuyers: number;
    rejectedRequests: number;
    total: number;
}

interface VerificationState {
    requests: VerificationRequest[];
    stats: VerificationStats | null;
    loading: boolean;
    error: string | null;
    filters: {
        status: string; // 'all' | 'pending' | 'verified' | 'rejected'
        search: string;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    // Actions
    fetchRequests: (page?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    reviewRequest: (id: string | number, action: 'verify' | 'reject') => Promise<void>;
    setFilter: (key: 'status' | 'search', value: string) => void;
}

const useVerificationStore = create<VerificationState>((set, get) => ({
    requests: [],
    stats: null,
    loading: false,
    error: null,
    filters: {
        status: 'all',
        search: '',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    fetchRequests: async (page = 1) => {
        set({ loading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/verifications', { params });
            // API matches spec: { data: [...], pagination: {...} }
            const { data, pagination: apiPagination } = response.data;

            set({
                requests: Array.isArray(data) ? data : [],
                loading: false,
                pagination: {
                    ...pagination,
                    ...apiPagination
                }
            });

        } catch (error: any) {
            set({
                requests: [],
                error: error.response?.data?.message || 'Failed to fetch verification requests',
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/verifications/stats');
            set({ stats: response.data });
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    },

    reviewRequest: async (id, action) => {
        try {
            const status = action === 'verify' ? 'verified' : 'rejected';
            await api.patch(`/admin/verifications/${id}/status`, { status });

            // Optimistic update
            set(state => ({
                requests: state.requests.map(req =>
                    req.id === id
                        ? { ...req, status }
                        : req
                )
            }));

            // Refresh stats
            get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update request' });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set(state => ({
            filters: { ...state.filters, [key]: value }
        }));
        get().fetchRequests(1);
    }
}));

export default useVerificationStore;
