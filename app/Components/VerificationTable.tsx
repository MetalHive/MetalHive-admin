'use client';

import { useState, useEffect } from 'react';
import useVerificationStore, { VerificationStats } from '@/app/store/useVerificationStore';
import { useToast } from "@/app/Components/Toast";
import ErrorBanner from "@/app/Components/ErrorBanner";
import PaginationFooter from "@/app/Components/PaginationFooter";
import { formatDate } from '@/app/lib/format';
import { Search, XCircle, CheckCircle, FileText } from 'lucide-react';

const TABS = ['all', 'pending', 'verified', 'rejected'] as const;
type Tab = typeof TABS[number];

// Tab counts come from the stats endpoint, not the current page of rows:
// a page of 10 said "(10)" under "All" regardless of how many existed.
const STAT_FOR_TAB: Record<Tab, keyof VerificationStats> = {
    all: 'total',
    pending: 'pendingReviews',
    verified: 'verifiedBuyers',
    rejected: 'rejectedRequests',
};

const VerificationTable = () => {
    const {
        requests,
        stats,
        loading,
        error,
        filters,
        pagination,
        fetchRequests,
        setFilter,
        reviewRequest
    } = useVerificationStore();

    const toast = useToast();
    const activeTab = (filters.status || 'all') as Tab;
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [busyId, setBusyId] = useState<string | number | null>(null);

    const handleReview = async (id: string | number, action: 'verify' | 'reject') => {
        const verb = action === 'verify' ? 'Verify' : 'Deny';
        if (!confirm(`${verb} this buyer's verification request?`)) return;
        setBusyId(id);
        try {
            await reviewRequest(id, action);
            toast.success(action === 'verify' ? 'Request verified.' : 'Request rejected.');
        } catch {
            toast.error(useVerificationStore.getState().error || 'Failed to update request.');
        } finally {
            setBusyId(null);
        }
    };

    // Exactly one fetch on mount.
    useEffect(() => {
        fetchRequests(1);
    }, [fetchRequests]);

    // Debounced search; skipped when the input already matches the store.
    useEffect(() => {
        if (searchQuery === filters.search) return;
        const timeoutId = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters.search, setFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600';
            case 'pending': return 'text-orange-500';
            case 'rejected': return 'text-red-500';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 mt-6">
            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-200 gap-4">
                <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter('status', tab)}
                            className={`pb-4 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'border-[#C9A227] text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'rejected' ? 'Denied' : tab}
                            {stats && (
                                <span className="ml-2 text-gray-400 font-normal">
                                    ({stats[STAT_FOR_TAB[tab]] ?? 0})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227]"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {error && <ErrorBanner message={error} className="m-4" />}

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="pl-8">Buyer</div>
                <div>Company</div>
                <div>Status</div>
                <div>Date Submitted</div>
                <div>Days Pending</div>
                <div>Document</div>
                <div>Action</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="py-12 text-center text-gray-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                        {error ? 'Verification requests could not be loaded.' : 'No verification requests found.'}
                    </div>
                ) : (
                    requests.map((request) => {
                        const busy = busyId === request.id;
                        return (
                            <div key={request.id} className="group hover:bg-gray-50 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 items-center">
                                    {/* Buyer Info */}
                                    <div className="flex items-start gap-3">
                                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]" />
                                        <div>
                                            <p className="font-medium text-gray-900">{request.buyerName || request.email}</p>
                                            <p className="text-sm text-gray-500">{request.email}</p>
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div className="text-sm text-gray-900 md:block hidden">
                                        {request.companyName || '—'}
                                    </div>

                                    {/* Status */}
                                    <div className={`text-sm font-medium ${getStatusColor(request.status)} capitalize`}>
                                        {request.status}
                                    </div>

                                    {/* Date */}
                                    <div className="text-sm text-gray-900 md:block hidden">
                                        {formatDate(request.dateSubmitted)}
                                    </div>

                                    {/* Days Pending */}
                                    <div className="text-sm text-gray-900 md:block hidden">
                                        {request.daysPending} days
                                    </div>

                                    {/* Document */}
                                    <div className="text-sm md:block hidden">
                                        {request.verification_document ? (
                                            <a
                                                href={request.verification_document}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[#C9A227] hover:underline"
                                            >
                                                <FileText className="w-4 h-4" /> View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">None</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {request.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleReview(request.id, 'verify')}
                                                    disabled={busy}
                                                    className="px-4 py-1.5 bg-[#C9A227] text-white text-sm font-medium rounded hover:bg-[#b08d21] transition-colors disabled:opacity-50"
                                                >
                                                    {busy ? '…' : 'Verify'}
                                                </button>
                                                <button
                                                    onClick={() => handleReview(request.id, 'reject')}
                                                    disabled={busy}
                                                    className="px-4 py-1.5 border border-red-500 text-red-500 text-sm font-medium rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                                >
                                                    Deny
                                                </button>
                                            </>
                                        ) : request.status === 'verified' ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm">
                                                <CheckCircle className="w-4 h-4" /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-500 text-sm">
                                                <XCircle className="w-4 h-4" /> Denied
                                            </span>
                                        )}
                                    </div>

                                    {/* Mobile View Details (Hidden on Desktop) */}
                                    <div className="md:hidden col-span-1 mt-2 space-y-2 text-sm text-gray-600 pl-7">
                                        <p><span className="font-medium">Company:</span> {request.companyName || '—'}</p>
                                        <p><span className="font-medium">Submitted:</span> {formatDate(request.dateSubmitted)}</p>
                                        <p><span className="font-medium">Pending:</span> {request.daysPending} days</p>
                                        {request.verification_document && (
                                            <p>
                                                <a href={request.verification_document} target="_blank" rel="noopener noreferrer" className="text-[#C9A227] hover:underline">
                                                    View document
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <PaginationFooter pagination={pagination} onPageChange={fetchRequests} className="px-6" />
        </div>
    );
};

export default VerificationTable;
