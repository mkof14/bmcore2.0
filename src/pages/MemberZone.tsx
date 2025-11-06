import { useState, useEffect } from 'react';
import { LogOut, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MemberSidebar from '../components/MemberSidebar';
import DashboardSection from './member/DashboardSection';
import PlaceholderSection from './member/PlaceholderSection';
import QuestionnairesSection from './member/QuestionnairesSection';
import ReportSettingsSection from './member/ReportSettingsSection';
import AIHealthAdvisorSection from './member/AIHealthAdvisorSection';
import DevicesSection from './member/DevicesSection';
import SupportSection from './member/SupportSection';
import PersonalInfoSection from './member/PersonalInfoSection';
import MedicalFilesSection from './member/MedicalFilesSection';
import BlackBoxSection from './member/BlackBoxSection';
import SecondOpinionSection from './member/SecondOpinionSection';
import BillingSection from './member/BillingSection';
import SystemSection from './member/SystemSection';
import ReferralSection from './member/ReferralSection';
import MyReportsSection from './member/MyReportsSection';
import CatalogSection from './member/CatalogSection';
import {
  Sparkles,
  Watch,
  HeadphonesIcon,
  Settings2,
  BookOpen,
  ClipboardList,
  FileText,
  Scale,
  FolderLock,
  Users,
  CreditCard,
  User,
  Settings
} from 'lucide-react';

interface MemberZoneProps {
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export default function MemberZone({ onNavigate, onSignOut }: MemberZoneProps) {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    // Check subscription status
    checkSubscription();

    // Check if returning from successful payment
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setShowSuccessModal(true);
      setCurrentSection('catalog'); // Show catalog after payment
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);

      // Send welcome email
      sendWelcomeEmail();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      setHasActiveSubscription(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const sendWelcomeEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('plan_id, billing_period')
        .eq('user_id', user.id)
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subscription) {
        // Send email via email provider
        const { sendEmail } = await import('../lib/emailProvider');
        await sendEmail({
          to: user.email!,
          subject: 'Welcome to BioMath Core! 🎉',
          html: `
            <h1>Welcome to BioMath Core!</h1>
            <p>Thank you for subscribing to our ${subscription.plan_id.toUpperCase()} plan!</p>
            <p>You now have full access to all features of the BioMath Core platform.</p>
            <p>Get started by exploring:</p>
            <ul>
              <li>📊 Your health dashboard</li>
              <li>🤖 AI Health Assistant</li>
              <li>📱 Device connectivity</li>
              <li>📈 Comprehensive reports</li>
            </ul>
            <p>If you have any questions, our support team is here to help!</p>
            <p>Best regards,<br/>The BioMath Core Team</p>
          `
        });
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
    onNavigate('home');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardSection />;

      case 'ai-assistant':
        return <AIHealthAdvisorSection />;

      case 'devices':
        return <DevicesSection />;

      case 'support':
        return <SupportSection />;

      case 'system':
        return <SystemSection />;

      case 'catalog':
        // Show catalog ONLY if user has active subscription
        if (!hasActiveSubscription) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="bg-gradient-to-br from-orange-500/10 to-blue-500/10 border border-orange-500/30 rounded-2xl p-12 max-w-2xl">
                <CreditCard className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Subscribe to Access Catalog
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Choose a subscription plan to unlock access to our comprehensive health services catalog with 20+ categories.
                </p>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all text-lg"
                >
                  View Plans & Subscribe
                </button>
              </div>
            </div>
          );
        }
        return <CatalogSection onSectionChange={setCurrentSection} />;

      case 'questionnaires':
        return <QuestionnairesSection />;

      case 'reports':
        return <MyReportsSection />;

      case 'second-opinion':
        return <SecondOpinionSection />;

      case 'medical-files':
        return <MedicalFilesSection />;

      case 'black-box':
        return <BlackBoxSection />;

      case 'referral':
        return <ReferralSection />;

      case 'billing':
        return <BillingSection />;

      case 'profile':
        return <PersonalInfoSection />;

      case 'settings':
        return <ReportSettingsSection />;

      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors pt-16">
      <MemberSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        hasActiveSubscription={hasActiveSubscription}
      />

      <div className="ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700/50 hover:border-orange-600/50 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700/50 hover:border-orange-600/50 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {renderSection()}
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slideUp">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🎉 Welcome to BioMath Core!
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Thank you for your subscription! Your payment was successful.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  🎯 Next Step: Choose Your Health Categories
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Visit the <strong>Catalog</strong> to select health service categories based on your plan:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span><strong>Core Plan:</strong> Choose up to 3 categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span><strong>Daily Plan:</strong> Choose up to 10 categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span><strong>Max Plan:</strong> All 20 categories included!</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                A confirmation email has been sent to your inbox with all the details.
              </p>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // After payment, go to catalog to select categories
                  setCurrentSection('catalog');
                  // Refresh subscription status
                  checkSubscription();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Go to Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
