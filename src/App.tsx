import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistantButton from './components/AIAssistantButton';
import AIHealthAssistant from './components/AIHealthAssistant';
import CookieBanner from './components/CookieBanner';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import CommandPalette from './components/CommandPalette';
import { LoadingPage } from './components/LoadingSpinner';
import { analytics, identifyUser } from './lib/analytics';
import { useServiceWorker } from './hooks/useServiceWorker';
import AdminGate from './components/AdminGate';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Investors = lazy(() => import('./pages/Investors'));
const Science = lazy(() => import('./pages/Science'));
const API = lazy(() => import('./pages/API'));
const Contact = lazy(() => import('./pages/Contact'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const MemberZone = lazy(() => import('./pages/MemberZone'));
const ServicesCatalog = lazy(() => import('./pages/ServicesCatalog'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Devices = lazy(() => import('./pages/Devices'));
const Reports = lazy(() => import('./pages/Reports'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Referral = lazy(() => import('./pages/Referral'));
const Ambassador = lazy(() => import('./pages/Ambassador'));
const LearningCenter = lazy(() => import('./pages/LearningCenter'));
const BiomathCoreSummary = lazy(() => import('./pages/BiomathCoreSummary'));
const SummaryText = lazy(() => import('./pages/SummaryText'));
const Blog = lazy(() => import('./pages/Blog'));
const News = lazy(() => import('./pages/News'));
const Careers = lazy(() => import('./pages/Careers'));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));
const HIPAANotice = lazy(() => import('./pages/legal/HIPAANotice'));
const Security = lazy(() => import('./pages/legal/Security'));
const GDPR = lazy(() => import('./pages/legal/GDPR'));
const DataPrivacy = lazy(() => import('./pages/legal/DataPrivacy'));
const TrustSafety = lazy(() => import('./pages/legal/TrustSafety'));
const Partnership = lazy(() => import('./pages/Partnership'));
const RedeemInvitation = lazy(() => import('./pages/RedeemInvitation'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const WhyTwoModels = lazy(() => import('./pages/WhyTwoModels'));
const PrivacyTrust = lazy(() => import('./pages/PrivacyTrust'));
const ConfigSystem = lazy(() => import('./pages/admin/ConfigSystem'));

type Page = 'home' | 'about' | 'services' | 'pricing' | 'investors' | 'science' | 'api' | 'contact' | 'signin' | 'signup' | 'member' | 'member-zone' | 'services-catalog' | 'service-detail' | 'devices' | 'reports' | 'faq' | 'referral' | 'ambassador' | 'learning' | 'learning-center' | 'biomath-core-summary' | 'summary-text' | 'blog' | 'news' | 'careers' | 'command-center' | 'admin-panel' | 'config-system' | 'privacy-policy' | 'terms-of-service' | 'disclaimer' | 'hipaa-notice' | 'security' | 'gdpr' | 'data-privacy' | 'trust-safety' | 'partnership' | 'how-it-works' | 'why-two-models' | 'privacy-trust';

function App() {
  // VERSION: 2025-10-20-01:48 - Force HMR refresh
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [serviceDetailId, setServiceDetailId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  // Check subscription status
  const checkSubscription = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      return !!data;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    } 
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        identifyUser(session.user.id, {
          email: session.user.email
        });
        checkSubscription(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        identifyUser(session.user.id, {
          email: session.user.email
        });
        checkSubscription(session.user.id);
      } 
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    analytics.page(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleOpenCommandPalette = () => setIsCommandPaletteOpen(true);
    const handleOpenAIAssistant = () => setIsAssistantOpen(true);

    window.addEventListener('open-command-palette', handleOpenCommandPalette);
    window.addEventListener('open-ai-assistant', handleOpenAIAssistant);

    return () => {
      window.removeEventListener('open-command-palette', handleOpenCommandPalette);
      window.removeEventListener('open-ai-assistant', handleOpenAIAssistant);
    };
  }, []);

  const handleNavigate = async (page: string, data?: string) => {
    // Special handling for member-zone/member pages
    if ((page === 'member' || page === 'member-zone') && !isAuthenticated) {
      setCurrentPage('signin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If trying to access member zone, check subscription
    if ((page === 'member' || page === 'member-zone') && isAuthenticated) {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const hasActiveSub = await checkSubscription(user.id);
        if (!hasActiveSub) {
          // No subscription - redirect to pricing
          setCurrentPage('pricing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    }

    if (page === 'service-detail' && data) {
      setServiceDetailId(data);
      setCurrentPage('service-detail');
    } else if (page === 'services-catalog' && data) {
      setCategoryFilter(data);
      setCurrentPage('services-catalog');
    } else {
      setCategoryFilter('');
      setCurrentPage(page as Page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />;
      case 'services-catalog':
        return <ServicesCatalog onNavigate={handleNavigate} initialCategory={categoryFilter} />;
      case 'service-detail':
        return <ServiceDetail onNavigate={handleNavigate} serviceId={serviceDetailId} />;
      case 'investors':
        return <Investors onNavigate={handleNavigate} />;
      case 'science':
        return <Science />;
      case 'api':
        return <API onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ onNavigate={handleNavigate} />;
      case 'signin':
        return <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigate} />;
      case 'member':
      case 'member-zone':
        return isAuthenticated ? (
          <MemberZone onNavigate={handleNavigate} onSignOut={handleSignOut} />
        ) : (
          <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />
        );
      case 'devices':
        return isAuthenticated ? (
          <Devices onNavigate={handleNavigate} />
        ) : (
          <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />
        );
      case 'reports':
        return isAuthenticated ? (
          <Reports onNavigate={handleNavigate} />
        ) : (
          <SignIn onNavigate={handleNavigate} onSignIn={handleSignIn} />
        );
      case 'referral':
        return <Referral onNavigate={handleNavigate} />;
      case 'ambassador':
        return <Ambassador onNavigate={handleNavigate} />;
      case 'learning':
      case 'learning-center':
        return <LearningCenter onNavigate={handleNavigate} />;
      case 'biomath-core-summary':
        return <BiomathCoreSummary onNavigate={handleNavigate} />;
      case 'summary-text':
        return <SummaryText onNavigate={handleNavigate} />;
      case 'blog':
        return <Blog onNavigate={handleNavigate} />;
      case 'news':
        return <News onNavigate={handleNavigate} />;
      case 'careers':
        return <Careers onNavigate={handleNavigate} />;
      case 'command-center':
        return <AdminGate onNavigate={handleNavigate}><CommandCenter onNavigate={handleNavigate} /></AdminGate>;
      case 'admin-panel':
        return <AdminGate onNavigate={handleNavigate}><AdminPanel onNavigate={handleNavigate} /></AdminGate>;
      case 'config-system':
        return <AdminGate onNavigate={handleNavigate}><ConfigSystem /></AdminGate>;
      case 'privacy-policy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      case 'terms-of-service':
        return <TermsOfService onNavigate={handleNavigate} />;
      case 'disclaimer':
        return <Disclaimer onNavigate={handleNavigate} />;
      case 'hipaa-notice':
        return <HIPAANotice onNavigate={handleNavigate} />;
      case 'security':
        return <Security onNavigate={handleNavigate} />;
      case 'gdpr':
        return <GDPR onNavigate={handleNavigate} />;
      case 'data-privacy':
        return <DataPrivacy onNavigate={handleNavigate} />;
      case 'trust-safety':
        return <TrustSafety onNavigate={handleNavigate} />;
      case 'partnership':
        return <Partnership onNavigate={handleNavigate} />;
      case 'redeem-invitation':
        return <RedeemInvitation />;
      case 'how-it-works':
        return <HowItWorks onNavigate={handleNavigate} />;
      case 'why-two-models':
        return <WhyTwoModels />;
      case 'privacy-trust':
        return <PrivacyTrust onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const showHeaderFooter = currentPage !== 'signin' && currentPage !== 'signup';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {showHeaderFooter && <Header onNavigate={handleNavigate} currentPage={currentPage} />}
      <main>
        <Suspense fallback={<LoadingPage text="Loading..." />}>
          {renderPage()}
        </Suspense>
      </main>
      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}

      <AIAssistantButton
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        isOpen={isAssistantOpen}
      />

      <AIHealthAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <CookieBanner />

      <PWAInstallPrompt />

      {isUpdateAvailable && (
        <PWAUpdatePrompt onUpdate={updateServiceWorker} />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page) => {
          handleNavigate(page);
          setIsCommandPaletteOpen(false);
        }}
      />
    </div>
  );
}

export default App;
