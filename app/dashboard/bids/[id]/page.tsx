"use client";

import Link from 'next/link';
import { ChevronRight, Ban, Trash2, Gavel } from 'lucide-react';
import SideBar from '@/app/Components/Sidebar';
import BidSummaryCard from './components/BidSummaryCard';
import BuyerDetailsCard from './components/BuyerDetailsCard';
import OfferMessageCard from './components/OfferMessageCard';
import Timeline from './components/Timeline';
import ListingSummaryCard from './components/ListingSummaryCard';

export default function BidDetailsPage({ params }: { params: { id: string } }) {
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
                        <span className="text-gray-900 font-medium">Bid Details</span>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-semibold text-gray-900">Bid Details</h1>
                                <span className="bg-green-50 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-green-200">
                                    Active
                                </span>
                            </div>
                            <p className="text-gray-500">Review bid specifics and manage status.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                                <Ban size={16} />
                                Suspend Bid
                            </button>
                            <button className="flex items-center gap-2 bg-[#FF3B30] text-white hover:bg-red-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm shadow-red-200">
                                <Trash2 size={16} />
                                Delete Bid
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <BidSummaryCard />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BuyerDetailsCard />
                                <OfferMessageCard />
                            </div>

                            <Timeline />
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            <ListingSummaryCard />

                            {/* Actions Panel */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <Gavel size={12} />
                                    </span>
                                    Actions
                                </h3>

                                <div className="space-y-3">
                                    <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                        Reinstate Bid
                                    </button>
                                    <button className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                                        View Listing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
