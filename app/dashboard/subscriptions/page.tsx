"use client";

import SubscriptionsTable from "@/app/Components/SubscriptionsTable";
import StatsCard from "@/app/Components/StatsCard";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import useSubscriptionStore from "@/app/store/useSubscriptionStore";

import SideBar from "@/app/Components/Sidebar";

export default function SubscriptionsPage() {
    const [dateFilter, setDateFilter] = useState("Last 30 days");

    const { stats, fetchStats } = useSubscriptionStore();
    useEffect(() => {
        fetchStats();
    }, []);

    const statsCards = [
        {
            title: "Active Subscriptions",
            value: stats?.activeCount.toLocaleString() || "0",
            icon: null,
            subtitle: null,
        },
        {
            title: "Cancelled Subscriptions",
            value: stats?.cancelledCount.toLocaleString() || "0",
            icon: null,
            subtitle: null,
        },
        {
            title: "Expired Subscriptions",
            value: stats?.expiredCount.toLocaleString() || "0",
            icon: null,
            subtitle: null,
        },
        {
            title: "Monthly Recurring Revenue",
            value: `$${(stats?.mrr || 0).toLocaleString()}`,
            icon: null,
            subtitle: null,
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
                            <p className="text-gray-500 mt-1">All offers placed by buyers across the platform.</p>
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
                        {statsCards.map((stat, index) => (
                            <StatsCard
                                key={index}
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
