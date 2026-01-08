import { create } from 'zustand';
import api from '@/app/lib/api';

interface DashboardStats {
    totalUsers: number;
    totalListings: number;
    totalVolume: number;
    pendingBids: number;
}

interface DashboardState {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/admin/stats/overview');
            set({ stats: response.data.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch dashboard stats',
                loading: false
            });
        }
    }
}));

export default useDashboardStore;
