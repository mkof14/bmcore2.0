import { ArrowRight, Sparkles, Shield, Zap, Users } from 'lucide-react';

interface CTASectionProps {
  variant?: 'primary' | 'secondary' | 'gradient' | 'minimal';
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showStats?: boolean;
}

export default function CTASection({
  variant = 'primary',
  title,
  description,
  primaryButtonText = 'Get Started Free',
  secondaryButtonText = 'Learn More',
  onPrimaryClick,
  onSecondaryClick,
  showStats = false,
}: CTASectionProps) {
  const variants = {
    primary: {
      bg: 'bg-blue-600 dark:bg-blue-700',
      text: 'text-white',
      button: 'bg-white text-blue-600 hover:bg-gray-100',
      buttonSecondary: 'bg-blue-700 text-white hover:bg-blue-800 border border-white/20',
    },
    secondary: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-900 dark:text-white',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      buttonSecondary: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600',
    },
    gradient: {
      bg: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600',
      text: 'text-white',
      button: 'bg-white text-blue-600 hover:bg-gray-100',
      buttonSecondary: 'bg-transparent text-white hover:bg-white/10 border border-white',
    },
    minimal: {
      bg: 'bg-white dark:bg-gray-950',
      text: 'text-gray-900 dark:text-white',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      buttonSecondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
    },
  };

  const currentVariant = variants[variant];

  const defaultTitle =
    variant === 'gradient'
      ? 'Transform Your Health Journey Today'
      : 'Ready to Take Control of Your Health?';

  const defaultDescription =
    variant === 'gradient'
      ? 'Join thousands of users who have discovered personalized health insights with AI'
      : 'Get started with BioMath Core in minutes. No credit card required.';

  return (
    <div className={`py-16 ${currentVariant.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className={`text-3xl md:text-4xl font-bold ${currentVariant.text} mb-4`}>
            {title || defaultTitle}
          </h2>
          <p className={`text-lg md:text-xl ${currentVariant.text} opacity-90 mb-8 max-w-3xl mx-auto`}>
            {description || defaultDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={onPrimaryClick}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${currentVariant.button}`}
            >
              {primaryButtonText}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onSecondaryClick}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${currentVariant.buttonSecondary}`}
            >
              {secondaryButtonText}
            </button>
          </div>

          {showStats && (
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
              <div className={`flex items-center gap-2 ${currentVariant.text} opacity-80`}>
                <Users className="h-5 w-5" />
                <span className="text-sm">12,000+ Active Users</span>
              </div>
              <div className={`flex items-center gap-2 ${currentVariant.text} opacity-80`}>
                <Zap className="h-5 w-5" />
                <span className="text-sm">98.5% Success Rate</span>
              </div>
              <div className={`flex items-center gap-2 ${currentVariant.text} opacity-80`}>
                <Shield className="h-5 w-5" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CTABanner({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <p className="font-semibold">
              Limited Time: Get 30 days free trial on Premium plans!
            </p>
          </div>
          <button
            onClick={() => onNavigate('pricing')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Claim Offer
          </button>
        </div>
      </div>
    </div>
  );
}

export function CTAFloating({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-white/20 rounded-lg p-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Start Your Journey</h3>
            <p className="text-sm text-blue-100">
              Join thousands transforming their health
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('signup')}
          className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Get Started Free
        </button>
        <p className="text-xs text-blue-100 text-center mt-2">
          No credit card required
        </p>
      </div>
    </div>
  );
}

export function CTAInline({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 p-6 rounded-r-lg">
      <div className="flex items-start gap-4">
        <div className="bg-blue-600 dark:bg-blue-500 rounded-lg p-2">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Create your free account and start analyzing your health data today.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up Free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
