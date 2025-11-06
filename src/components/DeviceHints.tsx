import { CheckCircle, TrendingUp, TrendingDown, Activity, Moon, Heart, Droplet, Gauge, Lightbulb, AlertCircle } from 'lucide-react';

export function ConnectionHint() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-3">
        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-blue-700 dark:text-blue-400">Connecting a device</strong> is a way to give the platform more precision.
            We don't just collect numbers, we explain their meaning and connect them with your state and habits.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OpeningHint() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <p className="text-gray-700 dark:text-gray-300">
        You can connect a watch, bracelet, ring, or medical sensor. After connecting, BioMath Core will
        automatically update data and use it in reports and recommendations.
      </p>
    </div>
  );
}

export function SuccessConnectionHint() {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong className="text-green-700 dark:text-green-400">Done.</strong> The next sync will happen automatically.
          You don't need to do anything manually.
        </p>
      </div>
    </div>
  );
}

export function FirstSyncSuccessHint() {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Metrics received ✅
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We'll track the trend, not just single values.
          </p>
        </div>
      </div>
    </div>
  );
}

export function WhyDevicesHint() {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Why This Matters
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Devices help notice changes early, before symptoms appear. It's like a navigator for your body:
            it suggests when you're overloaded, when recovery is happening, and what can be adjusted gently and timely.
          </p>
        </div>
      </div>
    </div>
  );
}

interface MetricScenarioProps {
  type: 'sleep_improved' | 'sleep_declined' | 'hrv_improved' | 'hrv_declined' | 'activity_high' | 'glucose_unstable' | 'blood_pressure_stable';
  icon?: typeof Moon;
}

export function MetricScenario({ type, icon: Icon }: MetricScenarioProps) {
  const scenarios = {
    sleep_declined: {
      icon: Moon,
      color: 'yellow',
      title: 'Sleep quality decreased',
      message: 'Recent sleep has been less deep. This may reflect nervous system overload. We will suggest gentle recovery steps.',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-400'
    },
    sleep_improved: {
      icon: Moon,
      color: 'green',
      title: 'Sleep improved',
      message: 'Sleep has become more stable - that is a good sign. Your body is recovering better.',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-400'
    },
    hrv_improved: {
      icon: Heart,
      color: 'green',
      title: 'HRV improving',
      message: 'Heart rate variability improved. This is a sign that the nervous system is recovering.',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-400'
    },
    hrv_declined: {
      icon: Heart,
      color: 'orange',
      title: 'HRV decreasing',
      message: 'It looks like the nervous system is working at high speed. Gentle recovery mode needed.',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-800 dark:text-orange-400'
    },
    activity_high: {
      icon: Activity,
      color: 'blue',
      title: 'Elevated load',
      message: 'Load is higher than usual - it is important to keep up with recovery.',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-800 dark:text-blue-400'
    },
    glucose_unstable: {
      icon: Droplet,
      color: 'purple',
      title: 'Glucose fluctuations',
      message: 'There are glucose fluctuations. We will help understand which foods or habits create them.',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-800 dark:text-purple-400'
    },
    blood_pressure_stable: {
      icon: Gauge,
      color: 'green',
      title: 'Blood pressure stable',
      message: 'If metrics are stable and normal - this is a good predictor of vascular comfort. If there is growth - we will explain safely without scaremongering.',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-400'
    }
  };

  const scenario = scenarios[type];
  const ScenarioIcon = Icon || scenario.icon;

  return (
    <div className={`${scenario.bgColor} rounded-lg p-4 border ${scenario.borderColor}`}>
      <div className="flex items-start space-x-3">
        <ScenarioIcon className={`h-5 w-5 ${scenario.iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`text-sm font-semibold mb-1 ${scenario.textColor}`}>
            {scenario.title}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {scenario.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AIAssistantTemplate() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        How AI Uses Device Data
      </h3>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            <strong className="text-purple-700 dark:text-purple-400">Query Template:</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "Based on your latest device data, we see a trend ____________.
            This is not a diagnosis, but an important signal. Would you like an explanation and recommendations?"
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            <strong className="text-purple-700 dark:text-purple-400">If user agrees:</strong>
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>"I will explain in two ways:</p>
            <ul className="ml-4 space-y-1">
              <li>1. Strict physiological analysis (Opinion A)</li>
              <li>2. Behavioral and lifestyle explanation (Opinion B)</li>
            </ul>
            <p>You can compare them and choose the suitable one."</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-purple-700 dark:text-purple-400">Second Opinion:</strong> A second opinion will help view
            your data from a different angle - physiological and adaptive. It is like consulting with two specialists
            with different thinking styles.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ErrorRecoveryHintProps {
  type: 'token_expired' | 'no_data' | 'service_error' | 'manual_disconnect' | 'bluetooth_sync';
}

export function ErrorRecoveryHint({ type }: ErrorRecoveryHintProps) {
  const hints = {
    token_expired: {
      icon: AlertCircle,
      color: 'red',
      title: 'Access expired',
      message: "Device access has expired. Click 'Refresh' so we can read metrics again.",
      action: 'Refresh Access',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    no_data: {
      icon: AlertCircle,
      color: 'yellow',
      title: 'No new data',
      message: 'The device did not send new data today. Perhaps it was not worn or was not synced. We will try again automatically.',
      action: null,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    service_error: {
      icon: AlertCircle,
      color: 'orange',
      title: 'Manufacturer unavailable',
      message: 'Manufacturer is temporarily unavailable. This is a common situation. We will try syncing later.',
      action: null,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    manual_disconnect: {
      icon: AlertCircle,
      color: 'gray',
      title: 'Device disconnected',
      message: 'The device is no longer sending data. You can reconnect it at any time.',
      action: 'Reconnect',
      bgColor: 'bg-gray-50 dark:bg-gray-900',
      borderColor: 'border-gray-200 dark:border-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400'
    },
    bluetooth_sync: {
      icon: AlertCircle,
      color: 'blue',
      title: 'Phone sync',
      message: 'The device may not have synced with the phone yet. Just open the manufacturer app - everything else will happen automatically.',
      action: null,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  };

  const hint = hints[type];
  const HintIcon = hint.icon;

  return (
    <div className={`${hint.bgColor} rounded-lg p-3 border ${hint.borderColor}`}>
      <div className="flex items-start space-x-3">
        <HintIcon className={`h-4 w-4 ${hint.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
            {hint.title}
          </h4>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
            {hint.message}
          </p>
          {hint.action && (
            <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              {hint.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'connected' | 'needs_update' | 'no_data' | 'disconnected';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statuses = {
    connected: {
      label: 'Connected',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
    },
    needs_update: {
      label: 'Update required',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
    },
    no_data: {
      label: 'No data',
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
    },
    disconnected: {
      label: 'Disconnected',
      color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
    }
  };

  const badge = statuses[status];

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badge.color}`}>
      {badge.label}
    </span>
  );
}
