'use client';

import { useEffect } from 'react';
import SideBar from '@/app/Components/Sidebar';
import VerificationTable from '@/app/Components/VerificationTable';
import useVerificationStore from '@/app/store/useVerificationStore';
import { LuCalendarRange } from "react-icons/lu";

const VerificationPage = () => {
    const { stats, fetchStats } = useVerificationStore();

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className='flex min-h-screen bg-[#FDFDFD]'>
            <SideBar />
            <div className='flex-1 p-8'>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#17181A] mb-1">Buyer Verification</h1>
                        <p className="text-[#5F6D7E] text-sm">Review and approve buyer verification requests</p>
                    </div>

                    <button className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        <LuCalendarRange className="w-4 h-4" />
                        Last 30 days
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-[#5F6D7E] text-sm font-medium mb-2">Pending reviews</p>
                        <h3 className="text-3xl font-semibold text-[#17181A]">
                            {stats?.pendingReviews?.toLocaleString() ?? '0'}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-[#5F6D7E] text-sm font-medium mb-2">Verified buyers</p>
                        <h3 className="text-3xl font-semibold text-[#17181A]">
                            {stats?.verifiedBuyers?.toLocaleString() ?? '0'}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-[#5F6D7E] text-sm font-medium mb-2">Rejected requests</p>
                        <h3 className="text-3xl font-semibold text-[#17181A]">
                            {stats?.rejectedRequests?.toLocaleString() ?? '0'}
                        </h3>
                    </div>
                </div>

                {/* Table Section */}
                <VerificationTable />
            </div>
        </div>
    );
};

export default VerificationPage;
