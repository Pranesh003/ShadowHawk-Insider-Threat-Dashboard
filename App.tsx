
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { EventLogItem, Endpoint, RiskLevel, EventType, FilterState, EndpointStatus, GenericEventLogItem, SettingsState, AuditEventLogItem } from './types';
import { generateInitialEndpoints, generateNewEvent } from './services/mockApi';
import { DEFAULT_FILTERS, DEFAULT_SETTINGS, DATA_RETENTION_OPTIONS } from './constants';
import { UserProvider } from './contexts/UserContext';

const MAX_EVENTS = 500; // Increased to accommodate event bursts

const AppContent: React.FC = () => {
    const [events, setEvents] = useState<EventLogItem[]>([]);
    const [endpoints, setEndpoints] = useState<Endpoint[]>(generateInitialEndpoints());
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

    const addEvents = useCallback((newEvents: EventLogItem[]) => {
        setEvents(prevEvents => [...newEvents, ...prevEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, MAX_EVENTS));
    }, []);

    // Effect for real-time data and agent reconnection simulation
    useEffect(() => {
        // Initial data population
        const initialEvents: EventLogItem[] = [];
        for (let i = 0; i < 50; i++) {
            initialEvents.unshift(generateNewEvent(endpoints));
        }
        setEvents(initialEvents);

        // Simulate real-time data feed from online agents
        const liveFeedInterval = setInterval(() => {
            addEvents([generateNewEvent(endpoints)]);
        }, 2000);
        
        // Simulate offline agents coming back online
        const reconnectionInterval = setInterval(() => {
            setEndpoints(prevEndpoints => {
                const offlineAgents = prevEndpoints.filter(e => e.status === EndpointStatus.OFFLINE && e.queuedEvents > 0);
                if (offlineAgents.length > 0 && Math.random() < 0.25) { // 25% chance to reconnect one agent
                    const agentToReconnect = offlineAgents[0];
                    console.log(`Agent ${agentToReconnect.hostname} coming back online...`);

                    // Generate the burst of historical events
                    const burstEvents: EventLogItem[] = [];
                    for (let i = 0; i < agentToReconnect.queuedEvents; i++) {
                        burstEvents.push(generateNewEvent(prevEndpoints, agentToReconnect.id, true));
                    }
                    addEvents(burstEvents);
                    
                    // Update the agent's status
                    return prevEndpoints.map(ep =>
                        ep.id === agentToReconnect.id
                            ? { ...ep, status: EndpointStatus.ONLINE, queuedEvents: 0, connection: { ...ep.connection, status: 'Secure' } }
                            : ep
                    );
                }
                return prevEndpoints;
            });
        }, 10000);


        return () => {
            clearInterval(liveFeedInterval);
            clearInterval(reconnectionInterval);
        };
    }, [endpoints, addEvents]);

    const filteredEvents = useMemo(() => {
        const now = Date.now();
        let timeCutoff = 0;
        switch (filters.timeRange) {
            case '15m':
                timeCutoff = now - 15 * 60 * 1000;
                break;
            case '1h':
                timeCutoff = now - 60 * 60 * 1000;
                break;
            case '24h':
                timeCutoff = now - 24 * 60 * 60 * 1000;
                break;
        }

        return events.filter(event => {
            // Time range filter
            if (filters.timeRange !== 'all' && event.timestamp.getTime() < timeCutoff) {
                return false;
            }

            const riskMatch = filters.risk.length === 0 || filters.risk.includes(event.riskLevel);
            const typeMatch = filters.type.length === 0 || filters.type.includes(event.eventType);
            const endpoint = endpoints.find(e => e.id === event.endpointId);
            const endpointStatusMatch = filters.status.length === 0 || (endpoint && filters.status.includes(endpoint.status));

            if (!riskMatch || !typeMatch || !endpointStatusMatch) {
                return false;
            }

            if (searchTerm.trim() === '') {
                return true;
            }

            const lowerSearchTerm = searchTerm.toLowerCase();
            const endpointMatch = endpoint && (
                endpoint.hostname.toLowerCase().includes(lowerSearchTerm) ||
                endpoint.user.toLowerCase().includes(lowerSearchTerm) ||
                endpoint.ip.toLowerCase().includes(lowerSearchTerm)
            );

            if (endpointMatch) return true;

            switch (event.eventType) {
                case EventType.FILE_SYSTEM:
                    return event.details.path.toLowerCase().includes(lowerSearchTerm) || event.details.processName.toLowerCase().includes(lowerSearchTerm);
                case EventType.PROCESS:
                    return event.details.processName.toLowerCase().includes(lowerSearchTerm) || event.details.commandLine.toLowerCase().includes(lowerSearchTerm) || String(event.details.processId).includes(lowerSearchTerm);
                case EventType.USB:
                    return event.details.deviceName.toLowerCase().includes(lowerSearchTerm) || event.details.serialNumber.toLowerCase().includes(lowerSearchTerm);
                case EventType.NETWORK:
                    return event.details.destinationIp.toLowerCase().includes(lowerSearchTerm);
                case EventType.LOGIN_ATTEMPT:
                    return event.details.username.toLowerCase().includes(lowerSearchTerm) || event.details.sourceIp.toLowerCase().includes(lowerSearchTerm);
                case EventType.ADMIN:
                    return (event as GenericEventLogItem).description.toLowerCase().includes(lowerSearchTerm);
                case EventType.AUDIT:
                    return (event as AuditEventLogItem).description.toLowerCase().includes(lowerSearchTerm);
                default:
                    return false;
            }
        });
    }, [events, filters, searchTerm, endpoints]);

    const handleFilterChange = useCallback((filterType: keyof FilterState, value: string) => {
        setFilters(prevFilters => {
            if (filterType === 'timeRange') {
                return { ...prevFilters, timeRange: value };
            }
            
            const currentFilterValues = prevFilters[filterType] as string[];
            const newFilterValues = currentFilterValues.includes(value)
                ? currentFilterValues.filter(v => v !== value)
                : [...currentFilterValues, value];
            return { ...prevFilters, [filterType]: newFilterValues };
        });
    }, []);
    
    const handleClearFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    const handleAction = useCallback((action: string, eventId: string, endpointId: string) => {
        console.log(`Action: ${action} triggered for event ${eventId} on endpoint ${endpointId}`);
        
        // Update endpoint status based on action
        if (action === 'Quarantine' || action === 'Isolate') {
            setEndpoints(prevEndpoints =>
                prevEndpoints.map(ep =>
                    ep.id === endpointId ? { ...ep, status: EndpointStatus.QUARANTINED } : ep
                )
            );
        }

        const endpoint = endpoints.find(e => e.id === endpointId);
        if (endpoint) {
            const actionEvent: GenericEventLogItem = {
                id: `evt-${Date.now()}-admin`,
                timestamp: new Date(),
                endpointId,
                eventType: EventType.ADMIN,
                riskLevel: RiskLevel.LOW,
                description: `Admin action '${action}' on endpoint ${endpoint.hostname}`
            };
            addEvents([actionEvent]);
        }
    }, [endpoints, addEvents]);

    const handleSettingsChange = useCallback((setting: keyof SettingsState, value: string) => {
        const oldSettings = settings;
        const newSettings = { ...oldSettings, [setting]: value };
        setSettings(newSettings);

        // Create audit event for settings change
        if (setting === 'dataRetentionPeriod') {
             const oldLabel = DATA_RETENTION_OPTIONS.find(opt => opt.value === oldSettings.dataRetentionPeriod)?.label || oldSettings.dataRetentionPeriod;
             const newLabel = DATA_RETENTION_OPTIONS.find(opt => opt.value === value)?.label || value;
             const auditDescription = `Admin updated Data Retention Policy from '${oldLabel}' to '${newLabel}'`;
            
             const auditEvent: AuditEventLogItem = {
                id: `evt-${Date.now()}-audit`,
                timestamp: new Date(),
                endpointId: 'dashboard',
                eventType: EventType.AUDIT,
                riskLevel: RiskLevel.LOW,
                description: auditDescription,
            };
            addEvents([auditEvent]);
        }
    }, [settings, addEvents]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            <Sidebar 
                isOpen={isSidebarOpen} 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <MainContent 
                    events={filteredEvents} 
                    endpoints={endpoints} 
                    onAction={handleAction} 
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
};


export default App;