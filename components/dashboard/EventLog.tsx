
import React from 'react';
import { EventLogItem, Endpoint } from '../../types';
import { EventRow } from './EventRow';

interface EventLogProps {
    events: EventLogItem[];
    endpoints: Endpoint[];
    onAction: (action: string, eventId: string, endpointId: string) => void;
}

export const EventLog: React.FC<EventLogProps> = ({ events, endpoints, onAction }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 bg-gray-800 border-b border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold uppercase text-gray-400">
                    <div className="col-span-1">Risk</div>
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-1">Type</div>
                    <div className="col-span-2">Endpoint</div>
                    <div className="col-span-4">Details</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                 {events.length > 0 ? (
                    events.map(event => (
                        <EventRow key={event.id} event={event} endpoint={endpoints.find(e => e.id === event.endpointId)} onAction={onAction} />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No events match the current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
