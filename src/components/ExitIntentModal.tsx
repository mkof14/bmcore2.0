import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { supabase } from '../lib/supabase';

interface ExitIntentModalProps {
  onClose: () => void;
  variant?: 'discount' | 'feedback' | 'newsletter';
}

export default function ExitIntentModal({ onClose, variant = 'discount' }: ExitIntentModalProps) {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supabase.from('exit_intent_captures').insert({
        email,
        type: 'discount',
        captured_at: new Date().toISOString()
      });

      trackEvent('exit_intent_email_captured', { variant });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supabase.from('user_feedback').insert({
        feedback,
        type: 'exit_intent',
        submitted_at: new Date().toISOString()
      });

      trackEvent('exit_intent_feedback_submitted', { variant });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Check your email for your exclusive offer.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {variant === 'discount' && (
          <>
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Wait! Don't Leave Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Get <span className="text-orange-600 font-bold">20% OFF</span> your first month
            </p>
            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                         focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700
                         text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white
                         rounded-lg font-semibold flex items-center justify-center space-x-2
                         disabled:opacity-50"
              >
                <span>Claim My Discount</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </>
        )}

        {variant === 'feedback' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Before You Go...
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Help us improve! What made you leave?
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your feedback..."
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                         focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700
                         text-gray-900 dark:text-white resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white
                         rounded-lg font-semibold disabled:opacity-50"
              >
                Submit Feedback
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

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
