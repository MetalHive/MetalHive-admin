'use client';

import { useState, useEffect } from 'react';
import useVerificationStore, { VerificationRequest } from '@/app/store/useVerificationStore';
import { Search, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

const VerificationTable = () => {
    const {
        requests,
        loading,
        filters,
        fetchRequests,
        setFilter,
        reviewRequest
    } = useVerificationStore();

    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Map tab to status filter
        setFilter('status', activeTab);
    }, [activeTab]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        fetchRequests();
    }, []);

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
                    {(['all', 'pending', 'verified', 'rejected'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'border-[#C9A227] text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'rejected' ? 'Denied' : tab}
                            <span className="ml-2 text-gray-400 font-normal">
                                ({requests.filter(r => tab === 'all' || r.status === tab).length})
                            </span>
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

                    {activeTab === 'pending' && (
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                            <XCircle className="w-4 h-4" />
                            Deny verification
                        </button>
                    )}
                </div>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="pl-8">Buyer</div>
                <div>Company</div>
                <div>Status</div>
                <div>Date Submitted</div>
                <div>Days Pending</div>
                <div>Action</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="py-12 text-center text-gray-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No verification requests found.</div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="group hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_1.5fr] gap-4 px-6 py-4 items-center">
                                {/* Buyer Info */}
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]" />
                                    <div>
                                        <p className="font-medium text-gray-900">{request.buyerName}</p>
                                        <p className="text-sm text-gray-500">{request.email}</p>
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="text-sm text-gray-900 md:block hidden">
                                    {request.companyName}
                                </div>

                                {/* Status */}
                                <div className={`text-sm font-medium ${getStatusColor(request.status)} capitalize`}>
                                    {request.status}
                                </div>

                                {/* Date */}
                                <div className="text-sm text-gray-900 md:block hidden">
                                    {request.dateSubmitted}
                                </div>

                                {/* Days Pending */}
                                <div className="text-sm text-gray-900 md:block hidden">
                                    {request.daysPending} days
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {request.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => reviewRequest(request.id, 'verify')}
                                                className="px-4 py-1.5 bg-[#C9A227] text-white text-sm font-medium rounded hover:bg-[#b08d21] transition-colors"
                                            >
                                                Review
                                            </button>
                                            <button
                                                onClick={() => reviewRequest(request.id, 'reject')}
                                                className="px-4 py-1.5 border border-red-500 text-red-500 text-sm font-medium rounded hover:bg-red-50 transition-colors"
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
                                    <p><span className="font-medium">Company:</span> {request.companyName}</p>
                                    <p><span className="font-medium">Submitted:</span> {request.dateSubmitted}</p>
                                    <p><span className="font-medium">Pending:</span> {request.daysPending} days</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination (Simple Placeholder) */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
                <p>Showing {requests.length} results</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
};

export default VerificationTable;
