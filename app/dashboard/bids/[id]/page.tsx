"use client";

import { use, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Ban, Check, Gavel } from 'lucide-react';
import SideBar from '@/app/Components/Sidebar';
import ErrorBanner from '@/app/Components/ErrorBanner';
import useBidsStore from '@/app/store/useBidsStore';
import { useToast } from '@/app/Components/Toast';
import { formatCurrency, formatDate } from '@/app/lib/format';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-orange-50 text-orange-700 border-orange-200',
    accepted: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    countered: 'bg-blue-50 text-blue-700 border-blue-200',
    withdrawn: 'bg-gray-100 text-gray-600 border-gray-200',
    expired: 'bg-gray-100 text-gray-600 border-gray-200',
};

const when = (iso: string | null | undefined) => formatDate(iso, { withTime: true });

function Card({ title, icon, children }: {
    title: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                {icon && (
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        {icon}
                    </span>
                )}
                {title}
            </h3>
            {children}
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right">{value ?? '—'}</span>
        </div>
    );
}

export default function BidDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { current: bid, loading, error, fetchBid, updateBidStatus } = useBidsStore();
    const toast = useToast();

    useEffect(() => {
        fetchBid(id);
    }, [id, fetchBid]);

    const handleStatus = async (bidId: string, status: 'accepted' | 'rejected') => {
        if (!window.confirm(status === 'accepted' ? 'Accept this bid?' : 'Reject this bid?')) return;
        try {
            await updateBidStatus(bidId, status);
            await fetchBid(id);
            toast.success(status === 'accepted' ? 'Bid accepted.' : 'Bid rejected.');
        } catch {
            toast.error(useBidsStore.getState().error || 'Failed to update bid.');
        }
    };

    if (loading && !bid) {
        return (
            <div className="flex min-h-screen">
                <SideBar />
                <div className="flex-1 p-8 text-gray-500">Loading bid…</div>
            </div>
        );
    }

    if (error && !bid) {
        return (
            <div className="flex min-h-screen">
                <SideBar />
                <div className="flex-1 p-8">
                    <ErrorBanner message={error} className="mb-4" />
                    <Link href="/dashboard/bids" className="text-[#C9A227] hover:underline">Back to bids</Link>
                </div>
            </div>
        );
    }

    if (!bid) return null;

    const statusStyle = STATUS_STYLES[bid.status] ?? STATUS_STYLES.expired;
    const openForAction = ['pending', 'countered'].includes(bid.status);

    return (
        <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 p-8 bg-gray-50/50">
                <div className="max-w-[1200px] mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                        <ChevronRight size={14} />
                        <Link href="/dashboard/bids" className="hover:text-gray-900">Bids</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-medium">{bid.id}</span>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-semibold text-gray-900">Bid Details</h1>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusStyle}`}>
                                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-gray-500">Review bid specifics and manage status.</p>
                        </div>

                        {openForAction && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleStatus(bid.id, 'rejected')}
                                    className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    <Ban size={16} />
                                    Reject Bid
                                </button>
                                <button
                                    onClick={() => handleStatus(bid.id, 'accepted')}
                                    className="flex items-center gap-2 bg-[#C9A227] text-white hover:bg-[#b08d20] rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    <Check size={16} />
                                    Accept Bid
                                </button>
                            </div>
                        )}
                    </div>

                    {error && <ErrorBanner message={error} className="mb-6" />}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card title="Bid Summary" icon="$">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Offer</p>
                                        <p className="text-lg font-semibold">
                                            {formatCurrency(bid.amount)}
                                            <span className="text-xs font-normal text-gray-500">/{bid.offer_price_unit}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Per kg</p>
                                        <p className="text-lg font-semibold">{formatCurrency(bid.offer_price_per_kg)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Quantity</p>
                                        <p className="text-lg font-semibold">{bid.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total</p>
                                        <p className="text-lg font-semibold text-[#C9A227]">{formatCurrency(bid.total_amount)}</p>
                                    </div>
                                </div>
                                <Row label="Placed" value={when(bid.created_at)} />
                                <Row label="Expires" value={when(bid.expires_at)} />
                                {bid.accepted_at && <Row label="Accepted" value={when(bid.accepted_at)} />}
                                {bid.rejected_at && <Row label="Rejected" value={when(bid.rejected_at)} />}
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card title="Buyer">
                                    <Row label="Name" value={bid.buyer?.name} />
                                    <Row label="Company" value={bid.buyer?.company} />
                                    <Row label="Email" value={bid.buyer?.email} />
                                    <Row label="Phone" value={bid.buyer?.phone} />
                                </Card>

                                <Card title="Offer Message">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {bid.message?.trim() || 'No message was included with this bid.'}
                                    </p>
                                </Card>
                            </div>

                            <Card title="Negotiation Timeline" icon={<Gavel size={12} />}>
                                {bid.timeline?.length ? (
                                    <ol className="space-y-4">
                                        {bid.timeline.map((event, index) => (
                                            <li key={`${event.event}-${event.timestamp ?? index}`} className="flex gap-3">
                                                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#C9A227] shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{event.label}</p>
                                                    <p className="text-xs text-gray-500">{when(event.timestamp)}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className="text-sm text-gray-500">No timeline events recorded.</p>
                                )}
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card title="Listing">
                                {bid.listing ? (
                                    <>
                                        {bid.listing.image && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={bid.listing.image}
                                                alt={bid.listing.material_name}
                                                className="w-full h-36 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <Row label="Material" value={bid.listing.material_name} />
                                        <Row label="Type" value={bid.listing.material_type} />
                                        <Row label="Condition" value={bid.listing.condition} />
                                        <Row label="Quantity" value={bid.listing.quantity} />
                                        <Row label="Location" value={bid.listing.location} />
                                        <Row
                                            label="Asking"
                                            value={`${formatCurrency(bid.listing.base_price)}/${bid.listing.price_unit}`}
                                        />
                                        <Row label="Status" value={bid.listing.status} />
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">Listing unavailable.</p>
                                )}
                            </Card>

                            {bid.listing && (
                                <Link
                                    href={`/dashboard/listings/${encodeURIComponent(bid.listing.id)}`}
                                    className="block text-center w-full bg-[#C9A227] hover:bg-[#b08d20] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    View Listing
                                </Link>
                            )}

                            <Card title="Seller">
                                <Row label="Name" value={bid.seller?.name} />
                                <Row label="Email" value={bid.seller?.email} />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
