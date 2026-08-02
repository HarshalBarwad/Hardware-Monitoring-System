import { db } from '@/db';
import { users, computers, devices, deviceEvents, alerts, settings } from '@/db/schema';
import { hash } from 'crypto';

// Helper to generate random element from array
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random IP address
function randomIP(): string {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Generate random MAC address
function randomMAC(): string {
  const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`.toUpperCase();
}

// Generate random serial number
function randomSerial(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Simple password hash (in production, use bcrypt)
function simpleHash(password: string): string {
  return Buffer.from(password).toString('base64');
}

// Device vendors
const vendors: Record<string, string[]> = {
  usb_flash_drive: ['SanDisk', 'Samsung', 'Kingston', 'Lexar', 'PNY'],
  keyboard: ['Logitech', 'Microsoft', 'Corsair', 'Razer', 'SteelSeries'],
  mouse: ['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'Microsoft'],
  webcam: ['Logitech', 'Microsoft', 'Razer', 'Elgato', 'AverMedia'],
  printer: ['HP', 'Canon', 'Epson', 'Brother', 'Xerox'],
  external_hard_drive: ['Western Digital', 'Seagate', 'Samsung', 'Toshiba', 'LaCie'],
  bluetooth: ['Bluetooth Adapter', 'Apple', 'Samsung', 'Sony', 'JBL'],
  usb_cable: ['Anker', 'Belkin', 'Apple', 'Samsung', 'Amazon Basics'],
  network_adapter: ['TP-Link', 'D-Link', 'Netgear', 'Intel', 'ASUS'],
  other: ['Generic', 'Unknown', 'Various'],
};

// Location names
const locations = [
  'New York Office - Floor 1', 'New York Office - Floor 2', 'New York Office - Floor 3',
  'Los Angeles Branch', 'Chicago Office', 'Houston Office',
  'Phoenix Office', 'Philadelphia Office', 'San Antonio Office',
  'San Diego Office', 'Dallas Office', 'San Jose Office',
  'Austin Office', 'Jacksonville Office', 'Fort Worth Office',
  'Columbus Office', 'Charlotte Office', 'San Francisco Office',
  'Indianapolis Office', 'Seattle Office', 'Denver Office',
  'Remote - Home Office', 'Remote - Co-working Space'
];

// Operating systems
const operatingSystems = [
  'Windows 11 Pro', 'Windows 11 Enterprise', 'Windows 10 Pro',
  'Windows 10 Enterprise', 'macOS Sonoma', 'macOS Ventura',
  'Ubuntu 22.04 LTS', 'Ubuntu 20.04 LTS', 'Debian 12'
];

// Department names
const departments = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources',
  'Finance', 'Legal', 'Operations', 'IT Support',
  'Research & Development', 'Customer Success'
];

// User names
const userNames = [
  'James Wilson', 'Emma Thompson', 'Michael Chen', 'Sarah Johnson',
  'David Kim', 'Emily Davis', 'Robert Martinez', 'Jessica Brown',
  'William Taylor', 'Amanda White', 'Christopher Lee', 'Michelle Garcia'
];

export async function seedDatabase() {
  console.log('Starting database seed...');

  // Clear existing data
  await db.delete(alerts);
  await db.delete(deviceEvents);
  await db.delete(devices);
  await db.delete(computers);
  await db.delete(users);

  // Create users
  const userData = [
    { email: 'admin@deviceguard.io', passwordHash: simpleHash('admin123'), name: 'James Wilson', role: 'admin' as const, department: 'IT Security', phone: '+1 (555) 100-0001' },
    { email: 'manager@deviceguard.io', passwordHash: simpleHash('manager123'), name: 'Emma Thompson', role: 'manager' as const, department: 'Operations', phone: '+1 (555) 100-0002' },
    { email: 'analyst@deviceguard.io', passwordHash: simpleHash('analyst123'), name: 'Michael Chen', role: 'viewer' as const, department: 'IT Security', phone: '+1 (555) 100-0003' },
    { email: 'sarah.johnson@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'Sarah Johnson', role: 'manager' as const, department: 'Engineering', phone: '+1 (555) 100-0004' },
    { email: 'david.kim@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'David Kim', role: 'viewer' as const, department: 'Finance', phone: '+1 (555) 100-0005' },
    { email: 'emily.davis@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'Emily Davis', role: 'viewer' as const, department: 'Marketing', phone: '+1 (555) 100-0006' },
    { email: 'robert.martinez@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'Robert Martinez', role: 'viewer' as const, department: 'Sales', phone: '+1 (555) 100-0007' },
    { email: 'jessica.brown@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'Jessica Brown', role: 'viewer' as const, department: 'HR', phone: '+1 (555) 100-0008' },
    { email: 'william.taylor@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'William Taylor', role: 'viewer' as const, department: 'Legal', phone: '+1 (555) 100-0009' },
    { email: 'amanda.white@deviceguard.io', passwordHash: simpleHash('pass123'), name: 'Amanda White', role: 'viewer' as const, department: 'Operations', phone: '+1 (555) 100-0010' },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();
  console.log(`Created ${insertedUsers.length} users`);

  // Create computers
  const computerData = [];
  const officePrefixes = ['NYC', 'LA', 'CHI', 'HOU', 'PHX', 'PHL', 'SFA', 'SEA', 'DEN', 'ATL'];
  const buildingFloors = ['F1', 'F2', 'F3', 'F4', 'F5'];

  for (let i = 1; i <= 100; i++) {
    const prefix = randomFrom(officePrefixes);
    const floor = randomFrom(buildingFloors);
    const status = Math.random() > 0.15 ? (Math.random() > 0.3 ? 'online' : 'offline') : 'offline';
    
    computerData.push({
      name: `${prefix}-${floor}-PC-${String(i).padStart(3, '0')}`,
      username: randomFrom(userNames).toLowerCase().replace(' ', '.'),
      ipAddress: randomIP(),
      macAddress: randomMAC(),
      operatingSystem: randomFrom(operatingSystems),
      status: status as 'online' | 'offline',
      lastOnline: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  const insertedComputers = await db.insert(computers).values(computerData).returning();
  console.log(`Created ${insertedComputers.length} computers`);

  // Create devices (average 3 per computer)
  const deviceData = [];
  const deviceTypes: Array<'usb_flash_drive' | 'keyboard' | 'mouse' | 'webcam' | 'printer' | 'external_hard_drive' | 'bluetooth' | 'usb_cable' | 'network_adapter' | 'other'> = [
    'usb_flash_drive', 'keyboard', 'mouse', 'webcam', 'printer', 
    'external_hard_drive', 'bluetooth', 'usb_cable', 'network_adapter', 'other'
  ];

  const deviceNames: Record<string, string[]> = {
    usb_flash_drive: ['DataTraveler', 'Ultra Fit', 'Extreme Pro', 'Secure Access', 'Flash Drive'],
    keyboard: ['K380 Multi-Device', 'MX Keys', 'Pro X Keyboard', 'Spartan ULTRA', 'Elite Gaming'],
    mouse: ['MX Master 3', 'G502 Hero', 'DeathAdder Elite', 'Sculpt Ergonomic', 'Precision Pro'],
    webcam: ['C920s Pro HD', 'Brio 4K', 'Kiyo Pro', 'FaceCam Elite', 'Stream Cam'],
    printer: ['LaserJet Pro', 'PIXMA G6020', 'EcoTank ET-4760', 'WorkForce Pro', 'OfficeJet Pro'],
    external_hard_drive: ['My Passport', 'Expansion Desktop', 'Backup Plus', 'Elements Portable', 'WD Black P10'],
    bluetooth: ['BT 5.0 Adapter', 'XM4 Headphones', 'WH-1000XM5', 'Galaxy Buds', 'Surface Earbuds'],
    usb_cable: ['USB-C to USB-C', 'Lightning Cable', 'USB-A to USB-C', 'Micro-USB', 'Charging Cable'],
    network_adapter: ['AX200 WiFi 6', 'AC1300 USB', 'Gigabit Ethernet', 'WiFi 6E Adapter', 'Ethernet Adapter'],
    other: ['USB Hub', 'Card Reader', 'Docking Station', 'Monitor Adapter', 'Audio Interface'],
  };

  for (const computer of insertedComputers) {
    const numDevices = Math.floor(Math.random() * 4) + 2; // 2-5 devices per computer
    const usedTypes = new Set<string>();

    for (let i = 0; i < numDevices; i++) {
      let deviceType = randomFrom(deviceTypes);
      while (usedTypes.has(deviceType) && usedTypes.size < deviceTypes.length) {
        deviceType = randomFrom(deviceTypes);
      }
      usedTypes.add(deviceType);

      const vendor = randomFrom(vendors[deviceType]);
      const deviceName = `${vendor} ${randomFrom(deviceNames[deviceType])}`;
      const status = Math.random() > 0.1 ? 'active' : 'inactive';

      deviceData.push({
        name: deviceName,
        type: deviceType,
        computerId: computer.id,
        serialNumber: randomSerial(deviceType.substring(0, 3).toUpperCase()),
        vendor,
        status: status as 'active' | 'inactive',
        lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      });
    }
  }

  const insertedDevices = await db.insert(devices).values(deviceData).returning();
  console.log(`Created ${insertedDevices.length} devices`);

  // Create device events (1000 events over past 30 days)
  const eventData = [];
  const eventTypes: Array<'connected' | 'disconnected' | 'enabled' | 'disabled'> = ['connected', 'disconnected', 'enabled', 'disabled'];
  const severities: Array<'critical' | 'warning' | 'info'> = ['critical', 'warning', 'info'];

  for (let i = 0; i < 1000; i++) {
    const device = randomFrom(insertedDevices);
    const eventType = randomFrom(eventTypes);
    const computer = insertedComputers.find(c => c.id === device.computerId)!;
    const user = randomFrom(insertedUsers);
    
    // Determine severity based on event type and device type
    let severity: 'critical' | 'warning' | 'info' = 'info';
    if (eventType === 'disconnected' && ['webcam', 'usb_flash_drive'].includes(device.type)) {
      severity = Math.random() > 0.5 ? 'warning' : 'critical';
    } else if (eventType === 'disabled') {
      severity = 'warning';
    }

    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    eventData.push({
      deviceId: device.id,
      computerId: computer.id,
      userId: user.id,
      eventType,
      severity,
      location: randomFrom(locations),
      ipAddress: computer.ipAddress,
      details: `${EVENT_DETAILS[eventType as keyof typeof EVENT_DETAILS]} - ${device.name}`,
      timestamp,
    });
  }

  const insertedEvents = await db.insert(deviceEvents).values(eventData).returning();
  console.log(`Created ${insertedEvents.length} device events`);

  // Create alerts (50 alerts)
  const alertTypes = [
    { type: 'usb_connected', title: 'USB Device Connected', severity: 'info' as const },
    { type: 'usb_removed', title: 'USB Device Removed', severity: 'warning' as const },
    { type: 'keyboard_disabled', title: 'Keyboard Disabled', severity: 'warning' as const },
    { type: 'mouse_disabled', title: 'Mouse Disabled', severity: 'warning' as const },
    { type: 'printer_connected', title: 'Printer Connected', severity: 'info' as const },
    { type: 'bluetooth_connected', title: 'Bluetooth Device Connected', severity: 'info' as const },
    { type: 'camera_disabled', title: 'Camera Disabled', severity: 'critical' as const },
    { type: 'security_alert', title: 'Critical Security Alert', severity: 'critical' as const },
    { type: 'unauthorized_device', title: 'Unauthorized Device Detected', severity: 'critical' as const },
    { type: 'device_failure', title: 'Device Failure Detected', severity: 'warning' as const },
  ];

  const alertData = [];
  const alertStatuses: Array<'unread' | 'acknowledged' | 'dismissed'> = ['unread', 'acknowledged', 'dismissed'];

  for (let i = 0; i < 50; i++) {
    const alertType = randomFrom(alertTypes);
    const computer = randomFrom(insertedComputers);
    const device = insertedDevices.find(d => d.computerId === computer.id);
    const status = randomFrom(alertStatuses);

    alertData.push({
      type: alertType.type,
      severity: alertType.severity,
      title: alertType.title,
      description: generateAlertDescription(alertType.type, computer.name, device?.name),
      status,
      computerId: computer.id,
      deviceId: device?.id,
      userId: randomFrom(insertedUsers).id,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      acknowledgedAt: status !== 'unread' ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : null,
    });
  }

  const insertedAlerts = await db.insert(alerts).values(alertData).returning();
  console.log(`Created ${insertedAlerts.length} alerts`);

  // Create settings
  await db.insert(settings).values({
    organizationName: 'DeviceGuard Corporation',
    theme: 'light',
    emailAlerts: true,
    smsAlerts: false,
    language: 'en',
  }).onConflictDoNothing();

  console.log('Database seeding completed successfully!');
}

function generateAlertDescription(type: string, computerName: string, deviceName?: string): string {
  const descriptions: Record<string, string[]> = {
    usb_connected: [
      `A new USB device was connected to ${computerName}`,
      `External USB storage detected on ${computerName}`,
      `Unknown USB device connected to ${computerName}`,
    ],
    usb_removed: [
      `USB device was safely removed from ${computerName}`,
      `External storage disconnected from ${computerName}`,
      `USB device removal detected on ${computerName}`,
    ],
    keyboard_disabled: [
      `External keyboard was disabled on ${computerName}`,
      `Unauthorized keyboard input detected on ${computerName}`,
      `Keyboard device was disconnected on ${computerName}`,
    ],
    mouse_disabled: [
      `Mouse device was disabled on ${computerName}`,
      `External mouse disconnected from ${computerName}`,
      `Mouse input device removed from ${computerName}`,
    ],
    printer_connected: [
      `Printer device connected to ${computerName}`,
      `New printer detected on ${computerName}`,
      `Printing device attached to ${computerName}`,
    ],
    bluetooth_connected: [
      `Bluetooth device paired with ${computerName}`,
      `Wireless Bluetooth connection established on ${computerName}`,
      `New Bluetooth device detected on ${computerName}`,
    ],
    camera_disabled: [
      `SECURITY: Camera disabled on ${computerName}`,
      `WARNING: Webcam was disconnected on ${computerName}`,
      `CRITICAL: Camera access disabled on ${computerName}`,
    ],
    security_alert: [
      `SECURITY ALERT: Unauthorized hardware access attempt on ${computerName}`,
      `CRITICAL: Suspicious device activity detected on ${computerName}`,
      `SECURITY: Hardware policy violation on ${computerName}`,
    ],
    unauthorized_device: [
      `Unauthorized device detected on ${computerName}`,
      `Unknown hardware device blocked on ${computerName}`,
      `Unrecognized device prevented on ${computerName}`,
    ],
    device_failure: [
      `Device failure detected on ${computerName}`,
      `Hardware malfunction reported on ${computerName}`,
      `Device error detected on ${computerName}`,
    ],
  };

  return randomFrom(descriptions[type] || [`Event on ${computerName}`]);
}

const EVENT_DETAILS = {
  connected: 'Device connected successfully',
  disconnected: 'Device disconnected',
  enabled: 'Device was enabled',
  disabled: 'Device was disabled',
};

seedDatabase().catch(console.error);
