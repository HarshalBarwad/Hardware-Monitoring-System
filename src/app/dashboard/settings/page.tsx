'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  User,
  Upload,
  Save,
  Check
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('organization');
  const [settings, setSettings] = useState({
    organizationName: 'DeviceGuard Corporation',
    emailAlerts: true,
    smsAlerts: false,
    theme: 'light',
    language: 'en',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <ProtectedRoute title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Settings</h2>
            <p className="text-slate-500 mt-1">Manage your organization settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
              ${saved 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-600 border-l-2 border-l-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50 border-l-2 border-l-transparent'}`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              {/* Organization Settings */}
              {activeTab === 'organization' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Organization Settings</h3>
                    <p className="text-sm text-slate-500 mt-1">Configure your organization details</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={settings.organizationName}
                        onChange={(e) => setSettings(prev => ({ ...prev, organizationName: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Organization Logo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center
                          border-2 border-dashed border-slate-300">
                          <Building className="w-8 h-8 text-slate-400" />
                        </div>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600
                          hover:bg-slate-50 transition-colors flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Logo
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Notification Settings</h3>
                    <p className="text-sm text-slate-500 mt-1">Choose how you want to receive alerts</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-800">Email Alerts</p>
                          <p className="text-sm text-slate-500">Receive alerts via email</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, emailAlerts: !prev.emailAlerts }))}
                        className={`w-12 h-6 rounded-full transition-colors relative
                          ${settings.emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
                          ${settings.emailAlerts ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-800">SMS Alerts</p>
                          <p className="text-sm text-slate-500">Receive critical alerts via SMS</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, smsAlerts: !prev.smsAlerts }))}
                        className={`w-12 h-6 rounded-full transition-colors relative
                          ${settings.smsAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
                          ${settings.smsAlerts ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Appearance</h3>
                    <p className="text-sm text-slate-500 mt-1">Customize the look of your dashboard</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3
                            ${settings.theme === 'light' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <Sun className="w-6 h-6 text-amber-500" />
                          <div className="text-left">
                            <p className="font-medium text-slate-800">Light</p>
                            <p className="text-xs text-slate-500">Light mode</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3
                            ${settings.theme === 'dark' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <Moon className="w-6 h-6 text-slate-600" />
                          <div className="text-left">
                            <p className="font-medium text-slate-800">Dark</p>
                            <p className="text-xs text-slate-500">Dark mode</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Security Settings</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage your password and security options</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg
                      hover:bg-slate-200 transition-colors font-medium">
                      Change Password
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Profile Settings</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage your personal information</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400
                      flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg
                        hover:bg-slate-200 transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Change Photo
                      </button>
                      <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || 'Admin User'}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || 'admin@deviceguard.io'}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 100-0001"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                      <input
                        type="text"
                        defaultValue="IT Security"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
