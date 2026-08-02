'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Monitor,
  HardDrive,
  Wifi,
  Bell,
  Lock,
  BarChart3,
  Users,
  Globe,
  ChevronDown,
  ArrowRight,
  Check,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Zap,
  Eye,
  FileText,
  RefreshCw,
  Clock,
  AlertTriangle,
  Usb,
  Keyboard,
  Mouse,
  Camera,
  Printer
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Shield,
    title: 'Real-time Monitoring',
    description: 'Track all hardware devices connected to your network in real-time with instant notifications.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Lock,
    title: 'Security Alerts',
    description: 'Instant alerts for unauthorized devices, policy violations, and security threats.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics with detailed reports on device usage and trends.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Globe,
    title: 'Multi-location Support',
    description: 'Manage devices across multiple offices and locations from a single dashboard.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Role-based access control with granular permissions for team members.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: RefreshCw,
    title: 'Auto Sync',
    description: 'Automatic synchronization of device data across all connected endpoints.',
    color: 'from-amber-500 to-amber-600',
  },
];

const deviceTypes = [
  { icon: Usb, name: 'USB Flash Drives', count: '3,421' },
  { icon: Keyboard, name: 'Keyboards', count: '2,156' },
  { icon: Mouse, name: 'Mice & Pointers', count: '2,089' },
  { icon: Camera, name: 'Webcams', count: '892' },
  { icon: Printer, name: 'Printers', count: '445' },
  { icon: HardDrive, name: 'External Drives', count: '1,234' },
];

