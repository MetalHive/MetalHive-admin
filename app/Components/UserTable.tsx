"use client"

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import useUsersStore from '@/app/store/useUsersStore';
import { useToast } from "@/app/Components/Toast";
import ErrorBanner from "@/app/Components/ErrorBanner";
import PaginationFooter from "@/app/Components/PaginationFooter";
import { formatDate } from '@/app/lib/format';

const UserTable = () => {
    const {
        users,
        loading,
        error,
        filters,
        pagination,
        fetchUsers,
        setFilter,
        deleteUser
    } = useUsersStore();

    const [searchQuery, setSearchQuery] = useState(filters.search);

    // Exactly one fetch on mount.
    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    // Debounced search; skipped when the input already matches the store.
    useEffect(() => {
        if (searchQuery === filters.search) return;
        const timeoutId = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters.search, setFilter]);

    const toast = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            toast.success('User deleted.');
        } catch {
            toast.error(useUsersStore.getState().error || 'Failed to delete user.');
        }
    }

    return (
        <div className="min-h-screen mt-2 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg">

                    {/* Search Bar */}
                    <div className="flex justify-end px-4 py-3 border-b border-gray-200 items-center">
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
                    </div>

                    {error && <ErrorBanner message={error} className="m-4" />}

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
                            <div className="p-8 text-center text-gray-500">
                                {error ? 'Users could not be loaded.' : 'No users found'}
                            </div>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-[32px_2.5fr_1.5fr_2fr_2fr_2fr_2fr] items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Select */}
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 align-middle" />
                                    </div>

                                    {/* User */}
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {user.name || user.email}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>

                                    {/* User Type */}
                                    <div className="capitalize">{user.user_type}</div>

                                    {/* Status */}
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Date Joined */}
                                    <div>{formatDate(user.date_joined)}</div>

                                    {/* Last Active */}
                                    <div>{formatDate(user.last_login)}</div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md"
                                            href={`/dashboard/users/${encodeURIComponent(String(user.id))}`}
                                        >
                                            View User
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(String(user.id))}
                                            className="px-3 py-1.5 text-sm border text-[#FF0000] border-[#FF0000] rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <PaginationFooter pagination={pagination} onPageChange={fetchUsers} className="bg-white rounded-b-lg" />
                </div>
            </div>
        </div>
    );
};

export default UserTable;
