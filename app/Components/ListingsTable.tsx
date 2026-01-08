"use client";

import { Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useListingsStore from "@/app/store/useListingsStore";

export default function ListingsTable() {
    const {
        listings,
        loading,
        pagination,
        fetchListings,
        setFilter,
        deleteListing
    } = useListingsStore();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("30 days");
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Initial fetch
    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this listing?')) {
            await deleteListing(id);
        }
    }

    return (
        <div className="bg-white   mt-14  ">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-l border-gray-200 p-3 border-r border-b shadow-xs">
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50"
                    >

                        <span className="text-black">{selected}</span>

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

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                        />
                    </div>

                    {/* Bulk delete placeholder */}
                    <button className="flex items-center gap-1 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50">
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm">
                    <thead className="font-base">
                        <tr className="text-left font-base border-b border-gray-200 p-3">
                            <th className="py-3 px-2"></th>
                            <th className="py-3 px-2">Listing ID</th>

                            <th className="py-3 px-2">Date Created</th>
                            <th className="py-3 px-2">Material</th>
                            <th className="py-3 px-2">Seller</th>
                            <th className="py-3 px-2">Price</th>
                            <th className="py-3 px-2">Quantity</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">Loading listings...</td>
                            </tr>
                        ) : listings.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">No listings found</td>
                            </tr>
                        ) : (
                            listings.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 mb-4"
                                >
                                    <td className="py-6 px-2">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="py-6 px-2 font-medium">{item.id}</td>
                                    <td className="py-6 px-2">{item.created_date}</td>
                                    <td className="py-6 px-2 font-medium">{item.material_name}</td>
                                    <td className="py-6 px-2">{item.seller_name}</td>
                                    <td className="py-6 px-2 font-medium">₦{item.price.toLocaleString()} /{item.price_unit}</td>
                                    <td className="py-6 px-2">{item.quantity}</td>
                                    <td className="py-6 px-2">
                                        <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-100 text-green-800' :
                                                item.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-6 px-2 flex gap-2">
                                        <Link
                                            className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md"
                                            href={`/dashboard/listings/${encodeURIComponent(item.id)}`}
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center bg-white">
                <span>Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
                <div className="flex gap-1">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchListings(pagination.page - 1)}
                        className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchListings(pagination.page + 1)}
                        className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
