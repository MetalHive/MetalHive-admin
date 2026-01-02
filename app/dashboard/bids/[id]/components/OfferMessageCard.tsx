import React from 'react';
import { MessageSquare } from "lucide-react";

export default function OfferMessageCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <MessageSquare size={12} />
                </span>
                Offer Message
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed">
                    "We can pick up this Tuesday. Is the loading dock accessible for a 53' trailer? Also confirming if the copper is stripped or insulated as per the photos."
                </p>
            </div>
        </div>
    );
}
