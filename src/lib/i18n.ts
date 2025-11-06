type Language = 'en' | 'es' | 'fr';

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'hero.title': 'AI-Powered Health Intelligence',
    'hero.subtitle': 'Transform your health data into actionable insights',
    'cta.getStarted': 'Get Started',
    'cta.learnMore': 'Learn More',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.pricing': 'Precios',
    'nav.about': 'Acerca de',
    'hero.title': 'Inteligencia de Salud con IA',
    'hero.subtitle': 'Transforma tus datos de salud en información útil',
    'cta.getStarted': 'Comenzar',
    'cta.learnMore': 'Saber Más',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.pricing': 'Tarifs',
    'nav.about': 'À Propos',
    'hero.title': 'Intelligence Santé Propulsée par IA',
    'hero.subtitle': 'Transformez vos données de santé en informations exploitables',
    'cta.getStarted': 'Commencer',
    'cta.learnMore': 'En Savoir Plus',
  },
};

let currentLanguage: Language = 'en';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  window.dispatchEvent(new CustomEvent('languagechange'));
}

export function getLanguage(): Language {
  const stored = localStorage.getItem('language') as Language;
  return stored || 'en';
}

export function t(key: string): string {
  return translations[currentLanguage]?.[key] || key;
}

export { translations };
