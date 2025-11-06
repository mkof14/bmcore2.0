import { Mail, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center space-x-3">
              <picture>
                <source srcSet="/logo-footer.webp?v=2" type="image/webp" />
                <img
                  src="/logo-footer.png?v=2"
                  alt="BioMath Core Logo"
                  className="h-16 w-16 object-contain"
                  width="64"
                  height="64"
                />
              </picture>
              <span className="text-3xl font-bold">
                <span className="text-blue-500">BioMath</span>
                <span className="text-gray-900 dark:text-white"> Core</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Biomathematics-based wellness intelligence platform for understanding your body.
            </p>

            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-600 hover:bg-orange-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 transition-opacity">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 hover:opacity-80 transition-all">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-700 hover:bg-orange-800 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@biomathcore.com" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  info@biomathcore.com
                </a>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Newsletter</h3>
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-r-lg transition-all">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
              </button>
            </div>

          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services-catalog')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  All Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('devices')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Devices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('investors')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Investors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('science')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Science
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('api')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  API
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learning')} className="text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                  Learning Center
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal & Safety</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('trust-safety')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Trust & Safety
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('data-privacy')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Data Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms-of-service')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hipaa-notice')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  HIPAA Notice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('security')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gdpr')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  GDPR
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Partnership</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('partnership')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Partnership Opportunities
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Corporate</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('news')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  News
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('referral')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Refer a Friend
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ambassador')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Ambassador Program
                </button>
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 mt-6">Member Area</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('member')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Member Zone
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('command-center')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Command Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-panel')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Info & Help</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-two-models')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Why Two Models
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-trust')} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Privacy & Trust Center
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            © 2025 BioMath Core. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 max-w-3xl mx-auto">
            BioMath Core is a wellness platform, not a medical service. We do not diagnose, treat, or provide medical advice. Our platform offers guidance for wellness and preventive health support only. Always consult with qualified healthcare professionals for medical concerns.
          </p>
        </div>
      </div>
    </footer>
  );
}
