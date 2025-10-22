
import React, { useMemo, useState } from 'react';
import { EventLogItem, Endpoint, RiskLevel, EndpointStatus, Permission, SettingsState } from '../../types';
import { StatCard } from '../dashboard/StatCard';
import { EventLog } from '../dashboard/EventLog';
import { EndpointList } from '../dashboard/EndpointList';
import { Settings } from '../dashboard/Settings';
import { useUser } from '../../contexts/UserContext';
import { PERMISSIONS_MAP } from '../../constants';

interface MainContentProps {
    events: EventLogItem[];
    endpoints: Endpoint[];
    onAction: (action: string, eventId: string, endpointId: string) => void;
    settings: SettingsState;
    onSettingsChange: (setting: keyof SettingsState, value: string) => void;
}

type View = 'events' | 'endpoints' | 'settings';

export const MainContent: React.FC<MainContentProps> = ({ events, endpoints, onAction, settings, onSettingsChange }) => {
    const [activeView, setActiveView] = useState<View>('events');
    const { currentUser } = useUser();
    
    const userPermissions = PERMISSIONS_MAP[currentUser.role];
    const canManageSettings = userPermissions.includes(Permission.MANAGE_SETTINGS);

    const { highRiskEvents, endpointsOnline, quarantinedEndpoints, anomaliesDetected } = useMemo(() => {
        return {
            highRiskEvents: events.filter(e => e.riskLevel === RiskLevel.HIGH || e.riskLevel === RiskLevel.CRITICAL).length,
            endpointsOnline: endpoints.filter(e => e.status === EndpointStatus.ONLINE).length,
            quarantinedEndpoints: endpoints.filter(e => e.status === EndpointStatus.QUARANTINED).length,
            anomaliesDetected: events.filter(e => e.anomalyScore && e.anomalyScore > 0.7).length,
        };
    }, [events, endpoints]);

    return (
        <main className="flex-1 flex flex-col bg-gray-900 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="High-Risk Alerts" value={highRiskEvents.toLocaleString()} isAlert={highRiskEvents > 0} />
                <StatCard title="AI Anomalies Detected" value={anomaliesDetected.toLocaleString()} isAlert={anomaliesDetected > 0} />
                <StatCard title="Endpoints Online" value={`${endpointsOnline} / ${endpoints.length}`} />
                <StatCard title="Quarantined" value={quarantinedEndpoints.toLocaleString()} isAlert={quarantinedEndpoints > 0} />
            </div>
            <div className="flex-1 bg-gray-800/50 rounded-lg shadow-lg overflow-hidden flex flex-col">
                 <div className="flex-shrink-0 border-b border-gray-700">
                    <nav className="flex space-x-1" aria-label="Tabs">
                         <button
                            onClick={() => setActiveView('events')}
                            className={`
                                ${activeView === 'events' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}
                                px-4 py-3 font-medium text-sm rounded-t-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                            `}
                        >
                            Event Log
                        </button>
                         <button
                            onClick={() => setActiveView('endpoints')}
                            className={`
                                ${activeView === 'endpoints' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}
                                px-4 py-3 font-medium text-sm rounded-t-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                            `}
                        >
                            Endpoints
                        </button>
                        {canManageSettings && (
                            <button
                                onClick={() => setActiveView('settings')}
                                className={`
                                    ${activeView === 'settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}
                                    px-4 py-3 font-medium text-sm rounded-t-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                                `}
                            >
                                Settings
                            </button>
                        )}
                    </nav>
                </div>
                
                {activeView === 'events' && <EventLog events={events} endpoints={endpoints} onAction={onAction} />}
                {activeView === 'endpoints' && <EndpointList endpoints={endpoints} />}
                {activeView === 'settings' && canManageSettings && <Settings settings={settings} onSettingsChange={onSettingsChange} />}
            </div>
        </main>
    );
};