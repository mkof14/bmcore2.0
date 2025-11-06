import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Database, Mail, Lock, Globe, Bell, Palette, Zap, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SystemSettings {
  site_name: string;
  site_description: string;
  admin_email: string;
  support_email: string;
  enable_registrations: boolean;
  require_email_verification: boolean;
  enable_social_login: boolean;
  maintenance_mode: boolean;
  max_upload_size_mb: number;
  session_timeout_minutes: number;
  enable_notifications: boolean;
  enable_analytics: boolean;
  default_locale: string;
  default_timezone: string;
  theme_mode: 'light' | 'dark' | 'auto';
}

export default function EnhancedSettingsSection() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: 'BioMath Core',
    site_description: 'Advanced Health Analytics Platform',
    admin_email: 'admin@biomathcore.com',
    support_email: 'support@biomathcore.com',
    enable_registrations: true,
    require_email_verification: true,
    enable_social_login: false,
    maintenance_mode: false,
    max_upload_size_mb: 10,
    session_timeout_minutes: 60,
    enable_notifications: true,
    enable_analytics: true,
    default_locale: 'en-US',
    default_timezone: 'UTC',
    theme_mode: 'dark',
  });

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'email' | 'features' | 'advanced'>('general');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dbStats, setDbStats] = useState({ tables: 0, size: '0 MB', connections: 0 });

  useEffect(() => {
    loadSettings();
    loadDbStats();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadDbStats = async () => {
    try {
      const { data: tables } = await supabase
        .from('information_schema.tables')
        .select('table_name', { count: 'exact', head: true })
        .eq('table_schema', 'public');

      setDbStats(prev => ({ ...prev, tables: tables?.length || 0 }));
    } catch (error) {
      console.error('Error loading db stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const { data: existing } = await supabase
        .from('system_settings')
        .select('id')
        .maybeSingle();

      const settingsData = {
        settings: settings,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await supabase
          .from('system_settings')
          .update(settingsData)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('system_settings')
          .insert([settingsData]);

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to default values?')) return;
    window.location.reload();
  };

  const testEmailConnection = async () => {
    alert('Email test would be sent (feature coming soon)');
  };

  const clearCache = async () => {
    if (confirm('Clear all application cache?')) {
      localStorage.clear();
      sessionStorage.clear();
      alert('Cache cleared! Page will reload.');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="h-7 w-7 text-purple-400" />
          System Settings
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto border-b border-gray-700/50">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Site Description</label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Default Locale</label>
                <select
                  value={settings.default_locale}
                  onChange={(e) => setSettings({ ...settings, default_locale: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Default Timezone</label>
                <select
                  value={settings.default_timezone}
                  onChange={(e) => setSettings({ ...settings, default_timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Theme Mode</label>
              <div className="flex gap-4">
                {['light', 'dark', 'auto'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={mode}
                      checked={settings.theme_mode === mode}
                      onChange={(e) => setSettings({ ...settings, theme_mode: e.target.value as any })}
                      className="h-4 w-4 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-white capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Enable User Registrations</h4>
                <p className="text-sm text-gray-400">Allow new users to create accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_registrations}
                  onChange={(e) => setSettings({ ...settings, enable_registrations: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Require Email Verification</h4>
                <p className="text-sm text-gray-400">Users must verify their email to access the platform</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.require_email_verification}
                  onChange={(e) => setSettings({ ...settings, require_email_verification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Enable Social Login</h4>
                <p className="text-sm text-gray-400">Allow login with Google, Facebook, etc.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_social_login}
                  onChange={(e) => setSettings({ ...settings, enable_social_login: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.session_timeout_minutes}
                onChange={(e) => setSettings({ ...settings, session_timeout_minutes: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="15"
                max="1440"
              />
              <p className="text-sm text-gray-500 mt-1">Users will be logged out after this period of inactivity</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.max_upload_size_mb}
                onChange={(e) => setSettings({ ...settings, max_upload_size_mb: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                max="100"
              />
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={settings.admin_email}
                  onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Support Email</label>
                <input
                  type="email"
                  value={settings.support_email}
                  onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Enable Email Notifications</h4>
                <p className="text-sm text-gray-400">Send system notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_notifications}
                  onChange={(e) => setSettings({ ...settings, enable_notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <button
                onClick={testEmailConnection}
                className="px-4 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Test Email Connection
              </button>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Enable Analytics</h4>
                <p className="text-sm text-gray-400">Track user behavior and system usage</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_analytics}
                  onChange={(e) => setSettings({ ...settings, enable_analytics: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Maintenance Mode
                </h4>
                <p className="text-sm text-gray-400">Disable public access for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                Database Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Tables</p>
                  <p className="text-2xl font-bold text-white">{dbStats.tables}</p>
                </div>
                <div>
                  <p className="text-gray-400">Size</p>
                  <p className="text-2xl font-bold text-white">{dbStats.size}</p>
                </div>
                <div>
                  <p className="text-gray-400">Connections</p>
                  <p className="text-2xl font-bold text-white">{dbStats.connections}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-white mb-3">System Actions</h4>

              <button
                onClick={clearCache}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Clear Application Cache
                </span>
                <span className="text-xs text-gray-500">Requires reload</span>
              </button>

              <button
                onClick={() => alert('Database backup feature coming soon')}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Backup Database
                </span>
                <span className="text-xs text-gray-500">Coming soon</span>
              </button>

              <button
                onClick={() => alert('System logs viewer coming soon')}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  View System Logs
                </span>
                <span className="text-xs text-gray-500">Coming soon</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
