'use client'
import PayoutTable from '@/app/Components/PayoutTable';
import SideBar from '@/app/Components/Sidebar'
import { useEffect } from 'react';
import usePayoutsStore from '@/app/store/usePayoutsStore';
import { formatCurrency } from '@/app/lib/format';

const PayoutsPage = () => {
    const { stats, fetchStats } = usePayoutsStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = [
        {
            key: '1',
            title: 'Pending Payouts',
            amount: stats?.pendingPayouts.toLocaleString() || "0",
            sub: 'Requests waiting approval',
        },
        {
            key: '2',
            title: 'Total Paid Out',
            amount: formatCurrency(stats?.totalPaidOut ?? 0),
            sub: 'Successfully processed',
        },
    ]

    return (
        <div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-normal text-[#17181A]">Payouts</h1>
                        <p className="text-[#737780]">Review and manage seller payout requests.</p>
                    </div>
                </div>
                {/* second sec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <div className="w-56" key={card.key}>
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
                <PayoutTable />
            </div>
        </div>
    )
}

export default PayoutsPage
