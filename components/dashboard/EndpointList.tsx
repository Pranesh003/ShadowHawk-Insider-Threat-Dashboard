
import React from 'react';
import { Endpoint } from '../../types';
import { EndpointRow } from './EndpointRow';

interface EndpointListProps {
    endpoints: Endpoint[];
}

export const EndpointList: React.FC<EndpointListProps> = ({ endpoints }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 bg-gray-800 border-b border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold uppercase text-gray-400">
                    <div className="col-span-2">Hostname</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-2">IP Address</div>
                    <div className="col-span-1">OS</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Connection</div>
                    <div className="col-span-1">CPU %</div>
                    <div className="col-span-1">Agent Ver.</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                 {endpoints.length > 0 ? (
                    endpoints.map(endpoint => (
                        <EndpointRow key={endpoint.id} endpoint={endpoint} />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No endpoints found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};