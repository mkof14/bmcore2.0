import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formRateLimiter } from '../lib/rateLimiter';
import { FormValidator } from '../lib/formValidation';
import { trackEvent } from '../lib/analytics';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validator = new FormValidator({
    email: { required: true, email: true }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validator.validate({ email });
    if (!validation.isValid) {
      setStatus('error');
      setMessage(validation.errors.email || 'Please enter a valid email address');
      return;
    }

    if (!formRateLimiter.isAllowed(email)) {
      setStatus('error');
      setMessage('Too many requests. Please try again later.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source: variant,
          status: 'active',
          subscribed_at: new Date().toISOString()
        });

      if (error) {
        if (error.code === '23505') {
          setStatus('error');
          setMessage('This email is already subscribed to our newsletter.');
        } else {
          throw error;
        }
        return;
      }

      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');

      trackEvent('newsletter_signup', {
        variant,
        email: email.toLowerCase().trim()
      });

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const variants = {
    inline: 'max-w-md mx-auto',
    modal: 'w-full',
    footer: 'max-w-sm'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {variant === 'inline' && (
        <div className="text-center mb-6">
          <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get the latest health insights, tips, and updates delivered to your inbox.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                   rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-2"
        >
          {status === 'loading' ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>Subscribing...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Subscribed!</span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span>Subscribe to Newsletter</span>
            </>
          )}
        </button>

        {message && (
          <div
            className={`flex items-start space-x-2 p-3 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
