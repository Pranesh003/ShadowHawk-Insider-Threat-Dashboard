
import { 
    Endpoint, EventLogItem, EventType, RiskLevel, EndpointStatus,
    FileEventAction,
    FileSystemEventLogItem, 
    ProcessEventLogItem,
    UsbEventLogItem,
    NetworkEventLogItem,
    LoginAttemptEventLogItem,
    ConnectionDetails
} from '../types';
import { SENSITIVE_FILE_PATHS, SUSPICIOUS_PROCESS_NAMES, UNTRUSTED_USB_SERIALS } from '../constants';

const hostnames = ['CORP-LT-01', 'FIN-WS-05', 'DEV-SRV-12', 'HR-PC-02', 'EXEC-MBP-01'];
const users = ['j.doe', 'a.smith', 'b.jones', 'c.williams', 'd.brown'];
const filePaths = ['C:\\Users\\j.doe\\Documents\\confidential.docx', '/home/a.smith/dev/project_alpha/keys.pem', 'C:\\Windows\\System32\\kernel32.dll', ...SENSITIVE_FILE_PATHS];
const processes = ['powershell.exe', 'cmd.exe', 'python3', 'svuchost.exe', ...SUSPICIOUS_PROCESS_NAMES];
const usbDevices = ['Kingston DataTraveler', 'SanDisk Ultra', 'Generic USB Storage', 'Malicious USB'];
const usbSerials = ['SN-A123', 'SN-B456', 'SN-C789', ...UNTRUSTED_USB_SERIALS];
const remoteIPs = ['10.0.5.21', '192.168.1.101', '8.8.8.8', '208.67.222.222', '123.45.67.89'];

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomPID = () => Math.floor(Math.random() * 50000) + 1000;

export const generateInitialEndpoints = (): Endpoint[] => {
    const oss: ('Windows' | 'Linux')[] = ['Windows', 'Windows', 'Linux', 'Windows', 'Linux'];
    return hostnames.map((hostname, index) => {
        const status = randomElement([EndpointStatus.ONLINE, EndpointStatus.OFFLINE, EndpointStatus.QUARANTINED]);
        const connection: ConnectionDetails = {
            protocol: 'TLSv1.3',
            authMethod: randomElement(['Token', 'mTLS']),
            status: status === EndpointStatus.OFFLINE ? 'Unavailable' : 'Secure',
        };
        
        return {
            id: `endpoint-${index + 1}`,
            hostname,
            user: users[index],
            ip: `192.168.1.10${index}`,
            status,
            os: oss[index],
            agentVersion: `1.0.${Math.floor(Math.random() * 5)}`,
            cpuUsage: parseFloat((Math.random() * 1.5 + 0.1).toFixed(2)), // Simulate <2% CPU usage
            connection,
            queuedEvents: status === EndpointStatus.OFFLINE ? Math.floor(Math.random() * 200) + 50 : 0,
        };
    });
};

const simulateAnomalyDetection = (event: EventLogItem) => {
    // 15% chance of being an AI-flagged anomaly for relevant event types
    if ([EventType.FILE_SYSTEM, EventType.PROCESS, EventType.NETWORK].includes(event.eventType) && Math.random() < 0.15) {
        const anomalyScore = parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)); // Score between 0.5 and 1.0
        event.anomalyScore = anomalyScore;
        
        if (anomalyScore > 0.9) {
            event.riskLevel = RiskLevel.CRITICAL;
            event.riskReason = "Critical deviation from baseline behavior.";
        } else if (anomalyScore > 0.7) {
            event.riskLevel = RiskLevel.HIGH;
            event.riskReason = "Unusual activity pattern detected.";
        } else {
             event.riskReason = "Minor behavioral anomaly detected.";
        }
    }
};


