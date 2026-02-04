import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSession } from '../hooks/useSession';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const user = useSession();

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  }, [onNavigate]);

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'About', path: 'about' },
    { name: 'Pricing', path: 'services' },
    { name: 'All Services', path: 'services-catalog' },
    { name: 'Member Zone', path: 'member-zone' },
    { name: 'Investors', path: 'investors' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <picture>
              <source srcSet="/logo-header.webp?v=2" type="image/webp" />
              <img
                src="/logo-header.png?v=2"
                alt="BioMath Core Logo"
                className="h-12 w-12 object-contain"
                width="48"
                height="48"
              />
            </picture>
            <span className="text-2xl font-bold">
              <span className="text-blue-500">BioMath</span>
              <span className="text-gray-900 dark:text-white"> Core</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.path
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-md transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="text-xs">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('signin')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors opacity-5 hover:opacity-100"
              >
                Sign In/Up
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                    currentPage === item.path
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md text-left transition-colors w-full opacity-5 hover:opacity-100"
                  >
                    Sign In/Up
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
