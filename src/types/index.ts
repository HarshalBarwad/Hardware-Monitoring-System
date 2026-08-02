export type UserRole = 'admin' | 'manager' | 'viewer';
export type DeviceType = 'usb_flash_drive' | 'keyboard' | 'mouse' | 'webcam' | 'printer' | 
  'external_hard_drive' | 'bluetooth' | 'usb_cable' | 'network_adapter' | 'other';
export type EventType = 'connected' | 'disconnected' | 'enabled' | 'disabled';
export type Severity = 'critical' | 'warning' | 'info';
export type Status = 'active' | 'inactive' | 'offline' | 'online';
export type AlertStatus = 'unread' | 'acknowledged' | 'dismissed';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: Date;
}

export interface Computer {
  id: number;
  name: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  operatingSystem: string;
  status: Status;
  lastOnline: Date;
  createdAt: Date;
}

export interface Device {
  id: number;
  name: string;
  type: DeviceType;
  computerId: number;
  computer?: Computer;
  serialNumber?: string;
  vendor?: string;
  status: Status;
  lastSeen: Date;
  createdAt: Date;
}

export interface DeviceEvent {
  id: number;
  deviceId: number;
  device?: Device;
  computerId: number;
  computer?: Computer;
  userId?: number;
  user?: User;
  eventType: EventType;
  severity: Severity;
  location?: string;
  ipAddress?: string;
  details?: string;
  timestamp: Date;
}

export interface Alert {
  id: number;
  type: string;
  severity: Severity;
  title: string;
  description?: string;
  status: AlertStatus;
  computerId?: number;
  computer?: Computer;
  deviceId?: number;
  device?: Device;
  userId?: number;
  createdAt: Date;
  acknowledgedAt?: Date;
}

export interface Settings {
  id: number;
  organizationName: string;
  logoUrl?: string;
  theme: 'light' | 'dark';
  emailAlerts: boolean;
  smsAlerts: boolean;
  language: string;
}

export interface Report {
  id: number;
  type: string;
  periodStart: Date;
  periodEnd: Date;
  generatedBy?: number;
  fileUrl?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalComputers: number;
  connectedDevices: number;
  activeDevices: number;
  offlineDevices: number;
  todayEvents: number;
  criticalAlerts: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface DeviceConnectionsData {
  date: string;
  connected: number;
  disconnected: number;
}

export interface MonthlyEventsData {
  month: string;
  events: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  usb_flash_drive: 'USB Flash Drive',
  keyboard: 'Keyboard',
  mouse: 'Mouse',
  webcam: 'Webcam',
  printer: 'Printer',
  external_hard_drive: 'External Hard Drive',
  bluetooth: 'Bluetooth Device',
  usb_cable: 'USB Cable',
  network_adapter: 'Network Adapter',
  other: 'Other',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  enabled: 'Enabled',
  disabled: 'Disabled',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

export const STATUS_COLORS: Record<Status, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-slate-400',
  offline: 'bg-slate-400',
  online: 'bg-emerald-500',
};
