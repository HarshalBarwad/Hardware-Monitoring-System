import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'viewer']);
export const deviceTypeEnum = pgEnum('device_type', [
  'usb_flash_drive', 'keyboard', 'mouse', 'webcam', 'printer', 
  'external_hard_drive', 'bluetooth', 'usb_cable', 'network_adapter', 'other'
]);
export const eventTypeEnum = pgEnum('event_type', [
  'connected', 'disconnected', 'enabled', 'disabled'
]);
export const severityEnum = pgEnum('severity', ['critical', 'warning', 'info']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'offline', 'online']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('viewer'),
  avatar: varchar('avatar', { length: 500 }),
  phone: varchar('phone', { length: 50 }),
  department: varchar('department', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Computers table
export const computers = pgTable('computers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  macAddress: varchar('mac_address', { length: 17 }).notNull(),
  operatingSystem: varchar('operating_system', { length: 100 }).notNull(),
  status: statusEnum('status').default('offline'),
  lastOnline: timestamp('last_online').defaultNow(),
  organizationId: integer('organization_id').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Devices table
export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: deviceTypeEnum('type').notNull(),
  computerId: integer('computer_id').references(() => computers.id).notNull(),
  serialNumber: varchar('serial_number', { length: 255 }),
  vendor: varchar('vendor', { length: 255 }),
  status: statusEnum('status').default('active'),
  lastSeen: timestamp('last_seen').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Device Events table
export const deviceEvents = pgTable('device_events', {
  id: serial('id').primaryKey(),
  deviceId: integer('device_id').references(() => devices.id).notNull(),
  computerId: integer('computer_id').references(() => computers.id).notNull(),
  userId: integer('user_id').references(() => users.id),
  eventType: eventTypeEnum('event_type').notNull(),
  severity: severityEnum('severity').default('info'),
  location: varchar('location', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Alerts table
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 100 }).notNull(),
  severity: severityEnum('severity').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('unread'),
  computerId: integer('computer_id').references(() => computers.id),
  deviceId: integer('device_id').references(() => devices.id),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  acknowledgedAt: timestamp('acknowledged_at'),
});

// Settings table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  organizationName: varchar('organization_name', { length: 255 }).default('DeviceGuard Inc.'),
  logoUrl: varchar('logo_url', { length: 500 }),
  theme: varchar('theme', { length: 50 }).default('light'),
  emailAlerts: boolean('email_alerts').default(true),
  smsAlerts: boolean('sms_alerts').default(false),
  language: varchar('language', { length: 10 }).default('en'),
});

// Reports table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  generatedBy: integer('generated_by').references(() => users.id),
  fileUrl: varchar('file_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  events: many(deviceEvents),
  alerts: many(alerts),
}));

export const computersRelations = relations(computers, ({ many }) => ({
  devices: many(devices),
  events: many(deviceEvents),
  alerts: many(alerts),
}));

export const devicesRelations = relations(devices, ({ one, many }) => ({
  computer: one(computers, {
    fields: [devices.computerId],
    references: [computers.id],
  }),
  events: many(deviceEvents),
  alerts: many(alerts),
}));

export const deviceEventsRelations = relations(deviceEvents, ({ one }) => ({
  device: one(devices, {
    fields: [deviceEvents.deviceId],
    references: [devices.id],
  }),
  computer: one(computers, {
    fields: [deviceEvents.computerId],
    references: [computers.id],
  }),
  user: one(users, {
    fields: [deviceEvents.userId],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  computer: one(computers, {
    fields: [alerts.computerId],
    references: [computers.id],
  }),
  device: one(devices, {
    fields: [alerts.deviceId],
    references: [devices.id],
  }),
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
}));
