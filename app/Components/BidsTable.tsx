"use client";

import { Search, Eye } from "lucide-react";
import { useState } from "react";

// Dummy data for Bids
const bids = [
    {
        id: "#BID-1001",
        listingId: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        amount: "$1,200.00",
        date: "Nov 10, 2025",
        status: "Pending",
    },
    {
        id: "#BID-1002",
        listingId: "#MH-9921-AL",
        buyer: "Iron Works LTD.",
        amount: "$4,500.00",
        date: "Oct 24, 2024",
        status: "Accepted",
    },
    {
        id: "#BID-1003",
        listingId: "#MH-7743-CU",
        buyer: "Global Scrap Inc.",
        amount: "$850.00",
        date: "Oct 24, 2024",
        status: "Rejected",
    },
    {
        id: "#BID-1004",
        listingId: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        amount: "$1,250.00",
        date: "Oct 28, 2024",
        status: "Pending",
    },
    {
        id: "#BID-1005",
        listingId: "#MH-8832-TR",
        buyer: "John Doe",
        amount: "$1,100.00",
        date: "Oct 30, 2024",
        status: "Rejected",
    },
];

const tabs = [
    { id: 'all', label: 'All', count: 12 },
    { id: 'pending', label: 'Pending', count: 5 },
    { id: 'accepted', label: 'Accepted', count: 4 },
    { id: 'rejected', label: 'Rejected', count: 3 },
];

export default function BidsTable() {
    const [activeTab, setActiveTab] = useState('all');

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
                            {tab.label} <span className="text-gray-400 font-normal">({tab.count})</span>
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
                            <th className="py-3 px-4 font-medium text-gray-500">Listing ID</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Bid Amount</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Date</th>
                            <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                            <th className="py-3 px-4 font-medium text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {bids.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 group transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                                </td>
                                <td className="py-4 px-4 font-medium text-gray-900">{item.buyer}</td>
                                <td className="py-4 px-4 text-gray-600">{item.listingId}</td>
                                <td className="py-4 px-4 font-medium text-gray-900">{item.amount}</td>
                                <td className="py-4 px-4 text-gray-600">{item.date}</td>
                                <td className={`py-4 px-4 font-medium ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button
                                        className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-200 text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1 ml-auto"
                                    >
                                        <Eye size={14} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination or Footer if needed */}
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing 1-5 of 12</span>
                <div className="flex gap-1">
                    <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Prev</button>
                    <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
}