const stats = [
  { value: '100+', label: 'Computers Managed' },
  { value: '10K+', label: 'Devices Tracked' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
  { value: '24/7', label: 'Support Available' },
];

const faqs = [
  {
    question: 'How does DeviceGuard monitor devices?',
    answer: 'DeviceGuard uses a lightweight agent installed on each computer that detects hardware events in real-time and sends them to our central server for processing and monitoring.',
  },
  {
    question: 'What types of devices can be monitored?',
    answer: 'DeviceGuard can monitor USB flash drives, keyboards, mice, webcams, printers, external hard drives, Bluetooth devices, network adapters, and any plug-and-play devices.',
  },
  {
    question: 'Is the software secure?',
    answer: 'Yes, DeviceGuard uses enterprise-grade encryption for all data transmission and storage. We also support JWT authentication and role-based access control.',
  },
  {
    question: 'Can I generate reports?',
    answer: 'Absolutely! DeviceGuard provides comprehensive reporting with daily, weekly, monthly, and yearly options. Reports can be exported in PDF, Excel, and CSV formats.',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">DeviceGuard</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#devices" className="text-slate-600 hover:text-slate-900 transition-colors">Devices</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg
                  hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-4"
          >
            <a href="#features" className="block text-slate-600">Features</a>
            <a href="#how-it-works" className="block text-slate-600">How It Works</a>
            <a href="#devices" className="block text-slate-600">Devices</a>
            <a href="#faq" className="block text-slate-600">FAQ</a>
            <a href="#contact" className="block text-slate-600">Contact</a>
            <Link href="/login" className="block text-blue-600 font-medium">Sign In</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Enterprise Hardware Monitoring
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Protect Your
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Hardware Assets</span>
              </h1>
              
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Monitor, track, and secure all hardware devices across your organization in real-time.
                Get instant alerts and comprehensive analytics with DeviceGuard.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold
                    rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                    transition-all flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200
                    hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  Watch Demo
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-slate-800 font-semibold">Trusted by 500+</p>
                  <p className="text-slate-500 text-sm">Enterprise customers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <HardDrive className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">USB Drive Connected</p>
                      <p className="text-sm text-slate-500">NYC-F1-PC-042</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">Success</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Camera className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Camera Disabled</p>
                      <p className="text-sm text-slate-500">SFA-F2-PC-108</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">Warning</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Security Alert</p>
                      <p className="text-sm text-slate-500">CHI-F1-PC-023</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Critical</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">98%</p>
                    <p className="text-xs text-slate-500">Online Devices</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">24</p>
                    <p className="text-xs text-slate-500">Active Alerts</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Protect Your Assets</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive hardware monitoring solution designed for enterprise security teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-200
                  hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color}
                  flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Client Agent Logic */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              How DeviceGuard Works
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Simple setup, powerful protection. Get started in minutes.
            </p>
          </motion.div>

          {/* Complete Flow Diagram */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-12">
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Client Agent Architecture</h3>
            
            {/* Flow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Step 1: Client */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">Client PC</p>
                <p className="text-xs text-slate-500 mt-1">DeviceGuard Agent</p>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-blue-400" />
              </div>

              {/* Step 2: Detect */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">Detect Event</p>
                <p className="text-xs text-slate-500 mt-1">USB/Keyboard/Mouse</p>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-purple-400" />
              </div>

              {/* Step 3: API */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                  <RefreshCw className="w-10 h-10 text-white" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">REST API</p>
                <p className="text-xs text-slate-500 mt-1">Spring Boot</p>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-cyan-400" />
              </div>

              {/* Step 4: Database */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                  <HardDrive className="w-10 h-10 text-white" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">Database</p>
                <p className="text-xs text-slate-500 mt-1">PostgreSQL</p>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-amber-400" />
              </div>

              {/* Step 5: Dashboard */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">Dashboard</p>
                <p className="text-xs text-slate-500 mt-1">Real-time Update</p>
              </motion.div>
            </div>

            {/* Event Types */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h4 className="text-lg font-semibold text-slate-700 mb-6 text-center">Supported Hardware Events</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: Usb, label: 'USB Connected', color: 'bg-blue-100 text-blue-700' },
                  { icon: Usb, label: 'USB Removed', color: 'bg-amber-100 text-amber-700' },
                  { icon: Keyboard, label: 'Keyboard Event', color: 'bg-purple-100 text-purple-700' },
                  { icon: Mouse, label: 'Mouse Event', color: 'bg-cyan-100 text-cyan-700' },
                  { icon: Camera, label: 'Camera Event', color: 'bg-red-100 text-red-700' },
                  { icon: Printer, label: 'Printer Event', color: 'bg-emerald-100 text-emerald-700' },
                  { icon: HardDrive, label: 'Storage Event', color: 'bg-orange-100 text-orange-700' },
                  { icon: Wifi, label: 'Network Event', color: 'bg-indigo-100 text-indigo-700' },
                  { icon: Bell, label: 'Alert Triggered', color: 'bg-pink-100 text-pink-700' },
                  { icon: Shield, label: 'Security Event', color: 'bg-red-100 text-red-700' },
                ].map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${event.color}`}
                  >
                    <event.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{event.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                step: '01', 
                icon: Monitor, 
                title: 'Install Agent', 
                desc: 'Download and install the lightweight DeviceGuard agent on each computer. The agent runs silently in the background.',
                color: 'from-blue-500 to-blue-600'
              },
              { 
                step: '02', 
                icon: Eye, 
                title: 'Detect Events', 
                desc: 'The agent monitors all hardware connections using Windows API, detecting USB, keyboards, mice, webcams, and more.',
                color: 'from-purple-500 to-purple-600'
              },
              { 
                step: '03', 
                icon: RefreshCw, 
                title: 'Send Data', 
                desc: 'When an event occurs, the agent securely transmits data to the central server via encrypted HTTPS requests.',
                color: 'from-cyan-500 to-cyan-600'
              },
              { 
                step: '04', 
                icon: Bell, 
                title: 'Get Alerts', 
                desc: 'Receive instant notifications on your dashboard and via email/SMS for critical security events.',
                color: 'from-emerald-500 to-emerald-600'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-slate-200">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Types Section */}
      <section id="devices" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Monitor All Device Types
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive coverage for every hardware device in your organization.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {deviceTypes.map((device, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200
                  hover:shadow-lg transition-all text-center cursor-pointer group"
              >
                <div className="w-14 h-14 mx-auto bg-slate-100 rounded-xl flex items-center justify-center
                  group-hover:bg-blue-100 transition-colors mb-3">
                  <device.icon className="w-7 h-7 text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="font-medium text-slate-800 text-sm">{device.name}</p>
                <p className="text-xs text-slate-500 mt-1">{device.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Find answers to common questions about DeviceGuard.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-slate-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Ready to secure your organization? Contact us today for a personalized demo.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">contact@deviceguard.io</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">100 Security Ave, San Francisco, CA 94102</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
            >
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2
                        focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2
                        focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2
                      focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2
                      focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold
                    rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                    transition-all flex items-center justify-center gap-2"
                >
                  Send Message
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">DeviceGuard</span>
              </div>
              <p className="text-slate-400 text-sm">
                Enterprise hardware monitoring for modern security teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#devices" className="hover:text-white transition-colors">Supported Devices</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>© 2024 DeviceGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
