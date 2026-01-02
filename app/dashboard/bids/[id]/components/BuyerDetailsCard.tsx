import React from 'react';
import { BadgeCheck } from "lucide-react";

export default function BuyerDetailsCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-gray-900 font-medium mb-6 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">$</span>
                Buyer Details
            </h3>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div>
                    <h4 className="font-semibold text-gray-900">Apex Recyclers Ltd.</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <BadgeCheck size={12} />
                            Verified
                        </span>
                        <span className="text-xs text-gray-400">ID: #12D-1234</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-900">John Smith</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">j.smith@apex.com</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-medium text-gray-900">Aug 2021</span>
                </div>
            </div>

            <div className="mt-6">
                <button className="text-yellow-600 text-sm font-medium hover:underline">
                    View Profile
                </button>
            </div>
        </div>
    );
}
