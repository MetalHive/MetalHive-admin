"use client";

import { Search, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useBidsStore from "@/app/store/useBidsStore";
import ErrorBanner from "@/app/Components/ErrorBanner";
import PaginationFooter from "@/app/Components/PaginationFooter";
import { formatCurrency, formatDate } from "@/app/lib/format";

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' },
];

export default function BidsTable() {
    const {
        bids,
        loading,
        error,
        filters,
        pagination,
        fetchBids,
        setFilter
    } = useBidsStore();

    // The active tab IS the store filter, so it survives navigating away and
    // back and does not need a second fetch to sync up on mount.
    const activeTab = filters.status || 'all';
    const [searchTerm, setSearchTerm] = useState(filters.search);

    // Exactly one fetch on mount.
    useEffect(() => {
        fetchBids(1);
    }, [fetchBids]);

    // Debounced search; skipped when the input already matches the store.
    useEffect(() => {
        if (searchTerm === filters.search) return;
        const timeoutId = setTimeout(() => {
            setFilter('search', searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters.search, setFilter]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-500';
            case 'pending':
                return 'text-orange-500';
            default:
                return 'text-gray-900';
        }
    };

    return (
        <div className="bg-white mt-8 rounded-lg border border-gray-200 shadow-sm">
            {/* Toolbar */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
                {/* Tabs */}
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter('status', tab.id === 'all' ? '' : tab.id)}
                            className={`pb-1 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                ? 'text-yellow-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-yellow-600" />
                            )}
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

            {error && <ErrorBanner message={error} className="m-4" />}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left bg-gray-50/50 border-b border-gray-200">
                            <th className="py-3 px-4 w-12">
                                <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                            </th>
                            <th className="py-3 px-4 font-medium text-gray-500">Buyer</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Listing</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Bid Amount</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Date</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                            <th className="py-3 px-4 font-medium text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">Loading bids...</td>
                            </tr>
                        ) : bids.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    {error ? 'Bids could not be loaded.' : 'No bids found'}
                                </td>
                            </tr>
                        ) : (
                            bids.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 group transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-gray-900">{item.buyer?.name || '—'}</p>
                                        {item.buyer?.company && (
                                            <p className="text-xs text-gray-500">{item.buyer.company}</p>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">
                                        <p>{item.listing_title || item.listing_id}</p>
                                        <p className="text-xs text-gray-400">{item.listing_id}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(item.amount)}
                                            <span className="text-xs font-normal text-gray-500">/{item.offer_price_unit}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity} &middot; total {formatCurrency(item.total_amount)}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{formatDate(item.date)}</td>
                                    <td className={`py-4 px-4 font-medium ${getStatusColor(item.status)}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Link
                                            href={`/dashboard/bids/${encodeURIComponent(item.id)}`}
                                            className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-200 text-xs px-3 py-1.5 rounded transition-all inline-flex items-center gap-1 ml-auto w-fit"
                                        >
                                            <Eye size={14} />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PaginationFooter pagination={pagination} onPageChange={fetchBids} />
        </div>
    );
}
