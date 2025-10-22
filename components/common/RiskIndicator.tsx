
import React from 'react';
import { RiskLevel } from '../../types';
import { RISK_COLORS } from '../../constants';

interface RiskIndicatorProps {
    level: RiskLevel;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level }) => {
    const colorClass = RISK_COLORS[level] || 'bg-gray-500';
    
    return (
        <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full ${colorClass} mr-2`}></span>
            <span className="font-semibold text-sm">{level}</span>
        </div>
    );
};
