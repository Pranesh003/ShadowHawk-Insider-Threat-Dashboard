
import React from 'react';

interface FilterPanelProps<T extends string> {
    title: string;
    options: readonly T[];
    selected: T[];
    onChange: (value: T) => void;
}

export function FilterPanel<T extends string>({ title, options, selected, onChange }: FilterPanelProps<T>) {
    return (
        <div className="mb-6">
            <h3 className="font-semibold text-gray-400 mb-2">{title}</h3>
            <div className="space-y-2">
                {options.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => onChange(option)}
                            className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