export const generateNewEvent = (endpoints: Endpoint[], specificEndpointId?: string, historical: boolean = false): EventLogItem => {
    const type = randomElement(Object.values(EventType).filter(e => e !== EventType.ADMIN && e !== EventType.AUDIT));
    
    let endpointId: string;
    if (specificEndpointId) {
        endpointId = specificEndpointId;
    } else {
        endpointId = randomElement(endpoints.filter(e => e.status === EndpointStatus.ONLINE))?.id || randomElement(endpoints).id;
    }

    const timestamp = historical
        ? new Date(Date.now() - Math.random() * 1000 * 60 * 5) // Sometime in the last 5 minutes
        : new Date();
    
    const baseEvent = {
        id: `evt-${timestamp.getTime()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp,
        endpointId,
    };

    let newEvent: EventLogItem;

    switch (type) {
        case EventType.FILE_SYSTEM: {
            const path = randomElement(filePaths);
            const isSensitive = SENSITIVE_FILE_PATHS.includes(path);
            newEvent = {
                ...baseEvent,
                eventType: EventType.FILE_SYSTEM,
                action: randomElement(Object.values(FileEventAction)),
                riskLevel: isSensitive ? RiskLevel.HIGH : randomElement([RiskLevel.LOW, RiskLevel.MEDIUM]),
                details: { path, processName: randomElement(processes), processId: randomPID(), isSensitive }
            };
            break;
        }
        case EventType.PROCESS: {
            const processName = randomElement(processes);
            const commandLine = processName.includes('powershell') ? `powershell.exe -enc ZQBjAGgAbwAgAEgAZQBsAGwAbwAgAFcAbwByAGwAZAA=` : `${processName} -a -b`;
            const isSuspicious = SUSPICIOUS_PROCESS_NAMES.includes(processName);
            newEvent = {
                ...baseEvent,
                eventType: EventType.PROCESS,
                action: randomElement(['Started', 'Terminated']),
                riskLevel: isSuspicious ? RiskLevel.CRITICAL : RiskLevel.MEDIUM,
                details: { processName, processId: randomPID(), commandLine, isSuspicious }
            };
            break;
        }
        case EventType.USB: {
            const action = randomElement(['Connected', 'Disconnected'] as const);
            const deviceName = randomElement(usbDevices);
            const serialNumber = randomElement(usbSerials);
            const isUntrusted = UNTRUSTED_USB_SERIALS.includes(serialNumber);
            newEvent = {
                ...baseEvent,
                eventType: EventType.USB,
                action,
                riskLevel: isUntrusted && action === 'Connected' ? RiskLevel.CRITICAL : RiskLevel.MEDIUM,
                details: { deviceName, serialNumber, isUntrusted }
            };
            break;
        }
        case EventType.NETWORK: {
            newEvent = {
                ...baseEvent,
                eventType: EventType.NETWORK,
                action: randomElement(['Connection Attempt', 'Connection Established']),
                riskLevel: randomElement([RiskLevel.LOW, RiskLevel.MEDIUM]),
                details: { destinationIp: randomElement(remoteIPs), destinationPort: randomElement([443, 80, 8080, 22]), protocol: randomElement(['TCP', 'UDP']) }
            };
            break;
        }
        case EventType.LOGIN_ATTEMPT: {
            const action = randomElement(['Success', 'Failure'] as const);
            newEvent = {
                ...baseEvent,
                eventType: EventType.LOGIN_ATTEMPT,
                action,
                riskLevel: action === 'Failure' ? RiskLevel.HIGH : RiskLevel.LOW,
                details: { username: randomElement(users), sourceIp: randomElement(remoteIPs) }
            };
            break;
        }
        default: {
            // Fallback for any unhandled type - should not happen
            newEvent = {
                ...baseEvent,
                eventType: EventType.PROCESS, // Default to a known type
                action: 'Started',
                riskLevel: RiskLevel.LOW,
                details: { processName: 'unknown.exe', processId: 0, commandLine: '', isSuspicious: false }
            } as ProcessEventLogItem;
        }
    }
    
    simulateAnomalyDetection(newEvent);
    return newEvent;
};