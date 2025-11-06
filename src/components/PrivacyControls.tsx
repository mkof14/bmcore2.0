import { useState } from 'react';
import { Shield, Download, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { exportUserData, downloadDataAsJSON, deleteUserData, anonymizeUserData } from '../lib/gdprDataExport';
import LoadingSpinner, { LoadingButton } from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface PrivacyControlsProps {
  userId: string;
  onDataDeleted?: () => void;
}

export default function PrivacyControls({ userId, onDataDeleted }: PrivacyControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAnonymizeConfirm, setShowAnonymizeConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await exportUserData(userId);
      downloadDataAsJSON(data);
      setSuccess('Your data has been exported successfully!');
    } catch (err) {
      setError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteUserData(userId);
      setSuccess('Your data has been deleted successfully.');
      if (onDataDeleted) {
        setTimeout(() => onDataDeleted(), 2000);
      }
    } catch (err) {
      setError('Failed to delete data. Please contact support.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAnonymizeData = async () => {
    setIsAnonymizing(true);
    setError(null);
    setSuccess(null);

    try {
      await anonymizeUserData(userId);
      setSuccess('Your personal data has been anonymized.');
    } catch (err) {
      setError('Failed to anonymize data. Please contact support.');
    } finally {
      setIsAnonymizing(false);
      setShowAnonymizeConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-3 mb-6">
          <Shield className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Privacy & Data Controls
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your personal data in compliance with GDPR and other privacy regulations.
            </p>
          </div>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
            className="mb-4"
          />
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Export Your Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download a complete copy of your personal data in JSON format.
                  </p>
                </div>
              </div>
              <LoadingButton
                loading={isExporting}
                onClick={handleExportData}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Export Data
              </LoadingButton>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Anonymize Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remove personally identifiable information while keeping your health data for research.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnonymizeConfirm(true)}
                disabled={isAnonymizing}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Anonymize
              </button>
            </div>
          </div>

          <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                    Delete All Data
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAnonymizeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Anonymize Your Data?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will remove all personally identifiable information from your account. Your health data will be kept for research purposes but cannot be linked back to you.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAnonymizeConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <LoadingButton
                loading={isAnonymizing}
                onClick={handleAnonymizeData}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
              >
                Anonymize
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Delete All Data?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  This will permanently delete your account and all associated data, including:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                  <li>Profile information</li>
                  <li>Health data and reports</li>
                  <li>Device readings</li>
                  <li>Goals and habits</li>
                  <li>Subscription history</li>
                </ul>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-3">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <LoadingButton
                loading={isDeleting}
                onClick={handleDeleteData}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete Forever
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
