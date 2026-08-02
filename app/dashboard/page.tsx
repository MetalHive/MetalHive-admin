'use client'
import { useEffect, useState } from 'react';
import SideBar from '../Components/Sidebar'
import { FaSortDown } from "react-icons/fa";
import { LuCalendarRange } from "react-icons/lu";
import { LuWallet } from "react-icons/lu";
import { MdPerson } from "react-icons/md";
import { BsFillGridFill } from "react-icons/bs";
import ListingsTable from '../Components/ListingsTable';
import useDashboardStore from '@/app/store/useDashboardStore';
import { formatCurrency } from '@/app/lib/format';

const Dashbaoard = () => {
    const { stats, fetchStats } = useDashboardStore();

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            key: '1',
            icon: <BsFillGridFill />,
            title: 'Total Listings',
            amount: stats?.totalListings.toLocaleString() || "0",
            sub: 'Active listings',
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
            amount: stats ? formatCurrency(stats.totalVolume) : '---',
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

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("30 days");
    return (
        <div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#17181A]">Admin Dashboard</h1>
                        <p className="text-[#737780]">Platform-wide activity and performance overview.</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card, index) => (
                        <div className="w-56" key={index}>
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

export default Dashbaoard