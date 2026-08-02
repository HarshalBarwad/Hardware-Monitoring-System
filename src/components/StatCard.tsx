'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'red';
  isLoading?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    icon: 'text-blue-600',
    ring: 'ring-blue-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500',
    light: 'bg-cyan-50',
    icon: 'text-cyan-600',
    ring: 'ring-cyan-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500',
    light: 'bg-emerald-50',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500',
    light: 'bg-amber-50',
    icon: 'text-amber-600',
    ring: 'ring-amber-500/20',
  },
  red: {
    bg: 'bg-red-500',
    light: 'bg-red-50',
    icon: 'text-red-600',
    ring: 'ring-red-500/20',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  isLoading = false,
  onClick,
}: StatCardProps) {
  const colors = colorClasses[color];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 cursor-pointer transition-shadow
        hover:shadow-lg ${onClick ? 'ring-2 ring-offset-2 ' + colors.ring : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value.toLocaleString()}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
              <span className="text-sm text-slate-400">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={`w-14 h-14 rounded-xl ${colors.light} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
