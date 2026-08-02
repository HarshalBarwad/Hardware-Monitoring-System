'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  Filter,
  RefreshCw,
  Monitor,
  HardDrive
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Alert {
  id: number;
  type: string;
  severity: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  acknowledgedAt?: string;
  computer?: {
    id: number;
    name: string;
  };
  device?: {
    id: number;
    name: string;
    type: string;
  };
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical': return AlertTriangle;
    case 'warning': return AlertTriangle;
    default: return Info;
  }
};

const alertTypeLabels: Record<string, string> = {
  usb_connected: 'USB Connected',
  usb_removed: 'USB Removed',
  keyboard_disabled: 'Keyboard Disabled',
  mouse_disabled: 'Mouse Disabled',
  printer_connected: 'Printer Connected',
  bluetooth_connected: 'Bluetooth Connected',
  camera_disabled: 'Camera Disabled',
  security_alert: 'Security Alert',
  unauthorized_device: 'Unauthorized Device',
  device_failure: 'Device Failure',
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [pagination.page, severityFilter, statusFilter]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (severityFilter) params.append('severity', severityFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/alerts?${params}`);
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (id: number) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'acknowledge' }),
      });
      if (response.ok) {
        fetchAlerts();
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleDismiss = async (id: number) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'dismiss' }),
      });
      if (response.ok) {
        fetchAlerts();
      }
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read-all' }),
      });
      if (response.ok) {
        fetchAlerts();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <ProtectedRoute title="Alerts">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Security Alerts</h2>
            <p className="text-slate-500 mt-1">Real-time alerts and notifications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600
                hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Read
            </button>
            <button
              onClick={fetchAlerts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critical', value: alerts.filter(a => a.severity === 'critical' && a.status === 'unread').length, color: 'bg-red-500', textColor: 'text-red-600' },
            { label: 'Warning', value: alerts.filter(a => a.severity === 'warning' && a.status === 'unread').length, color: 'bg-amber-500', textColor: 'text-amber-600' },
            { label: 'Info', value: alerts.filter(a => a.severity === 'info' && a.status === 'unread').length, color: 'bg-blue-500', textColor: 'text-blue-600' },
            { label: 'Total Unread', value: alerts.filter(a => a.status === 'unread').length, color: 'bg-slate-500', textColor: 'text-slate-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color}/10 flex items-center justify-center`}>
                  <span className={`w-3 h-3 rounded-full ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className={`text-sm ${stat.textColor}`}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 flex flex-wrap gap-4">
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-slate-100 rounded" />
                    <div className="h-4 w-96 bg-slate-100 rounded" />
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : alerts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-100 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No alerts found</p>
            </div>
          ) : (
            alerts.map((alert, index) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              const isUnread = alert.status === 'unread';
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-white rounded-xl p-4 border transition-all
                    ${isUnread ? 'border-l-4 border-l-red-500 border-slate-100' : 'border-slate-100'}
                    hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${alert.severity === 'critical' ? 'bg-red-100' : 
                        alert.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                      <SeverityIcon className={`w-5 h-5 
                        ${alert.severity === 'critical' ? 'text-red-600' : 
                          alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${isUnread ? 'text-slate-800' : 'text-slate-700'}`}>
                              {alert.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                              ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 
                                alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 
                                'bg-blue-100 text-blue-700'}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{alert.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(alert.createdAt).toLocaleString()}
                            </span>
                            {alert.computer && (
                              <span className="flex items-center gap-1">
                                <Monitor className="w-3 h-3" />
                                {alert.computer.name}
                              </span>
                            )}
                            {alert.device && (
                              <span className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {alert.device.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isUnread ? (
                            <>
                              <button
                                onClick={() => handleAcknowledge(alert.id)}
                                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                title="Acknowledge"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDismiss(alert.id)}
                                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                title="Dismiss"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${alert.status === 'acknowledged' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {alert.status === 'acknowledged' ? 'Acknowledged' : 'Dismissed'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} alerts
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
      </motion.div>
    </ProtectedRoute>
  );
}
