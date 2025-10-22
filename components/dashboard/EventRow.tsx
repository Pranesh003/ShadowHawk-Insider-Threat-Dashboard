import React, { useState } from 'react';
import { EventLogItem, Endpoint, EventType, Permission, GenericEventLogItem, AuditEventLogItem } from '../../types';
import { RiskIndicator } from '../common/RiskIndicator';
import { EventIcon } from '../common/EventIcon';
import { useUser } from '../../contexts/UserContext';
import { PERMISSIONS_MAP } from '../../constants';

interface EventRowProps {
    event: EventLogItem;
    endpoint?: Endpoint;
    onAction: (action: string, eventId: string, endpointId: string) => void;
}

const AiDetectionIndicator: React.FC<{score: number; reason: string}> = ({ score, reason }) => (
    <div className="flex items-center text-xs text-purple-300 mt-1 italic" title={`Anomaly Score: ${score.toFixed(2)}`}>
        <svg className="w-4 h-4 mr-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6" />
            <path d="M12 9v6" />
            <path d="M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Z" />
            <path d="M5 11a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3Z" />
            <path d="M19 11a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3Z" />
        </svg>
        <span>AI: {reason}</span>
    </div>
);

const renderEventDetails = (event: EventLogItem) => {
    const detailsFragment = (() => {
        switch (event.eventType) {
            case EventType.FILE_SYSTEM: {
                const { path, processName, isSensitive } = event.details;
                return (
                    <>
                        {isSensitive && <span className="font-bold text-orange-400 mr-2">[SENSITIVE]</span>}
                        <span className="font-semibold">{event.action}:</span> {path}
                        <p className="text-gray-400 truncate text-xs" title={`by ${processName}`}>by {processName}</p>
                    </>
                );
            }
            case EventType.PROCESS: {
                const { processName, processId, commandLine, isSuspicious } = event.details;
                return (
                    <>
                        {isSuspicious && <span className="font-bold text-red-400 mr-2">[SUSPICIOUS]</span>}
                        <span className="font-semibold">{event.action}: {processName}</span> (PID: {processId})
                        <p className="text-gray-400 truncate text-xs" title={commandLine}>{commandLine}</p>
                    </>
                );
            }
            case EventType.USB: {
                const { deviceName, serialNumber, isUntrusted } = event.details;
                return (
                    <>
                        {isUntrusted && <span className="font-bold text-red-400 mr-2">[UNTRUSTED DEVICE]</span>}
                        <span className="font-semibold">{event.action}: {deviceName}</span>
                        <p className="text-gray-400 text-xs">{serialNumber}</p>
                    </>
                );
            }
            case EventType.NETWORK: {
                const { destinationIp, destinationPort, protocol } = event.details;
                return (
                    <>
                        <span className="font-semibold">{event.action}</span> to {destinationIp}:{destinationPort}
                        <p className="text-gray-400 text-xs">Protocol: {protocol}</p>
                    </>
                );
            }
             case EventType.LOGIN_ATTEMPT: {
                const { username, sourceIp } = event.details;
                return (
                    <>
                        <span className="font-semibold">Login {event.action}:</span> User '{username}'
                        <p className="text-gray-400 text-xs">from {sourceIp}</p>
                    </>
                );
            }
            case EventType.ADMIN:
            case EventType.AUDIT:
                return <span>{(event as GenericEventLogItem | AuditEventLogItem).description}</span>;
            default:
                 const unhandledEvent: never = event;
                 console.warn("Unhandled event type:", unhandledEvent);
                 return <span>Unknown event data</span>;
        }
    })();
    
    return (
        <div>
            {detailsFragment}
            {event.anomalyScore && event.riskReason && (
                <AiDetectionIndicator score={event.anomalyScore} reason={event.riskReason} />
            )}
        </div>
    );
}


export const EventRow: React.FC<EventRowProps> = ({ event, endpoint, onAction }) => {
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const { currentUser } = useUser();

    const userPermissions = PERMISSIONS_MAP[currentUser.role];
    const canTakeActions = userPermissions.includes(Permission.TAKE_ACTIONS);
    const canDisableUsb = userPermissions.includes(Permission.DISABLE_USB);
    const canViewDetails = userPermissions.includes(Permission.VIEW_DATA);

    const handleActionClick = (action: string) => {
        onAction(action, event.id, event.endpointId);
        setIsActionsOpen(false);
    };

    const showActionsMenu = canViewDetails || canTakeActions;
    
    return (
        <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-150">
            <div className="col-span-1">
                <RiskIndicator level={event.riskLevel} />
            </div>
            <div className="col-span-2 text-sm text-gray-400">
                {event.timestamp.toLocaleString()}
            </div>
            <div className="col-span-1 flex items-center space-x-2">
                <EventIcon type={event.eventType} />
                <span className="text-sm hidden lg:inline">{event.eventType === EventType.FILE_SYSTEM ? 'File' : event.eventType}</span>
            </div>
            <div className="col-span-2 text-sm">
                <div className="font-semibold">{endpoint?.hostname || 'Unknown'}</div>
                <div className="text-gray-400">{endpoint?.user || 'N/A'}</div>
            </div>
            <div className="col-span-4 text-sm text-gray-300 break-words">
                {renderEventDetails(event)}
            </div>
            <div className="col-span-2 flex justify-end">
                {showActionsMenu && (
                    <div className="relative">
                        <button 
                            onClick={() => setIsActionsOpen(!isActionsOpen)}
                            className="p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-haspopup="true"
                            aria-expanded={isActionsOpen}
                            aria-label="Event actions"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                        </button>
                        {isActionsOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-20"
                                onMouseLeave={() => setIsActionsOpen(false)}
                                role="menu"
                            >
                                {canViewDetails && (
                                     <a href="#" onClick={(e) => { e.preventDefault(); handleActionClick('View Details'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600" role="menuitem">View Details</a>
                                )}
                                {canTakeActions && (
                                    <>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleActionClick('Quarantine'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600" role="menuitem">Quarantine Endpoint</a>
                                        {canDisableUsb && (
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleActionClick('Disable USB'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600" role="menuitem">Disable USB Ports</a>
                                        )}
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleActionClick('Isolate'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600" role="menuitem">Isolate Endpoint</a>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};