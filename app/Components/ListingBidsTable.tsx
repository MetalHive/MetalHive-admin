"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import useBidsStore from "@/app/store/useBidsStore";
import ErrorBanner from "@/app/Components/ErrorBanner";
import { formatCurrency, formatDate } from "@/app/lib/format";

const STATUS_COLORS: Record<string, string> = {
    accepted: 'text-green-600',
    rejected: 'text-red-500',
    pending: 'text-orange-500',
    countered: 'text-blue-600',
};

/**
 * Bids placed on one listing, for the listing detail page. Fetched from
 * GET /admin/bids?listing_id={id}; replaces the hard-coded sample table.
 */
export default function ListingBidsTable({ listingId }: { listingId: string }) {
    const { listingBids, listingBidsLoading, listingBidsError, fetchListingBids } = useBidsStore();

    useEffect(() => {
        fetchListingBids(listingId);
    }, [listingId, fetchListingBids]);

    return (
        <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bids on this listing</h2>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {listingBidsError && <ErrorBanner message={listingBidsError} className="m-4" />}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left bg-gray-50/50 border-b border-gray-200">
                                <th className="py-3 px-4 font-medium text-gray-500">Bid ID</th>
                                <th className="py-3 px-4 font-medium text-gray-500">Buyer</th>
                                <th className="py-3 px-4 font-medium text-gray-500">Placed on</th>
                                <th className="py-3 px-4 font-medium text-gray-500">Amount</th>
                                <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                                <th className="py-3 px-4 font-medium text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {listingBidsLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">Loading bids…</td>
                                </tr>
                            ) : listingBids.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        {listingBidsError ? 'Bids could not be loaded.' : 'No bids have been placed on this listing yet.'}
                                    </td>
                                </tr>
                            ) : (
                                listingBids.map((bid) => (
                                    <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900 break-all">{bid.id}</td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">{bid.buyer?.name || '—'}</p>
                                            {bid.buyer?.company && (
                                                <p className="text-xs text-gray-500">{bid.buyer.company}</p>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{formatDate(bid.date)}</td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(bid.amount)}
                                                <span className="text-xs font-normal text-gray-500">/{bid.offer_price_unit}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {bid.quantity} &middot; total {formatCurrency(bid.total_amount)}
                                            </p>
                                        </td>
                                        <td className={`py-4 px-4 font-medium capitalize ${STATUS_COLORS[bid.status] ?? 'text-gray-900'}`}>
                                            {bid.status}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Link
                                                href={`/dashboard/bids/${encodeURIComponent(bid.id)}`}
                                                className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-200 text-xs px-3 py-1.5 rounded transition-all inline-flex items-center gap-1"
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
            </div>
        </div>
    );
}
