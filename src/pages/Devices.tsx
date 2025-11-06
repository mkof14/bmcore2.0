import { useState, useEffect } from 'react';
import { Watch, Activity, Droplet, Heart, Scale, Gauge, CheckCircle, AlertCircle, RefreshCw, Trash2, Info, Shield, TrendingUp, Zap, Clock, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { DeviceBrand, UserDevice } from '../types/database';
import DeviceEducation from '../components/DeviceEducation';
import { ConnectionHint, OpeningHint, SuccessConnectionHint, WhyDevicesHint, ErrorRecoveryHint } from '../components/DeviceHints';

interface DevicesProps {
  onNavigate: (page: string) => void;
}

export default function Devices({ onNavigate }: DevicesProps) {
  const [brands, setBrands] = useState<DeviceBrand[]>([]);
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<DeviceBrand | null>(null);
  const [step, setStep] = useState<'select' | 'explain' | 'authorize' | 'success'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  useEffect(() => {
    loadBrands();
    loadUserDevices();
  }, []);

  const loadBrands = async () => {
    const { data } = await supabase
      .from('device_brands')
      .select('*')
      .eq('active', true)
      .order('sort_order');

    if (data) setBrands(data);
  };

  const loadUserDevices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_devices')
      .select('*, brand:device_brands(*)')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false });

    if (data) setUserDevices(data as any);
  };

  const handleSelectBrand = (brand: DeviceBrand) => {
    setSelectedBrand(brand);
    setStep('explain');
  };

  const handleConnect = async () => {
    if (!selectedBrand) return;

    setIsLoading(true);

    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_devices')
        .insert({
          user_id: user.id,
          brand_id: selectedBrand.id,
          device_name: selectedBrand.name,
          status: 'connected',
          sync_frequency: 'daily',
          last_sync_at: new Date().toISOString(),
          last_sync_status: 'success'
        })
        .select()
        .single();

      if (data) {
        setStep('success');
        setIsLoading(false);
        setTimeout(() => {
          setStep('select');
          setSelectedBrand(null);
          loadUserDevices();
        }, 4000);
      }
    }, 2000);
  };

  const handleDisconnect = async (deviceId: string) => {
    await supabase
      .from('user_devices')
      .update({ status: 'disconnected' })
      .eq('id', deviceId);

    loadUserDevices();
  };

  const handleForceSync = async (deviceId: string) => {
    await supabase
      .from('user_devices')
      .update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: 'success',
        error_count: 0
      })
      .eq('id', deviceId);

    loadUserDevices();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smartwatch':
        return <Watch className="h-6 w-6" />;
      case 'fitness_tracker':
        return <Activity className="h-6 w-6" />;
      case 'smart_ring':
        return <Heart className="h-6 w-6" />;
      case 'cgm':
        return <Droplet className="h-6 w-6" />;
      case 'blood_pressure':
        return <Gauge className="h-6 w-6" />;
      case 'body_composition':
        return <Scale className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'error':
      case 'token_expired':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'disconnected':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getDeviceRecommendation = (useCase: string) => {
    const recommendations: Record<string, string> = {
      sleep: 'Oura Ring or WHOOP',
      activity: 'Apple Watch, Fitbit, or Samsung',
      glucose: 'Dexcom or FreeStyle Libre',
      blood_pressure: 'Omron',
      long_term: 'Rings and Wristbands',
      universal: 'Apple Watch'
    };
    return recommendations[useCase] || '';
  };

  if (step === 'explain' && selectedBrand) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                {getCategoryIcon(selectedBrand.category)}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedBrand.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Step 2 of 3 — Explanation
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How It Works
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    We only request access to health metrics. We don't see or store logins and passwords.
                    You can disconnect the device at any time.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    The app automatically collects data from your device
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    We interpret trends and suggest how to improve your health
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Data is used in reports and AI recommendations
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Privacy:</strong> You have full control over the connection.
                We don't know your device password and cannot control it. We only receive the health data
                you have authorized to share.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('authorize')}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setStep('select');
                  setSelectedBrand(null);
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'authorize' && selectedBrand) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Grant Access
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Step 3 of 3 — Authorization
              </p>
            </div>

            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Click "Grant Access" to allow the device to automatically transmit metrics.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sync Frequency Settings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Default: daily in the morning. You can change in settings:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left max-w-md mx-auto">
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Daily (recommended)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span>Multiple times per day</span>
                  </li>
                  {selectedBrand.supports_realtime && (
                    <li className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span>Real-time (available for your device)</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : 'Grant Access'}
              </button>
              <button
                onClick={() => setStep('explain')}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Device Connected!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              From now on, BioMath Core will update metrics and use them in recommendations and reports.
            </p>
          </div>

          <div className="space-y-4">
            <SuccessConnectionHint />
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                <strong>Tip:</strong> If you use the device regularly, the platform will be able to track not just what
                happened today, but your direction — whether your condition is improving, declining, or stable.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Devices
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Connect a device so BioMath Core can track your metrics and explain their meaning.
          </p>

          <div className="space-y-4">
            <ConnectionHint />
            {userDevices.length === 0 && <OpeningHint />}
            <WhyDevicesHint />
          </div>
        </div>

        {userDevices.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Connected Devices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDevices.map((device: any) => (
                <div key={device.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(device.brand?.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {device.device_name}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(device.status)}`}>
                          {device.status === 'connected' ? 'Connected' :
                           device.status === 'error' ? 'Action Required' :
                           device.status === 'token_expired' ? 'Access Expired' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {device.sync_frequency === 'daily' ? 'Daily' :
                         device.sync_frequency === 'hourly' ? 'Hourly' :
                         device.sync_frequency === 'realtime' ? 'Real-time' : 'Manual'}
                      </span>
                    </div>
                    {device.last_sync_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Sync:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(device.last_sync_at).toLocaleDateString('en-US')}
                        </span>
                      </div>
                    )}
                  </div>

                  {device.status === 'connected' && device.last_sync_status === 'success' && !device.last_sync_at && (
                    <div className="mb-4">
                      <ErrorRecoveryHint type="no_data" />
                    </div>
                  )}

                  {device.status === 'token_expired' && (
                    <div className="mb-4">
                      <ErrorRecoveryHint type="token_expired" />
                    </div>
                  )}

                  {device.status === 'error' && device.error_message && (
                    <div className="mb-4">
                      <ErrorRecoveryHint type="service_error" />
                    </div>
                  )}

                  {device.status === 'disconnected' && (
                    <div className="mb-4">
                      <ErrorRecoveryHint type="manual_disconnect" />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {device.status === 'connected' && (
                      <button
                        onClick={() => handleForceSync(device.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Sync Now</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDisconnect(device.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      title="Disconnect"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Connect Device
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEducation(!showEducation)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm font-medium"
              >
                <BookOpen className="h-4 w-4" />
                <span>{showEducation ? 'Hide Guide' : 'Learn More'}</span>
              </button>
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                <Info className="h-4 w-4" />
                <span>Help Choosing</span>
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose a manufacturer: Apple, Samsung, Google Fit, Fitbit, Oura, Whoop, Dexcom, Libre, Withings, Omron, or other.
          </p>
        </div>

        {showRecommendations && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Device Selection Recommendations
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you don't have a device yet, BioMath Core can help you choose:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Sleep</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getDeviceRecommendation('sleep')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Activity & Exercise</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getDeviceRecommendation('activity')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Glucose</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getDeviceRecommendation('glucose')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Blood Pressure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getDeviceRecommendation('blood_pressure')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Long-term Trends</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getDeviceRecommendation('long_term')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Maximum Versatility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getDeviceRecommendation('universal')}</p>
              </div>
            </div>
          </div>
        )}

        {showEducation && (
          <div className="mb-8">
            <DeviceEducation />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleSelectBrand(brand)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  {getCategoryIcon(brand.category)}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {brand.name}
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {brand.description_en}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {Object.entries(brand.capabilities).filter(([_, enabled]) => enabled).slice(0, 3).map(([capability]) => (
                  <span key={capability} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded">
                    {capability.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {brand.supports_realtime && (
                <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                  <Zap className="w-3 h-3" />
                  <span>Real-time</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How It Works
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                The app automatically collects data from your device (sleep, heart rate, stress, recovery, glucose, and other metrics)
                and explains their meaning in plain language. We don't just show numbers — we interpret trends and suggest
                how to improve your condition.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Privacy:</strong> You have full control over the connection. We don't know your device password
                and cannot control it. You can disconnect access at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
