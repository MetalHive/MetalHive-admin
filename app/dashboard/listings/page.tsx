'use client'
import SideBar from '@/app/Components/Sidebar'
import ListingsTable from '@/app/Components/ListingsTable'
import { useEffect } from 'react'
import useListingsStore from '@/app/store/useListingsStore';

const ListingsPage = () => {
    const { stats, fetchStats } = useListingsStore();

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
            title: 'Active Listings',
            amount: stats?.activeListings.toLocaleString() || "0",
            sub: 'Listings currently live',
        },
        {
            key: '3',
            title: 'Sold Listings',
            amount: stats?.soldListings.toLocaleString() || "0",
            sub: 'Listings sold',
        },
        {
            key: '4',
            title: 'Suspended Listings',
            amount: stats?.suspendedListings.toLocaleString() || "0",
            sub: 'Hidden from the marketplace',
        },
    ]

    return (
        <div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#17181A]">Listings</h1>
                        <p className="text-[#737780]">All listings created by sellers across the platform.</p>
                    </div>
                </div>
                {/* second sec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 mb-20 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <div className="w-56" key={card.key}>
                            <div className="h-[110px] rounded-xl border border-gray-200 bg-white p-4 flex flex-col justify-between">
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    {card.title}
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

export default ListingsPage
