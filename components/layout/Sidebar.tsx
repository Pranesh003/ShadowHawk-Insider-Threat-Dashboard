
import React from 'react';
import { FilterState, RiskLevel, EventType } from '../../types';
import { FilterPanel } from '../dashboard/FilterPanel';
import { ALL_RISK_LEVELS, ALL_EVENT_TYPES, ALL_ENDPOINT_STATUSES, TIME_RANGE_OPTIONS } from '../../constants';

interface SidebarProps {
    isOpen: boolean;
    filters: FilterState;
    onFilterChange: (filterType: keyof FilterState, value: string) => void;
    onClearFilters: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, filters, onFilterChange, onClearFilters }) => {
    return (
        <aside className={`flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`} style={{ overflow: 'hidden' }}>
            <div className="p-4 flex-grow overflow-y-auto">
                 <h2 className="text-lg font-semibold mb-4 text-gray-300">Filters</h2>
                 
                 <div className="mb-6">
                    <h3 className="font-semibold text-gray-400 mb-2">Time Range</h3>
                    <div className="flex flex-col space-y-2">
                        {TIME_RANGE_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onFilterChange('timeRange', option.value)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                    filters.timeRange === option.value
                                        ? 'bg-blue-600 text-white font-semibold'
                                        : 'bg-gray-700/50 hover:bg-gray-600'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                 <FilterPanel
                    title="Risk Level"
                    options={ALL_RISK_LEVELS}
                    selected={filters.risk}
                    onChange={(value) => onFilterChange('risk', value)}
                />
                <FilterPanel
                    title="Event Type"
                    options={ALL_EVENT_TYPES}
                    selected={filters.type}
                    onChange={(value) => onFilterChange('type', value)}
                />
                <FilterPanel
                    title="Endpoint Status"
                    options={ALL_ENDPOINT_STATUSES}
                    selected={filters.status}
                    onChange={(value) => onFilterChange('status', value)}
                />

                <button
                    onClick={onClearFilters}
                    className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition-colors"
                >
                    Clear All Filters
                </button>
            </div>
            <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
                ShadowHawk v1.0.0
            </div>
        </aside>
    );
};