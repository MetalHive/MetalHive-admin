'use client'

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Package, Scale, ChevronRight } from 'lucide-react';
import { FaArrowLeftLong } from "react-icons/fa6";
import TopBar from '@/app/Components/TopBar';
import BidsOverviewTable from '@/app/Components/Bidsoverview';
import useListingsStore from '@/app/store/useListingsStore';

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    sold: 'bg-blue-100 text-blue-700 border-blue-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
};

const money = (value: string | number | null | undefined) =>
    value == null ? '—' : `$${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const {
        current: listing,
        loading,
        error,
        actionLoading,
        fetchListing,
        deleteListing,
        suspendListing,
        reinstateListing,
    } = useListingsStore();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [suspendReason, setSuspendReason] = useState('');
    const [confirming, setConfirming] = useState<'DELETE' | 'SUSPEND' | null>(null);

    useEffect(() => {
        fetchListing(id);
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteListing(id);
            router.push('/dashboard/listings');
        } catch {
            setConfirming(null);
        }
    };

    const handleSuspend = async () => {
        try {
            await suspendListing(id, suspendReason);
            setConfirming(null);
            setSuspendReason('');
        } catch {
            setConfirming(null);
        }
    };

    if (loading && !listing) {
        return (
            <div>
                <TopBar />
                <div className="p-20 text-gray-500">Loading listing…</div>
            </div>
        );
    }

    if (error && !listing) {
        return (
            <div>
                <TopBar />
                <div className="p-20">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link href="/dashboard/listings" className="text-[#C9A227] hover:underline">
                        Back to listings
                    </Link>
                </div>
            </div>
        );
    }

    if (!listing) return null;

    const images: string[] = listing.images?.length ? listing.images : [];
    const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.inactive;

    return (
        <div className="">
            <TopBar />
            <div className="w-full p-6 md:p-20">
                {/* Breadcrumb + back to the listings table */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                    <ChevronRight size={14} />
                    <Link href="/dashboard/listings" className="hover:text-gray-900">Listings</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">{listing.product_code || listing.id}</span>
                </div>

                <button
                    onClick={() => router.push('/dashboard/listings')}
                    className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900"
                >
                    <FaArrowLeftLong className="w-5 h-5" />
                    <span className="text-sm">Back to listings</span>
                </button>

                {listing.status === 'suspended' && (
                    <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        This listing is suspended and is hidden from the marketplace.
                        {listing.suspension_reason && <> Reason: {listing.suspension_reason}</>}
                    </div>
                )}

                <div className="grid md:grid-cols-10 gap-8 p-0 md:p-6">
                    {/* Left column */}
                    <div className="col-span-full md:col-span-5">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold">{listing.material_name}</h1>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusStyle}`}>
                                    {listing.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Listing created on {listing.created_date || '—'}
                            </p>

                            <div className="my-6">
                                <h3 className="text-sm font-semibold mb-2">Description</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {listing.description || 'No description provided.'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-gray-500 mb-2">Seller Information</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-start gap-2">
                                        <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Asking price</p>
                                            <p className="text-sm font-semibold">
                                                {money(listing.price)}/{listing.price_unit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm font-semibold">{listing.location || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Quantity</p>
                                            <p className="text-sm font-semibold">{listing.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={images[currentImageIndex]}
                                    alt={listing.material_name}
                                    className="w-full h-80 object-cover"
                                />
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right column */}
                    <div className="col-span-full md:col-start-7 md:col-span-4">
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-1">
                                {listing.seller?.name || listing.seller_name || '—'}
                            </p>
                            <h3 className="text-xl font-semibold mb-2">{listing.material_name}</h3>

                            <p className="text-3xl font-bold mb-1">
                                {money(listing.price)}
                                <span className="text-base font-normal text-gray-500">/{listing.price_unit}</span>
                            </p>
                            {listing.price_per_kg && (
                                <p className="text-sm text-gray-500">
                                    {money(listing.price_per_kg)} per kg
                                </p>
                            )}
                        </div>

                        <div className="space-y-1 mb-6">
                            {[
                                ['Type', listing.material_type],
                                ['Condition', listing.condition],
                                ['Quantity (as listed)', listing.quantity],
                                ['Quantity (kg)', listing.quantity_kg ? `${Number(listing.quantity_kg).toLocaleString()} kg` : '—'],
                                ['Lot value', money(listing.total_value)],
                                ['Location', listing.location],
                                ['Product code', listing.product_code],
                                ['Bids', String(listing.bids_count ?? 0)],
                                ['Views', String(listing.views_count ?? 0)],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">{label}</span>
                                    <span className="text-sm font-medium">{value || '—'}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button
                                disabled={actionLoading}
                                onClick={() => setConfirming('DELETE')}
                                className="w-full bg-[#FF0000] hover:bg-white hover:text-[#FF0000] text-white font-semibold py-3 border border-transparent hover:border-[#FF0000] rounded-md transition-colors disabled:opacity-50"
                            >
                                Delete listing
                            </button>

                            {listing.status === 'suspended' ? (
                                <button
                                    disabled={actionLoading}
                                    onClick={() => reinstateListing(id)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Working…' : 'Reinstate Listing'}
                                </button>
                            ) : (
                                <button
                                    disabled={actionLoading || listing.status === 'sold'}
                                    onClick={() => setConfirming('SUSPEND')}
                                    title={listing.status === 'sold' ? 'A sold listing cannot be suspended' : undefined}
                                    className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Suspend Listing
                                </button>
                            )}

                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                    </div>
                </div>

                <BidsOverviewTable />
            </div>

            {confirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <h2 className="text-lg font-semibold mb-2">
                            {confirming === 'DELETE' ? 'Delete this listing?' : 'Suspend this listing?'}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {confirming === 'DELETE'
                                ? 'The listing is removed from the marketplace and every admin view. This cannot be undone from here.'
                                : 'The listing is pulled from the marketplace and all open bids on it are released. You can reinstate it later.'}
                        </p>

                        {confirming === 'SUSPEND' && (
                            <textarea
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                placeholder="Reason (shown to the seller)"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm mb-4"
                            />
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirming(null)}
                                className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actionLoading}
                                onClick={confirming === 'DELETE' ? handleDelete : handleSuspend}
                                className={`rounded-md px-4 py-2 text-sm text-white disabled:opacity-50 ${confirming === 'DELETE'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-yellow-600 hover:bg-yellow-700'
                                    }`}
                            >
                                {actionLoading ? 'Working…' : confirming === 'DELETE' ? 'Delete' : 'Suspend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
