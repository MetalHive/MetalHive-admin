"use client";

import SubscriptionsTable from "@/app/Components/SubscriptionsTable";
import StatsCard from "@/app/Components/StatsCard";
import { useEffect } from "react";
import useSubscriptionStore from "@/app/store/useSubscriptionStore";
import { formatCurrency } from "@/app/lib/format";

import SideBar from "@/app/Components/Sidebar";

export default function SubscriptionsPage() {
    const { stats, fetchStats } = useSubscriptionStore();
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const statsCards = [
        {
            title: "Active Subscriptions",
            value: stats?.activeCount.toLocaleString() || "0",
        },
        {
            title: "Cancelled Subscriptions",
            value: stats?.cancelledCount.toLocaleString() || "0",
        },
        {
            title: "Expired Subscriptions",
            value: stats?.expiredCount.toLocaleString() || "0",
        },
        {
            title: "Monthly Recurring Revenue",
            value: formatCurrency(stats?.mrr ?? 0),
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
                            <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
                            <p className="text-gray-500 mt-1">All buyer subscriptions across the platform.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsCards.map((stat) => (
                            <StatsCard
                                key={stat.title}
                                title={stat.title}
                                value={stat.value}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <SubscriptionsTable />
                </div>
            </div>
        </div>
    );
}
