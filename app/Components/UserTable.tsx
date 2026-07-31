"use client"

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { FaSortDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from 'next/link';
import useUsersStore from '@/app/store/useUsersStore';

const UserTable = () => {
    const {
        users,
        loading,
        pagination,
        fetchUsers,
        setFilter,
        deleteUser
    } = useUsersStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("30 days");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id);
        }
    }

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
                                                // Ideally connect date filter to store here
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

                            {/* Delete Button (Bulk action placeholder) */}
                            {/* <button className="flex items-center gap-2 px-3 py-2  rounded-md ">
                                <RiDeleteBin6Line size={18} />
                                <span className="text-lg">Delete</span>
                            </button> */}
                        </div>
                    </div>


                    {/* Table Header.
                        The checkbox gets its own fixed column so every heading
                        sits directly above its cell — previously the rows had a
                        checkbox inside the first column and the header did not,
                        which pushed every column out of alignment. */}
                    <div className="grid grid-cols-[32px_2.5fr_1.5fr_2fr_2fr_2fr_2fr] items-center gap-4 px-4 py-4 border-b border-gray-200 text-sm font-medium text-gray-600">
                        <div>
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 align-middle" />
                        </div>
                        <div>User</div>
                        <div>User Type</div>
                        <div>Status</div>
                        <div>Date Joined</div>
                        <div>Last Active</div>
                        <div className="text-right">Actions</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading users...</div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No users found</div>
                        ) : (
                            users.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="grid grid-cols-[32px_2.5fr_1.5fr_2fr_2fr_2fr_2fr] items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Select */}
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 align-middle" />
                                    </div>

                                    {/* User */}
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {listing.name || `${listing.first_name} ${listing.last_name}`.trim() || listing.email}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{listing.email}</p>
                                    </div>

                                    {/* User Type */}
                                    <div className="capitalize">{listing.user_type}</div>

                                    {/* Status */}
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${listing.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : listing.status === 'inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Date Joined */}
                                    <div>{listing.date_joined || '—'}</div>

                                    {/* Last Active */}
                                    <div>{listing.last_login || '—'}</div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md"
                                            href={`/dashboard/users/${encodeURIComponent(listing.id)}`}
                                        >
                                            View Listing
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(listing.id)}
                                            className="px-3 py-1.5 text-sm border text-[#FF0000] border-[#FF0000] rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center bg-white rounded-b-lg">
                        <span>Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
                        <div className="flex gap-1">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => fetchUsers(pagination.page - 1)}
                                className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchUsers(pagination.page + 1)}
                                className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserTable;
