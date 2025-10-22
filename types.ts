
export enum UserRole {
    ADMINISTRATOR = 'Administrator',
    ANALYST = 'Security Analyst',
    AUDITOR = 'Auditor',
}

export enum Permission {
    VIEW_DATA = 'view:data',
    TAKE_ACTIONS = 'take:actions',
    DISABLE_USB = 'action:disable-usb',
    MANAGE_SETTINGS = 'manage:settings',
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
}

export enum RiskLevel {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical',
}

export enum EventType {
    FILE_SYSTEM = 'File System',
    PROCESS = 'Process',
    USB = 'USB',
    NETWORK = 'Network',
    LOGIN_ATTEMPT = 'Login Attempt',
    ADMIN = 'Admin Action',
    AUDIT = 'Audit',
}

export enum EndpointStatus {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
    QUARANTINED = 'Quarantined',
}

export interface ConnectionDetails {
    protocol: 'TLSv1.3' | 'TLSv1.2';
    authMethod: 'Token' | 'mTLS';
    status: 'Secure' | 'Compromised' | 'Unavailable';
}

export interface Endpoint {
    id: string;
    hostname: string;
    user: string;
    ip: string;
    status: EndpointStatus;
    os: 'Windows' | 'Linux';
    agentVersion: string;
    cpuUsage: number;
    connection: ConnectionDetails;
    queuedEvents: number;
}

// --- EventLogItem Discriminated Union ---

interface BaseEventLogItem {
    id: string;
    timestamp: Date;
    endpointId: string;
    riskLevel: RiskLevel;
    anomalyScore?: number;
    riskReason?: string;
}

export enum FileEventAction {
    CREATED = 'Created',
    MODIFIED = 'Modified',
    DELETED = 'Deleted',
    ACCESSED = 'Accessed',
    RENAMED = 'Renamed',
}

export interface FileSystemEventLogItem extends BaseEventLogItem {
    eventType: EventType.FILE_SYSTEM;
    action: FileEventAction;
    details: {
        path: string;
        processName: string;
        processId: number;
        isSensitive: boolean;
    };
}

export interface ProcessEventLogItem extends BaseEventLogItem {
    eventType: EventType.PROCESS;
    action: 'Started' | 'Terminated';
    details: {
        processName: string;
        processId: number;
        commandLine: string;
        isSuspicious: boolean;
    };
}

export interface UsbEventLogItem extends BaseEventLogItem {
    eventType: EventType.USB;
    action: 'Connected' | 'Disconnected';
    details: {
        deviceName: string;
        serialNumber: string;
        isUntrusted: boolean;
    };
}

export interface NetworkEventLogItem extends BaseEventLogItem {
    eventType: EventType.NETWORK;
    action: 'Connection Attempt' | 'Connection Established';
    details: {
        destinationIp: string;
        destinationPort: number;
        protocol: 'TCP' | 'UDP';
    };
}

export interface LoginAttemptEventLogItem extends BaseEventLogItem {
    eventType: EventType.LOGIN_ATTEMPT;
    action: 'Success' | 'Failure';
    details: {
        username: string;
        sourceIp: string;
    };
}

export interface GenericEventLogItem extends BaseEventLogItem {
    eventType: EventType.ADMIN;
    description: string;
}

export interface AuditEventLogItem extends BaseEventLogItem {
    eventType: EventType.AUDIT;
    description: string;
}

export type EventLogItem = 
    | FileSystemEventLogItem
    | ProcessEventLogItem
    | UsbEventLogItem
    | NetworkEventLogItem
    | LoginAttemptEventLogItem
    | GenericEventLogItem
    | AuditEventLogItem;


export interface FilterState {
    risk: RiskLevel[];
    type: EventType[];
    status: EndpointStatus[];
    timeRange: string;
}

export interface SettingsState {
    dataRetentionPeriod: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  description: string;
}
