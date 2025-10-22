
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    isAlert?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, isAlert = false }) => {
    const valueColor = isAlert ? 'text-red-400' : 'text-gray-100';
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-md border border-gray-700">
            <h4 className="text-sm font-medium text-gray-400">{title}</h4>
            <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
        </div>
    );
};
