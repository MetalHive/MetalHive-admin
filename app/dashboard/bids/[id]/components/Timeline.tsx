import React from 'react';
import { Clock } from "lucide-react";

export default function Timeline() {
    const events = [
        {
            title: "Bid Sent",
            description: "Apex Recyclers sent an offer for $200",
            date: "Nov 14, 10:42 AM",
            active: true,
        },
        {
            title: "Seller Viewed Bid",
            description: "",
            date: "Nov 14, 10:42 AM",
            active: false,
        },
        {
            title: "Bid Countered",
            description: "Seller countered the offer for $230",
            date: "Nov 14, 10:42 AM",
            active: false,
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-gray-900 font-medium mb-6 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <Clock size={12} />
                </span>
                Activity Timeline
            </h3>

            <div className="relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-gray-100"></div>

                <div className="space-y-8">
                    {events.map((event, index) => (
                        <div key={index} className="relative flex gap-4">
                            {/* Dot */}
                            <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${event.active ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-yellow-500'}`}>
                                {event.active && <div className="absolute inset-1 bg-yellow-500 rounded-full"></div>}
                            </div>

                            <div className="flex-1 -mt-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                        {event.description && (
                                            <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{event.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
