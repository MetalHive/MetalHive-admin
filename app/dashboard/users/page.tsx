'use client'
import SideBar from '@/app/Components/Sidebar'
import UserTable from '@/app/Components/UserTable';
import { useEffect } from 'react';
import useUsersStore from '@/app/store/useUsersStore';
import { formatCurrency } from '@/app/lib/format';

const UsersPage = () => {
    const { stats, fetchStats } = useUsersStore();
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = [
        {
            key: '1',
            title: 'Total Listings',
            amount: stats?.totalListings.toLocaleString() || "0",
            sub: 'All listings on the platform',
        },
        {
            key: '2',
            title: 'Completed Transactions',
            amount: stats?.completedTransactions.toLocaleString() || "0",
            sub: 'Successful trades',
        },
        {
            key: '3',
            title: 'Total transaction value',
            amount: formatCurrency(stats?.totalTransactionValue ?? 0),
            sub: 'Value of completed trades',
        },
        {
            key: '4',
            title: 'Active Users',
            amount: stats?.activeUsers.toLocaleString() || "0",
            sub: 'Accounts not suspended',
        },
        {
            key: '5',
            title: 'Sellers',
            amount: stats?.sellersCount.toLocaleString() || "0",
            sub: 'Registered seller accounts',
        },
    ]

    return (
        <div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#17181A]">Users</h1>
                        <p className="text-[#737780]">Manage buyers and sellers on the platform, monitor activity, and take action when needed.</p>
                    </div>
                </div>
                {/* second sec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
                    {cards.map((card) => (
                        <div key={card.key}>
                            <div className="h-[110px] rounded-xl border border-gray-200 bg-white p-4 flex flex-col justify-between">
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    {card.title}</p>

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
                <UserTable />
            </div>
        </div>
    )
}

export default UsersPage
