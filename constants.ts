import { RiskLevel, FilterState, EventType, EndpointStatus, UserRole, Permission, User, SettingsState } from './types';

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Admin User', role: UserRole.ADMINISTRATOR },
    { id: 'user-2', name: 'Analyst User', role: UserRole.ANALYST },
    { id: 'user-3', name: 'Auditor User', role: UserRole.AUDITOR },
];

export const PERMISSIONS_MAP: { [key in UserRole]: Permission[] } = {
    [UserRole.ADMINISTRATOR]: [
        Permission.VIEW_DATA,
        Permission.TAKE_ACTIONS,
        Permission.DISABLE_USB,
        Permission.MANAGE_SETTINGS,
    ],
    [UserRole.ANALYST]: [
        Permission.VIEW_DATA,
        Permission.TAKE_ACTIONS,
    ],
    [UserRole.AUDITOR]: [
        Permission.VIEW_DATA,
    ],
};

export const RISK_COLORS: { [key in RiskLevel]: string } = {
    [RiskLevel.LOW]: 'bg-blue-500',
    [RiskLevel.MEDIUM]: 'bg-yellow-500',
    [RiskLevel.HIGH]: 'bg-orange-500',
    [RiskLevel.CRITICAL]: 'bg-red-600',
};

export const RISK_TEXT_COLORS: { [key in RiskLevel]: string } = {
    [RiskLevel.LOW]: 'text-blue-300',
    [RiskLevel.MEDIUM]: 'text-yellow-300',
    [RiskLevel.HIGH]: 'text-orange-300',
    [RiskLevel.CRITICAL]: 'text-red-300',
};

export const TIME_RANGE_OPTIONS = [
    { value: '15m', label: 'Last 15 Minutes' },
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: 'all', label: 'All Time' },
];

export const DATA_RETENTION_OPTIONS = [
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'indefinite', label: 'Indefinite' },
];

export const DEFAULT_FILTERS: FilterState = {
    risk: [],
    type: [],
    status: [],
    timeRange: 'all',
};

export const DEFAULT_SETTINGS: SettingsState = {
    dataRetentionPeriod: '90d',
};

export const SENSITIVE_FILE_PATHS = ['/etc/shadow', 'C:\\Users\\admin\\secrets.txt', 'company_secrets.xlsx'];
export const SUSPICIOUS_PROCESS_NAMES = ['ncat.exe', 'mimikatz.exe', 'powershell.exe -enc'];
export const UNTRUSTED_USB_SERIALS = ['UNTRUSTED-SN-001', 'UNTRUSTED-SN-002', 'VID:04F2-PID:B217'];

export const ALL_RISK_LEVELS = Object.values(RiskLevel);
export const ALL_EVENT_TYPES = Object.values(EventType).filter(e => e !== EventType.ADMIN && e !== EventType.AUDIT);
export const ALL_ENDPOINT_STATUSES = Object.values(EndpointStatus);