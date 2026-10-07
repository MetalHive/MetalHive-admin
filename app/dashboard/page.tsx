'use client'
import { useEffect } from 'react';
import SideBar from '../Components/Sidebar'
import { LuWallet } from "react-icons/lu";
import { MdPerson } from "react-icons/md";
import { BsFillGridFill } from "react-icons/bs";
import ListingsTable from '../Components/ListingsTable';
import ErrorBanner from '../Components/ErrorBanner';
import useDashboardStore from '@/app/store/useDashboardStore';
import { formatCurrency } from '@/app/lib/format';

const Dashboard = () => {
    const { stats, error, fetchStats } = useDashboardStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = [
        {
            key: '1',
            icon: <BsFillGridFill />,
            title: 'Total Listings',
            amount: stats?.totalListings.toLocaleString() || "0",
            sub: 'All listings on the platform',
        },
        {
            key: '2',
            icon: <LuWallet />,
            title: 'Pending Bids',
            amount: stats?.pendingBids.toLocaleString() || "0",
            sub: 'Bids awaiting action',
        },
        {
            key: '3',
            icon: <LuWallet />,
            title: 'Total Volume',
            amount: stats ? formatCurrency(stats.totalVolume) : '—',
            sub: 'Total transaction value',
        },
        {
            key: '4',
            icon: <MdPerson />,
            title: 'Total Users',
            amount: stats?.totalUsers.toLocaleString() || "0",
            sub: 'Total registered users',
        },
    ]

    return (
        <div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#17181A]">Admin Dashboard</h1>
                        <p className="text-[#737780]">Platform-wide activity and performance overview.</p>
                    </div>
                </div>

                {error && <ErrorBanner message={error} className="mb-4" />}

                {/* second sec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <div className="w-56" key={card.key}>
                            <div className="h-[110px] rounded-xl border border-gray-200 bg-white p-4 flex flex-col justify-between">
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    {card.title}
                                    {card.icon}
                                </p>

                                <p className="text-2xl font-semibold text-gray-900">
                                    {card.amount}
                                </p>
                            </div>

                            <p className="mt-2 text-sm text-gray-400">
                                {card.sub}
                            </p>
                        </div>

                    ))}
                </div>

                <ListingsTable />
            </div>
        </div>
    )
}

export default Dashboard
