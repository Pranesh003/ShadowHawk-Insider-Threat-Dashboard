import React from 'react';
import { SettingsState } from '../../types';
import { DATA_RETENTION_OPTIONS } from '../../constants';

interface SettingsProps {
    settings: SettingsState;
    onSettingsChange: (setting: keyof SettingsState, value: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
    return (
        <div className="p-6 h-full overflow-y-auto text-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>
            <div className="max-w-2xl">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Compliance & Privacy</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="retention-policy" className="block text-sm font-medium text-gray-400 mb-2">
                                Data Retention Policy
                            </label>
                            <select
                                id="retention-policy"
                                value={settings.dataRetentionPeriod}
                                onChange={(e) => onSettingsChange('dataRetentionPeriod', e.target.value)}
                                className="w-full max-w-xs bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {DATA_RETENTION_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Configure how long security logs are stored. Changes are audited.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};