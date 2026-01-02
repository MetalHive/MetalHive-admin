"use client";

import { Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
const listings = [
    {
        id: "#MH-8832-TR",
        bids: 4,
        date: "Nov 10, 2025",
        listing: "Copper Wire",
        seller: "Iron Works LTD.",
        amount: "$1,200.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 24, 2024",
        date: "Oct 24, 2024",
        listing: "HMS 1&2 Scrap",
        seller: "Heritage Atiba",
        amount: "$400.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 24, 2024",
        date: "Oct 24, 2024",
        listing: "Aluminum 6063",
        seller: "James Fidellis",
        amount: "$2,000.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 28, 2024",
        date: "Oct 28, 2024",
        listing: "Stainless Steels 304",
        seller: "John Doe",
        amount: "$100.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 30, 2024",
        date: "Oct 30, 2024",
        listing: "Brass Honey",
        seller: "John Livingstone",
        amount: "$560.00",
    },
    {
        id: "#MH-8832-TR",
        bids: 4,
        date: "Nov 10, 2025",
        listing: "Copper Wire",
        seller: "Iron Works LTD.",
        amount: "$1,200.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 24, 2024",
        date: "Oct 24, 2024",
        listing: "HMS 1&2 Scrap",
        seller: "Heritage Atiba",
        amount: "$400.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 24, 2024",
        date: "Oct 24, 2024",
        listing: "Aluminum 6063",
        seller: "James Fidellis",
        amount: "$2,000.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 28, 2024",
        date: "Oct 28, 2024",
        listing: "Stainless Steels 304",
        seller: "John Doe",
        amount: "$100.00",
    },
    {
        id: "#MH-8832-TR",
        bids: "Oct 30, 2024",
        date: "Oct 30, 2024",
        listing: "Brass Honey",
        seller: "John Livingstone",
        amount: "$560.00",
    },
];

export default function ListingsTable() {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("30 days");
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
                            className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                        />
                    </div>

                    <button className="flex items-center gap-1 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50">
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="font-base">
                        <tr className="text-left font-base border-b border-gray-200 p-3">
                            <th className="py-3 px-2"></th>
                            <th className="py-3 px-2">Listing ID</th>
                            <th className="py-3 px-2">Bids</th>
                            <th className="py-3 px-2">Date Created</th>
                            <th className="py-3 px-2">Listing</th>
                            <th className="py-3 px-2">Seller</th>
                            <th className="py-3 px-2">Amount</th>
                            <th className="py-3 px-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listings.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                            >
                                <td className="py-10 px-2">
                                    <input type="checkbox" />
                                </td>
                                <td className="py-6 px-2 font-medium">{item.id}</td>
                                <td className="py-6 px-2">{item.bids}</td>
                                <td className="py-6 px-2">{item.date}</td>
                                <td className="py-6 px-2">{item.listing}</td>
                                <td className="py-6 px-2">{item.seller}</td>
                                <td className="py-6 px-2 font-medium">{item.amount}</td>
                                <td className="py-6 px-2">
                                    <Link
                                        className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md"
                                        href={`/dashboard/listings/${encodeURIComponent(item.id)}`}
                                    >
                                        View Listing
                                    </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
