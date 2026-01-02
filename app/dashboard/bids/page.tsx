"use client";

import SideBar from "@/app/Components/Sidebar";
import StatsCard from "@/app/Components/StatsCard";
import BidsTable from "@/app/Components/BidsTable";
import { useState } from "react";
import { Calendar, Gavel, FileText, CheckCircle } from "lucide-react";

export default function BidsPage() {
    const [dateFilter, setDateFilter] = useState("Last 30 days");

    const stats = [
        {
            title: "Total Bids",
            value: "1,240",
            icon: <Gavel size={18} />,
            subtitle: "All time bids",
        },
        {
            title: "Review Pending",
            value: "45",
            icon: <FileText size={18} />,
            subtitle: "Needs attention",
        },
        {
            title: "Accepted Bids",
            value: "850",
            icon: <CheckCircle size={18} />,
            subtitle: "Successful offers",
        },
        {
            title: "Total Value",
            value: "$4.2M",
            icon: null,
            subtitle: "Gross transaction volume",
        },
    ];

    return (
        <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 p-8 bg-gray-50/50">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Bids & Transactions</h1>
                            <p className="text-gray-500 mt-1">Review incoming bids and manage transaction history.</p>
                        </div>

                        <div className="relative">
                            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                                <Calendar size={18} className="text-gray-500" />
                                {dateFilter}
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <StatsCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                subtitle={stat.subtitle}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <BidsTable />
                </div>
            </div>
        </div>
    );
}
