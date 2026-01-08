'use client'
import SideBar from '@/app/Components/Sidebar'
import TableWithTabs from '@/app/Components/ListingsTable' // This was Listing2Table before, assuming ListingsTable replaces it or we should stick to ListingsTable
import { useState, useEffect } from 'react'
import { FaSortDown } from "react-icons/fa";
import { LuCalendarRange } from "react-icons/lu";
import useListingsStore from '@/app/store/useListingsStore';

const page = () => {
    const { stats, fetchStats } = useListingsStore();

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            key: '1',
            title: 'Total Listings',
            amount: stats?.totalListings.toLocaleString() || "0",
            sub: 'Active listings',
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
        // Placeholder for 4th card since API gives 3 stats
        {
            key: '4',
            title: 'Total Volume',
            amount: '---',
            sub: 'Total value',
        },
    ]

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("30 days");

    return (
        <div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#17181A]">Listings</h1>
                        <p className="text-[#737780]">All listings created by sellers across the platform.</p>
                    </div>
                    <div>
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50"
                            >
                                <LuCalendarRange className="text-black text-[18px]" />
                                <span className="text-black">{selected}</span>
                                <FaSortDown className="text-black text-[18px]" />
                            </button>

                            {open && (
                                <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
                                    {["30 days", "2 weeks", "7 days", "24 hours"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setSelected(opt);
                                                setOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[15px] font-normal"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                {/* second sec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 mb-20 lg:grid-cols-4 gap-4">
                    {cards.map((card, index) => (
                        <div className="w-56" key={index}>
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
                <TableWithTabs />
            </div>
        </div>
    )
}

export default page