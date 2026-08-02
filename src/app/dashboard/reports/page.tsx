'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Download,
  FileJson,
  FileSpreadsheet,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Report {
  id: number;
  type: string;
  periodStart: string;
  periodEnd: string;
  fileUrl?: string;
  createdAt: string;
}

const reportTypes = [
  {
    id: 'daily',
    name: 'Daily Report',
    description: 'Summary of all device events for the past 24 hours',
    icon: Calendar,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'weekly',
    name: 'Weekly Report',
    description: 'Comprehensive analysis of weekly device activity',
    icon: BarChart3,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'monthly',
    name: 'Monthly Report',
    description: 'In-depth monthly device monitoring statistics',
    icon: PieChart,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'yearly',
    name: 'Yearly Report',
    description: 'Annual overview of all hardware monitoring data',
    icon: TrendingUp,
    color: 'from-amber-500 to-amber-600',
  },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{
    totalEvents: number;
    connected: number;
    disconnected: number;
    enabled: number;
    disabled: number;
    critical: number;
    warning: number;
    info: number;
  } | null>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setGeneratedReport(null);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock report data
    setGeneratedReport({
      totalEvents: Math.floor(Math.random() * 500) + 200,
      connected: Math.floor(Math.random() * 200) + 100,
      disconnected: Math.floor(Math.random() * 150) + 50,
      enabled: Math.floor(Math.random() * 100) + 50,
      disabled: Math.floor(Math.random() * 50) + 20,
      critical: Math.floor(Math.random() * 20) + 5,
      warning: Math.floor(Math.random() * 50) + 20,
      info: Math.floor(Math.random() * 300) + 150,
    });
    
    setIsGenerating(false);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulate export
    const filename = `report-${selectedType}-${dateRange.start}-${dateRange.end}.${format}`;
    alert(`Exporting ${filename}...`);
  };

  return (
    <ProtectedRoute title="Reports">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reports</h2>
          <p className="text-slate-500 mt-1">Generate and export detailed reports</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Report Type</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all
                      ${selectedType === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color}
                      flex items-center justify-center mb-3`}>
                      <type.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800">{type.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Date Range</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold
                rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>

            {/* Generated Report Preview */}
            {generatedReport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Report Preview</h3>
                  <span className="flex items-center gap-1 text-emerald-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Generated Successfully
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-800">{generatedReport.totalEvents}</p>
                    <p className="text-sm text-slate-500">Total Events</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-emerald-600">{generatedReport.connected}</p>
                    <p className="text-sm text-emerald-600">Connected</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-600">{generatedReport.disconnected}</p>
                    <p className="text-sm text-slate-500">Disconnected</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-red-600">{generatedReport.critical}</p>
                    <p className="text-sm text-red-600">Critical Alerts</p>
                  </div>
                </div>

                {/* Event Breakdown */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-medium text-slate-700 mb-3">Event Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Enabled Events</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(generatedReport.enabled / generatedReport.totalEvents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-12">{generatedReport.enabled}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Disabled Events</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${(generatedReport.disabled / generatedReport.totalEvents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-12">{generatedReport.disabled}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Warning Alerts</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${(generatedReport.warning / generatedReport.totalEvents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-12">{generatedReport.warning}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Info Events</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(generatedReport.info / generatedReport.totalEvents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-12">{generatedReport.info}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h4 className="font-medium text-slate-700 mb-3">Export As</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg
                        hover:bg-red-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg
                        hover:bg-emerald-700 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg
                        hover:bg-slate-700 transition-colors"
                    >
                      <FileJson className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Recent Reports */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {[
                  { name: 'Weekly Report', date: '2024-01-15', size: '2.4 MB' },
                  { name: 'Monthly Report', date: '2024-01-01', size: '8.1 MB' },
                  { name: 'Weekly Report', date: '2024-01-08', size: '2.3 MB' },
                  { name: 'Daily Report', date: '2024-01-18', size: '0.8 MB' },
                  { name: 'Daily Report', date: '2024-01-17', size: '0.9 MB' },
                ].map((report, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-700 text-sm truncate">{report.name}</p>
                      <p className="text-xs text-slate-500">{report.date} • {report.size}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4">Report Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-100">Total Reports</span>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">This Month</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Total Downloads</span>
                  <span className="font-bold">342</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
