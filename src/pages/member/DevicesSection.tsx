import { useState, useEffect } from 'react';
import { Watch, Plus, Trash2, RefreshCw, Check, X, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Device {
  id: string;
  device_type: string;
  device_name: string;
  status: string;
  last_sync: string | null;
  sync_frequency: string;
  connected_at: string;
}

const DEVICE_TYPES = [
  { id: 'apple_watch', name: 'Apple Watch', icon: '⌚' },
  { id: 'fitbit', name: 'Fitbit', icon: '📊' },
  { id: 'oura', name: 'Oura Ring', icon: '💍' },
  { id: 'whoop', name: 'WHOOP', icon: '⚡' },
  { id: 'garmin', name: 'Garmin', icon: '🏃' },
  { id: 'cgm', name: 'CGM (Dexcom/Libre)', icon: '🩸' },
];

export default function DevicesSection() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('device_connections')
        .select('*')
        .eq('user_id', user.user.id)
        .order('connected_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (deviceType: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const deviceInfo = DEVICE_TYPES.find(d => d.id === deviceType);
      if (!deviceInfo) return;

      const { error } = await supabase
        .from('device_connections')
        .insert({
          user_id: user.user.id,
          device_type: deviceType,
          device_name: deviceInfo.name,
          status: 'connected',
          sync_frequency: 'daily',
        });

      if (error) throw error;
      setShowConnectModal(false);
      loadDevices();
    } catch (error) {
      console.error('Error connecting device:', error);
      alert('Failed to connect device');
    }
  };

  const handleSync = async (id: string) => {
    try {
      const { error } = await supabase
        .from('device_connections')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      loadDevices();
    } catch (error) {
      console.error('Error syncing device:', error);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Disconnect this device?')) return;

    try {
      const { error } = await supabase
        .from('device_connections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadDevices();
    } catch (error) {
      console.error('Error disconnecting device:', error);
      alert('Failed to disconnect device');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Watch className="h-8 w-8 text-orange-500" />
          Connected Devices
        </h1>
        <p className="text-gray-400">
          Connect your wearables and health sensors for automatic data synchronization
        </p>
      </div>

      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-900 border border-blue-600/30 rounded-xl p-4">
          <Activity className="h-6 w-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{devices.filter(d => d.status === 'connected').length}</p>
          <p className="text-xs text-gray-400">Active Devices</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-gray-900 border border-green-600/30 rounded-xl p-4">
          <RefreshCw className="h-6 w-6 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">{devices.filter(d => d.last_sync).length}</p>
          <p className="text-xs text-gray-400">Recently Synced</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-gray-900 border border-orange-600/30 rounded-xl p-4">
          <Watch className="h-6 w-6 text-orange-400 mb-2" />
          <p className="text-2xl font-bold text-white">{DEVICE_TYPES.length}</p>
          <p className="text-xs text-gray-400">Supported Devices</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Your Devices</h3>
        <button
          onClick={() => setShowConnectModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Connect Device
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="text-center py-12">
          <Watch className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No devices connected</p>
          <p className="text-sm text-gray-500">Connect your wearable devices to start tracking health data automatically</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {DEVICE_TYPES.find(d => d.id === device.device_type)?.icon || '📱'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{device.device_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {device.status === 'connected' ? (
                        <span className="px-2 py-0.5 bg-green-900/30 border border-green-600/30 text-green-400 text-xs rounded-full flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Connected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-900/30 border border-red-600/30 text-red-400 text-xs rounded-full flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Disconnected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Sync:</span>
                  <span className="text-gray-300">
                    {device.last_sync ? new Date(device.last_sync).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frequency:</span>
                  <span className="text-gray-300">{device.sync_frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Connected:</span>
                  <span className="text-gray-300">{new Date(device.connected_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSync(device.id)}
                  className="flex-1 px-4 py-2 bg-blue-900/30 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync Now
                </button>
                <button
                  onClick={() => handleDisconnect(device.id)}
                  className="px-4 py-2 bg-red-900/30 border border-red-600/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                  title="Disconnect"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Connect Device</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {DEVICE_TYPES.map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleConnect(device.id)}
                  className="p-6 bg-gray-800/50 border border-gray-700/30 rounded-xl hover:bg-gray-800 hover:border-orange-500/30 transition-all text-left"
                >
                  <div className="text-4xl mb-3">{device.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{device.name}</h3>
                  <p className="text-sm text-gray-400">Click to connect</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowConnectModal(false)}
              className="w-full mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
