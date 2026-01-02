"use client"

import { useState } from 'react';
import { Search } from 'lucide-react';
import { FaSortDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from 'next/link';
interface Listing {
    id: string
    name: string
    email: string
    userType: 'Buyer' | 'Seller' | 'Admin'
    status: 'Active' | 'Inactive' | 'Suspended'
    dateJoined: string
    lastActive: string
}

const UserTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("30 days");

    const listings: Listing[] = [
        { id: '1', name: 'John Doe', email: 'john.doe@email.com', userType: 'Seller', status: 'Active', dateJoined: '2024-06-12', lastActive: '2025-01-20' },
        { id: '2', name: 'Amaka Okorie', email: 'amaka.okorie@email.com', userType: 'Buyer', status: 'Active', dateJoined: '2024-08-03', lastActive: '2025-01-18' },
        { id: '3', name: 'David Musa', email: 'david.musa@email.com', userType: 'Seller', status: 'Inactive', dateJoined: '2023-11-21', lastActive: '2024-12-30' },
        { id: '4', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', userType: 'Buyer', status: 'Active', dateJoined: '2024-02-14', lastActive: '2025-01-22' },
        { id: '5', name: 'Michael Brown', email: 'michael.brown@email.com', userType: 'Admin', status: 'Active', dateJoined: '2023-05-09', lastActive: '2025-01-23' }
    ];

    return (
        <div className="min-h-screen mt-2 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg">

                    {/* Search Bar */}
                    <div className="flex justify-between px-4 py-3 border-b border-gray-200 items-center">
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50 transition"
                            >
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
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[15px] font-normal transition"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search + Delete */}
                        <div className="flex gap-4 items-center">
                            {/* Search */}
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EFEFEF] focus:border-transparent w-full"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            </div>

                            {/* Delete Button */}
                            <button className="flex items-center gap-2 px-3 py-2  rounded-md ">
                                <RiDeleteBin6Line size={18} />
                                <span className="text-lg">Delete</span>
                            </button>
                        </div>
                    </div>


                    {/* Table Header */}
                    <div className="grid grid-cols-[2.5fr_1.5fr_2fr_2fr_2fr_2fr] gap-4 px-4 py-6 border-b border-gray-200 text-sm font-medium text-gray-600">
                        <div>User</div>
                        <div>User Type</div>
                        <div>Status</div>
                        <div>Date Joined</div>
                        <div>Last Active</div>
                        <div>Actions</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-gray-200">
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                className="grid grid-cols-[2.5fr_1.5fr_2fr_2fr_2fr_2fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
                            >
                                {/* User */}
                                <div className='flex items-center gap-2'>
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                    <div>
                                        <p className="font-medium text-gray-900">{listing.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{listing.email}</p>
                                    </div>
                                </div>

                                {/* User Type */}
                                <div>{listing.userType}</div>

                                {/* Status */}
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${listing.status === 'Active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {listing.status}
                                    </span>
                                </div>

                                {/* Date Joined */}
                                <div>{listing.dateJoined}</div>

                                {/* Last Active */}
                                <div>{listing.lastActive}</div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                        className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md"
                                        href={`/dashboard/users/${encodeURIComponent(listing.id)}`}
                                    >
                                        View Listing
                                    </Link>
                                    
                                    <button className="px-3 py-1.5 text-sm border text-[#FF0000] border-[#FF0000] rounded-md">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserTable;
