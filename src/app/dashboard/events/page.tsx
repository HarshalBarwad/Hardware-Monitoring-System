'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Monitor,
  User,
  Calendar,
  Filter,
  Download,
  Printer,
  Search,
  X,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Keyboard,
  Mouse,
  Camera,
  Printer as PrinterIcon,
  HardDrive,
  Bluetooth,
  Usb
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SEVERITY_COLORS, DEVICE_TYPE_LABELS, EVENT_TYPE_LABELS } from '@/types';

interface Event {
  id: number;
  eventType: string;
  severity: string;
  location?: string;
  ipAddress?: string;
  details?: string;
  timestamp: string;
  device?: {
    id: number;
    name: string;
    type: string;
    serialNumber?: string;
    vendor?: string;
  };
  computer?: {
    id: number;
    name: string;
    operatingSystem?: string;
  };
  user?: {
    id: number;
    name: string;
    email?: string;
  };
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'connected': return Wifi;
    case 'disconnected': return WifiOff;
    case 'enabled': return CheckCircle;
    case 'disabled': return XCircle;
    default: return Activity;
  }
};

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'keyboard': return Keyboard;
    case 'mouse': return Mouse;
    case 'webcam': return Camera;
    case 'printer': return PrinterIcon;
    case 'external_hard_drive': return HardDrive;
    case 'bluetooth': return Bluetooth;
    case 'usb_flash_drive': return Usb;
    default: return HardDrive;
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical': return AlertTriangle;
    case 'warning': return AlertTriangle;
    default: return Info;
  }
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, search, severityFilter, eventTypeFilter, dateFrom, dateTo]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.append('search', search);
      if (severityFilter) params.append('severity', severityFilter);
      if (eventTypeFilter) params.append('eventType', eventTypeFilter);
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);

      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Date', 'Time', 'Computer', 'User', 'Device', 'Type', 'Serial Number', 'Vendor', 'Event', 'Severity', 'IP Address', 'Location'];
    const rows = events.map(e => [
      new Date(e.timestamp).toLocaleDateString(),
      new Date(e.timestamp).toLocaleTimeString(),
      e.computer?.name || 'N/A',
      e.user?.name || 'N/A',
      e.device?.name || 'N/A',
      EVENT_TYPE_LABELS[e.eventType as keyof typeof EVENT_TYPE_LABELS] || e.eventType,
      e.device?.serialNumber || 'N/A',
      e.device?.vendor || 'N/A',
      e.eventType,
      e.severity,
      e.ipAddress || 'N/A',
      e.location || 'N/A',
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute title="Event Logs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Event Logs</h2>
            <p className="text-slate-500 mt-1">Complete history of device events and activities</p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, devices, computers..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Severity</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            <select
              value={eventTypeFilter}
              onChange={(e) => {
                setEventTypeFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Events</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">From:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">To:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            {(search || severityFilter || eventTypeFilter || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSeverityFilter('');
                  setEventTypeFilter('');
                  setDateFrom('');
                  setDateTo('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Computer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Device</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Event</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Severity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="py-3 px-4">
                          <div className="h-5 w-full max-w-[120px] bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No events found</p>
                      <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  events.map((event, index) => {
                    const EventIcon = getEventIcon(event.eventType);
                    const DeviceIcon = getDeviceIcon(event.device?.type || 'other');
                    const SeverityIcon = getSeverityIcon(event.severity);
                    
                    return (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-slate-700">
                              {new Date(event.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-slate-500">
                              {new Date(event.timestamp).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">{event.computer?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{event.device?.name || 'Unknown'}</p>
                              <p className="text-xs text-slate-500">{DEVICE_TYPE_LABELS[event.device?.type as keyof typeof DEVICE_TYPE_LABELS] || event.device?.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <EventIcon className={`w-4 h-4 ${event.eventType === 'connected' ? 'text-emerald-500' : event.eventType === 'disconnected' ? 'text-slate-400' : 'text-blue-500'}`} />
                            <span className="text-sm text-slate-600 capitalize">{EVENT_TYPE_LABELS[event.eventType as keyof typeof EVENT_TYPE_LABELS] || event.eventType}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                            ${event.severity === 'critical' ? 'bg-red-100 text-red-700' : 
                              event.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 
                              'bg-blue-100 text-blue-700'}`}>
                            <SeverityIcon className="w-3 h-3" />
                            {event.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-500">{event.location || 'N/A'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-slate-500">{event.ipAddress || 'N/A'}</span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600
                    hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm font-medium text-slate-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600
                    hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedEvent(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg
                bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Date & Time</p>
                    <p className="font-medium text-slate-800">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Event Type</p>
                    <p className="font-medium text-slate-800 capitalize">
                      {EVENT_TYPE_LABELS[selectedEvent.eventType as keyof typeof EVENT_TYPE_LABELS] || selectedEvent.eventType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Severity</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mt-1
                      ${selectedEvent.severity === 'critical' ? 'bg-red-100 text-red-700' : 
                        selectedEvent.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 
                        'bg-blue-100 text-blue-700'}`}>
                      {selectedEvent.severity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium text-slate-800">{selectedEvent.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Computer</p>
                    <p className="font-medium text-slate-800">{selectedEvent.computer?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">IP Address</p>
                    <p className="font-mono text-sm text-slate-800">{selectedEvent.ipAddress || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-500">Device</p>
                    <p className="font-medium text-slate-800">{selectedEvent.device?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-500">
                      {DEVICE_TYPE_LABELS[selectedEvent.device?.type as keyof typeof DEVICE_TYPE_LABELS] || selectedEvent.device?.type}
                      {selectedEvent.device?.serialNumber && ` • S/N: ${selectedEvent.device.serialNumber}`}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-500">User</p>
                    <p className="font-medium text-slate-800">{selectedEvent.user?.name || 'System'}</p>
                  </div>
                  {selectedEvent.details && (
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500">Details</p>
                      <p className="text-slate-700">{selectedEvent.details}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </ProtectedRoute>
  );
}
