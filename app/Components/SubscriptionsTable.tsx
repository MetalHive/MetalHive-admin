"use client";

import { Search, XCircle } from "lucide-react";
import { useState } from "react";

// Dummy data based on the design
const subscriptions = [
    {
        id: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        email: "heritage@gmail.com",
        status: "Active",
        billingStatus: "Paid",
        startDate: "Nov 10, 2025",
        nextBilling: "Nov 10, 2025",
    },
    {
        id: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        email: "heritage@gmail.com",
        status: "Cancelled",
        billingStatus: "Failed",
        startDate: "Oct 24, 2024",
        nextBilling: "Nov 10, 2025",
    },
    {
        id: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        email: "heritage@gmail.com",
        status: "Expired",
        billingStatus: "Failed",
        startDate: "Oct 24, 2024",
        nextBilling: "Nov 10, 2025",
    },
    {
        id: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        email: "heritage@gmail.com",
        status: "Active",
        billingStatus: "Paid",
        startDate: "Oct 28, 2024",
        nextBilling: "Nov 10, 2025",
    },
    {
        id: "#MH-8832-TR",
        buyer: "Heritage Atiba",
        email: "heritage@gmail.com",
        status: "Suspended",
        billingStatus: "Paid",
        startDate: "Oct 30, 2024",
        nextBilling: "Nov 10, 2025",
    },
];

const tabs = [
    { id: 'all', label: 'All', count: 12 },
    { id: 'active', label: 'Active', count: 0 },
    { id: 'cancelled', label: 'Cancelled', count: 3 },
    { id: 'expired', label: 'Expired', count: 3 },
];

export default function SubscriptionsTable() {
    const [activeTab, setActiveTab] = useState('all');

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-green-600';
            case 'cancelled':
                return 'text-red-500';
            case 'expired':
                return 'text-red-500'; // Or generic text-gray-500 or dark red
            case 'suspended':
                return 'text-red-500';
            default:
                return 'text-gray-900';
        }
    };

    return (
        <div className="bg-white mt-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-200 w-full sm:w-auto overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                    ? 'text-yellow-600 border-b-2 border-yellow-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label} ({tab.count})
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
                    <button className="flex items-center gap-2 border border-gray-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <XCircle size={16} />
                        Cancel Subscription
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="py-4 px-4 w-12">
                                {/* Header Checkbox if needed */}
                            </th>
                            <th className="py-4 px-4 font-normal text-gray-500">Buyer</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Subscription ID</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Status</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Billing Status</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Start Date</th>
                            <th className="py-4 px-4 font-normal text-gray-500">Next Billing Date</th>
                            <th className="py-4 px-4 font-normal text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {subscriptions.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 group"
                            >
                                <td className="py-4 px-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900">{item.buyer}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">{item.email}</div>
                                </td>
                                <td className="py-4 px-4 font-medium text-gray-900">{item.id}</td>
                                <td className={`py-4 px-4 font-medium ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </td>
                                <td className="py-4 px-4 text-gray-900">{item.billingStatus}</td>
                                <td className="py-4 px-4 text-gray-900">{item.startDate}</td>
                                <td className="py-4 px-4 text-gray-900">{item.nextBilling}</td>
                                <td className="py-4 px-4 text-right">
                                    <button
                                        className="text-red-500 border border-red-500 hover:bg-red-50 text-xs px-4 py-1.5 rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
