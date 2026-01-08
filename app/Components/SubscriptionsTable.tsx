"use client";

import { Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useSubscriptionStore from '@/app/store/useSubscriptionStore';

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
        pagination,
        fetchSubscriptions,
        setFilter,
        cancelSubscription
    } = useSubscriptionStore();

    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilter('status', activeTab === 'all' ? '' : activeTab);
    }, [activeTab]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilter('search', searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Initial fetch
    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleCancel = async (id: string) => {
        if (confirm('Are you sure you want to cancel this subscription?')) {
            await cancelSubscription(id);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-green-600';
            case 'cancelled':
                return 'text-red-500';
            case 'expired':
                return 'text-red-500'; // Or generic text-gray-500 or dark red
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
                            onClick={() => setActiveTab(tab.id)}
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

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="py-4 px-4 w-12">
                                {/* Header Checkbox if needed */}
                            </th>
                            <th className="py-4 px-4 font-normal text-gray-500">Buyer</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Subscription ID</th>
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
                                <td colSpan={8} className="text-center py-8 text-gray-500">No subscriptions found</td>
                            </tr>
                        ) : (
                            subscriptions.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 group"
                                >
                                    <td className="py-4 px-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-900">{item.buyer_name}</div>
                                        <div className="text-gray-500 text-xs mt-0.5">{item.buyer_email}</div>
                                    </td>
                                    <td className="py-4 px-4 font-medium text-gray-900">{item.id}</td>
                                    <td className={`py-4 px-4 font-medium ${getStatusColor(item.status)}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </td>
                                    <td className="py-4 px-4 text-gray-900">{item.billing_status}</td>
                                    <td className="py-4 px-4 text-gray-900">{item.start_date}</td>
                                    <td className="py-4 px-4 text-gray-900">{item.next_billing_date}</td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => handleCancel(item.id)}
                                            className="text-red-500 border border-red-500 hover:bg-red-50 text-xs px-4 py-1.5 rounded transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
                <div className="flex gap-1">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchSubscriptions(pagination.page - 1)}
                        className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchSubscriptions(pagination.page + 1)}
                        className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
