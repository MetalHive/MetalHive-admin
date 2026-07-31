"use client";

import { Search, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useBidsStore from "@/app/store/useBidsStore";

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
        filters,
        pagination,
        fetchBids,
        setFilter
    } = useBidsStore();

    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilter('status', activeTab === 'all' ? '' : activeTab);
    }, [activeTab]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilter('search', searchTerm);
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Initial fetch
    useEffect(() => {
        fetchBids();
    }, []);

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
                            onClick={() => setActiveTab(tab.id)}
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
                                <td colSpan={7} className="text-center py-8 text-gray-500">No bids found</td>
                            </tr>
                        ) : (
                            bids.map((item, index) => (
                                <tr
                                    key={index}
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
                                            ${Number(item.amount).toLocaleString()}
                                            <span className="text-xs font-normal text-gray-500">/{item.offer_price_unit}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity} &middot; total{' '}
                                            {item.total_amount != null
                                                ? `$${Number(item.total_amount).toLocaleString()}`
                                                : '—'}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{item.date}</td>
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
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
                <div className="flex gap-1">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchBids(pagination.page - 1)}
                        className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchBids(pagination.page + 1)}
                        className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
