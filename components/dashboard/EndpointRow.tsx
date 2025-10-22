
import React from 'react';
import { Endpoint, EndpointStatus } from '../../types';

interface EndpointRowProps {
    endpoint: Endpoint;
}

const getStatusDisplay = (endpoint: Endpoint) => {
    const colorMap = {
        [EndpointStatus.ONLINE]: 'text-green-400',
        [EndpointStatus.OFFLINE]: 'text-gray-500',
        [EndpointStatus.QUARANTINED]: 'text-yellow-400',
    };
    const color = colorMap[endpoint.status] || 'text-gray-400';

    return (
        <div className={`font-semibold ${color}`}>
            <span>{endpoint.status}</span>
            {endpoint.status === EndpointStatus.OFFLINE && endpoint.queuedEvents > 0 && (
                <span className="text-xs font-normal ml-1">({endpoint.queuedEvents} queued)</span>
            )}
        </div>
    );
};

const getOsIcon = (os: 'Windows' | 'Linux') => {
    if (os === 'Windows') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2"><path fill="#00adef" d="M1,10.1l18.3-2.5v15.6H1V10.1z M20.3,7.1l26.7-3.7v15.9H20.3V7.1z M1,24.8h18.3v15.6L1,37.9V24.8z M20.3,24.8h26.7v15.9l-26.7-3.7V24.8z"/></svg>
        );
    }
    return (
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2"><path fill="#fbc02d" d="M34,10c-3,0-4,2-4,2s2-1,3-1c1,0,3,1,3,3s-2,3-3,3c-1,0-3-1-3-1V7c0-4-3-4-3-4s-3.535,0-4,4v5h-2V7 c0-4-2.465-4-4-4s-5,0-5,4v5h-1c-1.105,0-2,0.895-2,2v17c0,1.105,0.895,2,2,2h10c1.105,0,2-0.895,2-2V24h2v10 c0,1.105,0.895,2,2,2h10c1.105,0,2-0.895,2-2V21l-5-4l5-4V10z M19,34h-6v-2h6V34z M19,29h-6v-2h6V29z M19,24h-6v-2h6V24z M37,34h-6v-2 h6V34z M37,29h-6v-2h6V29z M37,24h-6v-2h6V24z"/><path fill="#f57c00" d="M34,13c-0.552,0-1-0.448-1-1v-2c0-0.552,0.448-1,1-1s1,0.448,1,1v2C35,12.552,34.552,13,34,13z"/><path fill="#f57c00" d="M29,9V7c0-0.552,0.448-1,1-1s1,0.448,1,1v2c0,0.552-0.448,1-1,1S29,9.552,29,9z"/><path fill="#f57c00" d="M20,9V7c0-0.552,0.448-1,1-1s1,0.448,1,1v2c0,0.552-0.448,1-1,1S20,9.552,20,9z"/><path fill="#f57c00" d="M15,9V7c0-0.552,0.448-1,1-1s1,0.448,1,1v2c0,0.552-0.448,1-1,1S15,9.552,15,9z"/><path fill="#f57c00" d="M24.5,23.5c-1.105,0-2-0.895-2-2v-2c0-1.105,0.895-2,2-2h0c1.105,0,2,0.895,2,2v2 C26.5,22.605,25.605,23.5,24.5,23.5z"/><path fill="#f57c00" d="M24.5,39.5c-3.038,0-5.5-2.462-5.5-5.5v-7c0-1.105,0.895-2,2-2h7c1.105,0,2,0.895,2,2v7 C30,37.038,27.538,39.5,24.5,39.5z M21,29.5c0,1.933,1.567,3.5,3.5,3.5S28,31.433,28,29.5v-4h-7V29.5z"/></svg>
    );
};

const ConnectionIndicator: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => {
    const { connection } = endpoint;
    const isSecure = connection.status === 'Secure';
    
    const color = isSecure ? 'text-green-400' : 'text-gray-500';
    const tooltipText = isSecure 
        ? `Secure Connection (${connection.protocol}, Auth: ${connection.authMethod})`
        : 'Connection Unavailable';

    return (
        <div className="relative group flex items-center" title={tooltipText}>
             <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSecure
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                }
            </svg>
        </div>
    );
};


export const EndpointRow: React.FC<EndpointRowProps> = ({ endpoint }) => {
    
    return (
        <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-150 text-sm">
            <div className="col-span-2 font-semibold">{endpoint.hostname}</div>
            <div className="col-span-2 text-gray-400">{endpoint.user}</div>
            <div className="col-span-2 text-gray-400">{endpoint.ip}</div>
            <div className="col-span-1 flex items-center">
                {getOsIcon(endpoint.os)}
                <span className="hidden lg:inline">{endpoint.os}</span>
            </div>
            <div className="col-span-1">
                {getStatusDisplay(endpoint)}
            </div>
            <div className="col-span-1">
                <ConnectionIndicator endpoint={endpoint} />
            </div>
            <div className="col-span-1 text-gray-400">{endpoint.cpuUsage.toFixed(2)}%</div>
            <div className="col-span-1 text-gray-400">v{endpoint.agentVersion}</div>
            <div className="col-span-1 flex justify-end">
                 <button 
                    className="p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Endpoint actions"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
            </div>
        </div>
    );
};