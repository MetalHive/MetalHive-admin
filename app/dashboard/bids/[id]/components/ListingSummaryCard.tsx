import React from 'react';
import { LayoutGrid } from "lucide-react";
import Image from 'next/image';

export default function ListingSummaryCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <LayoutGrid size={12} />
                </span>
                Listing Summary
            </h3>

            <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden relative">
                    {/* Placeholder or Image */}
                    <div className="absolute inset-0 bg-red-900/20"></div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">High Grade Copper Wiring - Batch A</h4>
                    <p className="text-xs text-gray-500 mt-1">Listed Nov 10, 2023</p>
                </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-900">Copper (Care Bright)</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-900">Birmingham</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Seller</span>
                    <span className="font-medium text-gray-900">Industrial Corp</span>
                </div>
            </div>

            <button className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                View Listing
            </button>
        </div>
    );
}
