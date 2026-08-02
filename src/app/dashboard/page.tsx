'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  HardDrive,
  Activity,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Keyboard,
  Mouse,
  Camera,
  Printer,
  HardDriveDownload,
  Bluetooth,
  Usb,
  MoreHorizontal
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatCard from '@/components/StatCard';
import { ChartCard, DeviceConnectionsChart, DeviceTypesChart, MonthlyEventsChart } from '@/components/Charts';

interface DashboardData {
  stats: {
    totalComputers: number;
    connectedDevices: number;
    activeDevices: number;
    offlineDevices: number;
    todayEvents: number;
    criticalAlerts: number;
  };
  deviceTypeDistribution: { name: string; value: number }[];
  monthlyEvents: { month: string; events: number }[];
  dailyConnections: { date: string; connected: number; disconnected: number }[];
  recentEvents: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'keyboard': return Keyboard;
      case 'mouse': return Mouse;
      case 'webcam': return Camera;
      case 'printer': return Printer;
      case 'external_hard_drive': return HardDriveDownload;
      case 'bluetooth': return Bluetooth;
      case 'usb_flash_drive': return Usb;
      default: return HardDrive;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'connected': return Wifi;
      case 'disconnected': return WifiOff;
      case 'enabled': return CheckCircle;
      case 'disabled': return XCircle;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'enabled':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Success</span>;
      case 'disconnected':
      case 'disabled':
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Inactive</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  return (
    <ProtectedRoute title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="xl:col-span-2">
            <StatCard
              title="Total Computers"
              value={data?.stats.totalComputers || 0}
              icon={Monitor}
              trend={{ value: 12, isPositive: true }}
              color="blue"
              isLoading={isLoading}
            />
          </div>
          <StatCard
            title="Connected Devices"
            value={data?.stats.connectedDevices || 0}
            icon={HardDrive}
            color="cyan"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Devices"
            value={data?.stats.activeDevices || 0}
            icon={Activity}
            color="emerald"
            isLoading={isLoading}
          />
          <StatCard
            title="Offline Devices"
            value={data?.stats.offlineDevices || 0}
            icon={WifiOff}
            color="amber"
            isLoading={isLoading}
          />
          <div className="xl:col-span-2">
            <StatCard
              title="Today's Events"
              value={data?.stats.todayEvents || 0}
              icon={Clock}
              trend={{ value: 8, isPositive: true }}
              color="blue"
              isLoading={isLoading}
            />
          </div>
          <StatCard
            title="Critical Alerts"
            value={data?.stats.criticalAlerts || 0}
            icon={AlertTriangle}
            color="red"
            isLoading={isLoading}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DeviceConnectionsChart data={data?.dailyConnections || []} />
          <DeviceTypesChart data={data?.deviceTypeDistribution || []} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="Monthly Events" subtitle="Device event trends over time">
              <div className="h-64">
                <MonthlyEventsChart data={data?.monthlyEvents || []} />
              </div>
            </ChartCard>
          </div>
          
          {/* Quick Stats */}
          <ChartCard title="Device Health" subtitle="Current status overview">
            <div className="space-y-4">
              {[
                { label: 'USB Flash Drives', value: 85, color: 'bg-blue-500' },
                { label: 'Keyboards', value: 92, color: 'bg-emerald-500' },
                { label: 'Mice', value: 89, color: 'bg-cyan-500' },
                { label: 'Webcams', value: 78, color: 'bg-amber-500' },
                { label: 'Printers', value: 95, color: 'bg-purple-500' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{stat.label}</span>
                    <span className="text-sm font-medium text-slate-800">{stat.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${stat.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Recent Events */}
        <ChartCard title="Recent Events" subtitle="Latest device activity">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Computer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Device</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Event</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="py-3 px-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                      <td className="py-3 px-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                      <td className="py-3 px-4"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></td>
                      <td className="py-3 px-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></td>
                      <td className="py-3 px-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : (
                  data?.recentEvents.slice(0, 8).map((event, index) => {
                    const DeviceIcon = getDeviceIcon(event.device?.type || 'other');
                    const EventIcon = getEventIcon(event.eventType);
                    
                    return (
                      <tr
                        key={event.id || index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-500">
                            {new Date(event.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">
                              {event.computer?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{event.device?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)}`} />
                            <EventIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600 capitalize">{event.eventType}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(event.eventType)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </ProtectedRoute>
  );
}
