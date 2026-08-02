'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HardDrive,
  Monitor,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Keyboard,
  Mouse,
  Camera,
  Printer,
  HardDriveDownload,
  Bluetooth,
  Usb,
  Wifi,
  Server
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DataTable from '@/components/DataTable';
import { DEVICE_TYPE_LABELS } from '@/types';

interface Device {
  id: number;
  name: string;
  type: string;
  computerId: number;
  serialNumber?: string;
  vendor?: string;
  status: string;
  lastSeen: string;
  computer?: {
    id: number;
    name: string;
    ipAddress: string;
    operatingSystem: string;
    status: string;
  };
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'keyboard': return Keyboard;
    case 'mouse': return Mouse;
    case 'webcam': return Camera;
    case 'printer': return Printer;
    case 'external_hard_drive': return HardDriveDownload;
    case 'bluetooth': return Bluetooth;
    case 'usb_flash_drive': return Usb;
    case 'network_adapter': return Wifi;
    default: return HardDrive;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
    case 'online':
      return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
      </span>;
    case 'inactive':
    case 'offline':
      return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Inactive
      </span>;
    default:
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDevices();
  }, [pagination.page, search, typeFilter, statusFilter]);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/devices?${params}`);
      const data = await response.json();
      if (data.success) {
        setDevices(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Device Name',
      sortable: true,
      render: (device: Device) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            {(() => {
              const Icon = getDeviceIcon(device.type);
              return <Icon className="w-5 h-5 text-blue-600" />;
            })()}
          </div>
          <div>
            <p className="font-medium text-slate-800">{device.name}</p>
            <p className="text-xs text-slate-500">{DEVICE_TYPE_LABELS[device.type as keyof typeof DEVICE_TYPE_LABELS] || device.type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'computer',
      label: 'Computer',
      sortable: true,
      render: (device: Device) => (
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700">{device.computer?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true,
      render: (device: Device) => (
        <span className="text-slate-600">{device.vendor || 'Unknown'}</span>
      ),
    },
    {
      key: 'serialNumber',
      label: 'Serial Number',
      render: (device: Device) => (
        <span className="font-mono text-xs text-slate-500">{device.serialNumber || 'N/A'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (device: Device) => getStatusBadge(device.status),
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      sortable: true,
      render: (device: Device) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {new Date(device.lastSeen).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
  ];

  const typeOptions = [
    { label: 'USB Flash Drive', value: 'usb_flash_drive' },
    { label: 'Keyboard', value: 'keyboard' },
    { label: 'Mouse', value: 'mouse' },
    { label: 'Webcam', value: 'webcam' },
    { label: 'Printer', value: 'printer' },
    { label: 'External Hard Drive', value: 'external_hard_drive' },
    { label: 'Bluetooth', value: 'bluetooth' },
    { label: 'Network Adapter', value: 'network_adapter' },
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <ProtectedRoute title="Device Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Device Management</h2>
            <p className="text-slate-500 mt-1">Monitor and manage all connected hardware devices</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchDevices()}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600
                hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Server className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search devices, vendors, serial numbers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {typeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={devices}
          keyExtractor={(device) => device.id}
          isLoading={isLoading}
          pagination={{
            ...pagination,
            onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          }}
          emptyState={{
            title: 'No devices found',
            description: 'Try adjusting your search or filter criteria',
            action: {
              label: 'Clear Filters',
              onClick: () => {
                setSearch('');
                setTypeFilter('');
                setStatusFilter('');
              },
            },
          }}
        />
      </motion.div>
    </ProtectedRoute>
  );
}
