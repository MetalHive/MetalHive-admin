"use client";

import SideBar from "@/app/Components/Sidebar";
import StatsCard from "@/app/Components/StatsCard";
import BidsTable from "@/app/Components/BidsTable";
import { useEffect } from "react";
import { Gavel, FileText, CheckCircle } from "lucide-react";
import useBidsStore from "@/app/store/useBidsStore";
import { formatCurrency } from "@/app/lib/format";

export default function BidsPage() {
    const { stats, fetchStats } = useBidsStore();
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = [
        {
            title: "Total Bids",
            value: stats?.totalBids.toLocaleString() || "0",
            icon: <Gavel size={18} />,
            subtitle: "All time bids",
        },
        {
            title: "Review Pending",
            value: stats?.reviewPendingCount.toLocaleString() || "0",
            icon: <FileText size={18} />,
            subtitle: "Needs attention",
        },
        {
            title: "Accepted Bids",
            value: stats?.acceptedBidsCount.toLocaleString() || "0",
            icon: <CheckCircle size={18} />,
            subtitle: "Successful offers",
        },
        {
            title: "Total Value",
            value: formatCurrency(stats?.totalValue ?? 0),
            icon: null,
            subtitle: "Value of accepted bids",
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
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {cards.map((stat) => (
                            <StatsCard
                                key={stat.title}
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
