import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    // Service Worker disabled per Phase 1 requirements
    // Uncomment to enable: registerServiceWorker();
    return;
  }, [state.isSupported]);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setState((prev) => ({
        ...prev,
        isRegistered: true,
        registration,
      }));

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setState((prev) => ({
                ...prev,
                isUpdateAvailable: true,
              }));
            }
          });
        }
      });

      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return;
      }
      console.error('Service Worker registration failed:', error);
    }
  }

  function updateServiceWorker() {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      window.location.reload();
    }
  }

  return {
    ...state,
    updateServiceWorker,
  };
}
