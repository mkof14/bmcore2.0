import { useState, useEffect } from 'react';
import { trackEvent } from '../lib/analytics';

export function useExitIntent(delay = 1000): boolean {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('exit_intent_shown');
    if (hasShown) return;

    let timeout: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        timeout = setTimeout(() => {
          setShowModal(true);
          sessionStorage.setItem('exit_intent_shown', 'true');
          trackEvent('exit_intent_triggered');
        }, delay);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeout) clearTimeout(timeout);
    };
  }, [delay]);

  return showModal;
}
