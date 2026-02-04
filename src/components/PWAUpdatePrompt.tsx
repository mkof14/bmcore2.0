import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface PWAUpdatePromptProps {
  onUpdate: () => void;
}

export default function PWAUpdatePrompt({ onUpdate }: PWAUpdatePromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleControllerChange = () => {
      setShow(true);
    };

    navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5 duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Update Available
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              A new version of BioMath Core is ready to install.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onUpdate();
                  setShow(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
