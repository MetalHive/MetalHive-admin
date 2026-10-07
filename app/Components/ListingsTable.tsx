"use client";

import { Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useListingsStore from "@/app/store/useListingsStore";
import { useToast } from "@/app/Components/Toast";
import ErrorBanner from "@/app/Components/ErrorBanner";
import PaginationFooter from "@/app/Components/PaginationFooter";
import { formatCurrency, formatDate } from "@/app/lib/format";

export default function ListingsTable() {
    const {
        listings,
        loading,
        error,
        filters,
        pagination,
        fetchListings,
        setFilter,
        deleteListing,
        suspendListing,
        reinstateListing
    } = useListingsStore();

    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState(filters.search);

    // Exactly one fetch on mount.
    useEffect(() => {
        fetchListings(1);
    }, [fetchListings]);

    // Debounced search; skipped when the input already matches the store.
    useEffect(() => {
        if (searchQuery === filters.search) return;
        const timeoutId = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters.search, setFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this listing? It will be removed from the marketplace and every admin view.')) return;
        try {
            await deleteListing(id);
            toast.success('Listing deleted.');
        } catch {
            toast.error(useListingsStore.getState().error || 'Failed to delete listing.');
        }
    }

    const handleSuspend = async (id: string) => {
        const reason = prompt('Reason for suspending this listing (shown to the seller):');
        if (reason === null) return; // cancelled
        try {
            await suspendListing(id, reason);
            toast.success('Listing suspended.');
        } catch {
            toast.error(useListingsStore.getState().error || 'Failed to suspend listing.');
        }
    }

    const handleReinstate = async (id: string) => {
        try {
            await reinstateListing(id);
            toast.success('Listing reinstated.');
        } catch {
            toast.error(useListingsStore.getState().error || 'Failed to reinstate listing.');
        }
    }

    return (
        <div className="bg-white   mt-14  ">
            {/* Header */}
            <div className="flex items-center justify-end mb-4 border-l border-gray-200 p-3 border-r border-b shadow-xs">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                    />
                </div>
            </div>

            {error && <ErrorBanner message={error} className="mb-4" />}

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm">
                    <thead className="font-base">
                        <tr className="text-left font-base border-b border-gray-200 p-3">
                            <th className="py-3 px-2"></th>
                            <th className="py-3 px-2">Listing ID</th>

                            <th className="py-3 px-2">Date Created</th>
                            <th className="py-3 px-2">Material</th>
                            <th className="py-3 px-2">Seller</th>
                            <th className="py-3 px-2">Price</th>
                            <th className="py-3 px-2">Quantity</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">Loading listings...</td>
                            </tr>
                        ) : listings.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
                                    {error ? 'Listings could not be loaded.' : 'No listings found'}
                                </td>
                            </tr>
                        ) : (
                            listings.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 mb-4"
                                >
                                    <td className="py-6 px-2">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="py-6 px-2 font-medium">{item.id}</td>
                                    <td className="py-6 px-2">{formatDate(item.created_date)}</td>
                                    <td className="py-6 px-2 font-medium">{item.material_name}</td>
                                    <td className="py-6 px-2">{item.seller_name}</td>
                                    <td className="py-6 px-2">
                                        <p className="font-medium">
                                            {formatCurrency(item.price)} /{item.price_unit ?? item.priceUnit}
                                        </p>
                                        {item.price_per_kg && (
                                            <p className="text-xs text-gray-500">
                                                {formatCurrency(item.price_per_kg)} /kg
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-6 px-2">
                                        <p>{item.quantity}</p>
                                        {item.total_value && (
                                            <p className="text-xs text-gray-500">
                                                lot {formatCurrency(item.total_value)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-6 px-2">
                                        <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-100 text-green-800' :
                                            item.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                                item.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-6 px-2">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md"
                                                href={`/dashboard/listings/${encodeURIComponent(item.id)}`}
                                            >
                                                View
                                            </Link>
                                            {item.status === 'suspended' ? (
                                                <button
                                                    onClick={() => handleReinstate(item.id)}
                                                    className="text-xs border border-green-300 text-green-700 px-3 py-2 rounded-md hover:bg-green-50"
                                                >
                                                    Reinstate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSuspend(item.id)}
                                                    disabled={item.status === 'sold'}
                                                    className="text-xs border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 disabled:opacity-40"
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Delete listing"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            <PaginationFooter pagination={pagination} onPageChange={fetchListings} className="bg-white" />
        </div>
    );
}
