'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  User,
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  Search,
  X,
  Server,
  Eye
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Computer {
  id: number;
  name: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  operatingSystem: string;
  status: string;
  lastOnline: string;
  createdAt: string;
}

export default function ComputersPage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchComputers();
  }, [pagination.page, search, statusFilter]);

  const fetchComputers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/computers?${params}`);
      const data = await response.json();
      if (data.success) {
        setComputers(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch computers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute title="Computer Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Computer Management</h2>
            <p className="text-slate-500 mt-1">View and manage all registered computers</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchComputers()}
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search computers, IPs, usernames..."
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Computers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-100 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-32 bg-slate-100 rounded" />
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                    <div className="h-4 w-40 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : computers.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <Monitor className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No computers found</p>
            </div>
          ) : (
            computers.map((computer, index) => (
              <motion.div
                key={computer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-slate-100 hover:border-blue-200
                  hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                    ${computer.status === 'online' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    <Monitor className={`w-6 h-6 ${computer.status === 'online' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800 truncate">{computer.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${computer.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {computer.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {computer.username}
                      </p>
                      <p className="text-sm text-slate-500 font-mono">{computer.ipAddress}</p>
                      <p className="text-xs text-slate-400 truncate">{computer.operatingSystem}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        Last online: {new Date(computer.lastOnline).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} computers
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
