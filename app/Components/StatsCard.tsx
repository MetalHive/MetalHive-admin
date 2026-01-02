import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, subtitle }) => {
    return (
        <div className="h-full rounded-xl border border-gray-200 bg-white p-6 flex flex-col justify-between min-h-[110px]">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 font-medium flex items-center justify-between">
                    {title}
                    {icon && <span className="text-gray-400">{icon}</span>}
                </p>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">
                    {value}
                </p>
                {subtitle && (
                     <p className="text-xs text-gray-400 mt-1">
                        {subtitle}
                     </p>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
