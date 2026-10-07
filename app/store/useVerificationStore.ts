import { create } from 'zustand';
import api from '@/app/lib/api';
import { unwrap, unwrapList, Pagination } from '@/app/lib/unwrap';
import { getErrorMessage } from '@/app/lib/errors';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

/**
 * Row of GET /admin/verifications (AdminVerificationSerializer over
 * BuyerProfile). `id` is the USER id, which is also what the status route
 * expects.
 */
export interface VerificationRequest {
    id: string | number;
    buyerName: string;
    email: string;
    companyName: string;
    status: VerificationStatus;
    dateSubmitted: string;
    daysPending: number;
    verification_document: string | null;
}

export interface VerificationStats {
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
    pagination: Pagination;

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
            const params: Record<string, string | number> = {
                page,
                limit: pagination.limit,
            };

            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/admin/verifications', { params });
            // The list key follows the model name: BuyerProfile -> buyerprofiles.
            const { items, pagination: apiPagination } = unwrapList<VerificationRequest>(
                response,
                'buyerprofiles'
            );

            set({
                requests: items,
                loading: false,
                pagination: { ...pagination, ...apiPagination }
            });
        } catch (error: unknown) {
            set({
                requests: [],
                error: getErrorMessage(error, 'Failed to fetch verification requests'),
                loading: false
            });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/admin/verifications/stats');
            set({ stats: unwrap<VerificationStats>(response) });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to fetch verification stats') });
        }
    },

    reviewRequest: async (id, action) => {
        try {
            const status: VerificationStatus = action === 'verify' ? 'verified' : 'rejected';
            await api.patch(`/admin/verifications/${id}/status`, { status });

            // Optimistic update so the row flips immediately…
            set(state => ({
                requests: state.requests.map(req =>
                    String(req.id) === String(id) ? { ...req, status } : req
                )
            }));

            // …then reconcile with the server: on a filtered tab the row
            // should drop out, and the tab counts come from the stats endpoint.
            await Promise.all([
                get().fetchRequests(get().pagination.page),
                get().fetchStats(),
            ]);
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, 'Failed to update request') });
            throw error;
        }
    },

    setFilter: (key, value) => {
        set(state => ({
            filters: { ...state.filters, [key]: value },
            pagination: { ...state.pagination, page: 1 }
        }));
        get().fetchRequests(1);
    }
}));

export default useVerificationStore;
