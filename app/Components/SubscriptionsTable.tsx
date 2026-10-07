"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import useSubscriptionStore from '@/app/store/useSubscriptionStore';
import { useToast } from "@/app/Components/Toast";
import ErrorBanner from "@/app/Components/ErrorBanner";
import PaginationFooter from "@/app/Components/PaginationFooter";
import { formatDate } from "@/app/lib/format";

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'expired', label: 'Expired' },
];

export default function SubscriptionsTable() {
    const {
        subscriptions,
        loading,
        error,
        filters,
        pagination,
        fetchSubscriptions,
        setFilter,
        cancelSubscription
    } = useSubscriptionStore();

    const activeTab = filters.status || 'all';
    const [searchTerm, setSearchTerm] = useState(filters.search);

    // Exactly one fetch on mount.
    useEffect(() => {
        fetchSubscriptions(1);
    }, [fetchSubscriptions]);

    // Debounced search; skipped when the input already matches the store.
    useEffect(() => {
        if (searchTerm === filters.search) return;
        const timeoutId = setTimeout(() => {
            setFilter('search', searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters.search, setFilter]);

    const toast = useToast();

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this subscription?')) return;
        try {
            await cancelSubscription(id);
            toast.success('Subscription cancelled.');
        } catch {
            toast.error(useSubscriptionStore.getState().error || 'Failed to cancel subscription.');
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-green-600';
            case 'cancelled':
            case 'expired':
            case 'suspended':
                return 'text-red-500';
            default:
                return 'text-gray-900';
        }
    };

    return (
        <div className="bg-white mt-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-200 w-full sm:w-auto overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter('status', tab.id === 'all' ? '' : tab.id)}
                            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                ? 'text-yellow-600 border-b-2 border-yellow-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-yellow-600 min-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {error && <ErrorBanner message={error} className="mb-4" />}

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="py-4 px-4 w-12">
                                {/* Header Checkbox if needed */}
                            </th>
                            <th className="py-4 px-4 font-normal text-gray-500">Buyer</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Plan</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Status</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Billing Status</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Start Date</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Next Billing Date</th>
                            <th className="py-4 px-4 font-normal text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">Loading subscriptions...</td>
                            </tr>
                        ) : subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    {error ? 'Subscriptions could not be loaded.' : 'No subscriptions found'}
                                </td>
                            </tr>
                        ) : (
                            subscriptions.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 group"
                                >
                                    <td className="py-4 px-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-900">{item.buyer_name}</div>
                                        <div className="text-gray-500 text-xs mt-0.5">{item.buyer_email}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-900">{item.plan_name || '—'}</div>
                                        <div className="text-gray-400 text-xs mt-0.5 break-all">{item.id}</div>
                                    </td>
                                    <td className={`py-4 px-4 font-medium ${getStatusColor(item.status)}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </td>
                                    <td className="py-4 px-4 text-gray-900 capitalize">{item.billing_status || '—'}</td>
                                    <td className="py-4 px-4 text-gray-900">{formatDate(item.start_date)}</td>
                                    <td className="py-4 px-4 text-gray-900">{formatDate(item.next_billing_date)}</td>
                                    <td className="py-4 px-4 text-right">
                                        {item.status === 'active' ? (
                                            <button
                                                onClick={() => handleCancel(item.id)}
                                                className="text-red-500 border border-red-500 hover:bg-red-50 text-xs px-4 py-1.5 rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PaginationFooter pagination={pagination} onPageChange={fetchSubscriptions} />
        </div>
    );
}
