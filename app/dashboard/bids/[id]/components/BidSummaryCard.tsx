import React from 'react';

export default function BidSummaryCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">$</span>
                Bid Summary
                <span className="ml-auto text-xs text-gray-400 font-normal">Placed Nov 12, 2023</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-[#FFF9EB] p-4 rounded-lg border border-[#FBEEC7]">
                    <p className="text-xs text-gray-500 mb-1">Bid Summary</p>
                    <p className="text-2xl font-semibold text-gray-900">$14,500</p>
                </div>

                <div className="flex-1 border border-gray-100 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="text-xl font-medium text-gray-900">5 Tons</p>
                </div>

                <div className="flex-1 border border-gray-100 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="text-xl font-medium text-gray-900">$2,900</p>
                </div>
            </div>
        </div>
    );
}
