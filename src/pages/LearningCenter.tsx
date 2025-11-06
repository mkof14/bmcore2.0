import { BookOpen, Sparkles, FileText, HelpCircle, Search, ChevronRight, ChevronDown, GraduationCap, DollarSign, Users, Grid } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/BackButton';

interface LearningCenterProps {
  onNavigate: (page: string, data?: string) => void;
}

const categories = [
  {
    id: 'critical-health',
    name: 'Critical Health',
    count: 18,
    description: 'Emergency health monitoring and critical condition assessment',
    services: ['Heart Attack Risk', 'Stroke Prevention', 'Blood Pressure Monitoring', 'Diabetes Management']
  },
  {
    id: 'everyday-wellness',
    name: 'Everyday Wellness',
    count: 15,
    description: 'Daily health maintenance and general wellbeing support',
    services: ['Energy Optimization', 'Sleep Quality', 'Stress Management', 'Hydration Tracking']
  },
  {
    id: 'longevity',
    name: 'Longevity & Anti-Aging',
    count: 15,
    description: 'Cellular health and biological age optimization',
    services: ['Biological Age Assessment', 'Telomere Health', 'Cellular Senescence', 'NAD+ Optimization']
  },
  {
    id: 'mental-wellness',
    name: 'Mental Wellness',
    count: 11,
    description: 'Emotional balance and cognitive health support',
    services: ['Anxiety Support', 'Depression Screening', 'Cognitive Function', 'Mindfulness Training']
  },
  {
    id: 'fitness',
    name: 'Fitness & Performance',
    count: 19,
    description: 'Athletic performance and physical optimization',
    services: ['VO₂ Max Testing', 'Recovery Tracking', 'Performance Analytics', 'Training Optimization']
  },
  {
    id: 'womens-health',
    name: 'Women\'s Health',
    count: 8,
    description: 'Comprehensive women\'s health and hormonal support',
    services: ['Cycle Tracking', 'Hormonal Balance', 'Pregnancy Support', 'Menopause Management']
  },
  {
    id: 'mens-health',
    name: 'Men\'s Health',
    count: 8,
    description: 'Men-specific health monitoring and vitality support',
    services: ['Testosterone Tracking', 'Prostate Health', 'Vitality Optimization', 'Performance Support']
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Diet',
    count: 15,
    description: 'Personalized nutrition guidance and metabolic health',
    services: ['Meal Planning', 'Macro Tracking', 'Metabolic Flexibility', 'Insulin Sensitivity']
  }
];

const glossaryTerms = [
  {
    term: 'Metabolic Age',
    meaning: 'A comparison between your biological metabolic efficiency and the average of your chronological age group',
    importance: 'A lower metabolic age suggests better cellular energy use and lower metabolic stress',
    helps: 'Guides lifestyle adjustments to improve long-term vitality and healthy weight regulation'
  },
  {
    term: 'Cortisol',
    meaning: 'A primary stress hormone regulating energy availability and alertness',
    importance: 'Chronically elevated levels impair sleep, mood, and metabolism',
    helps: 'Serves as a direct indicator of allostatic load and stress management needs'
  },
  {
    term: 'HRV (Heart Rate Variability)',
    meaning: 'The variation in time between heartbeats',
    importance: 'Higher HRV indicates better nervous system balance and recovery capacity',
    helps: 'Guides when to rest and when the body is ready to adapt to new challenges'
  },
  {
    term: 'Telomeres',
    meaning: 'Protective end-caps of DNA that shorten with stress and poor recovery',
    importance: 'Shorter telomeres signal faster aging and cellular decline',
    helps: 'Reflects long-term repair quality and biological aging rate'
  },
  {
    term: 'NAD+',
    meaning: 'A molecule essential for energy production and cellular repair',
    importance: 'Levels decline with age and stress, affecting cellular function',
    helps: 'Supports metabolic renewal and long-term vitality optimization'
  },
  {
    term: 'Autophagy',
    meaning: 'The body\'s natural "cellular cleanup" process that removes damaged cells',
    importance: 'Supports longevity and metabolic repair through cellular maintenance',
    helps: 'Used as a marker of cellular maintenance quality and regeneration'
  },
  {
    term: 'Biological Age',
    meaning: 'A measure of how old your body behaves functionally, not chronologically',
    importance: 'Tracks real aging processes, not calendar aging',
    helps: 'Encourages prevention before decline and tracks intervention effectiveness'
  },
  {
    term: 'BDNF',
    meaning: 'Brain-Derived Neurotrophic Factor - a molecule that supports neuroplasticity',
    importance: 'Higher BDNF improves learning, mood, and brain repair capacity',
    helps: 'Guides cognitive-performance routines and mental health optimization'
  },
  {
    term: 'Insulin Sensitivity',
    meaning: 'How effectively your cells respond to insulin to regulate blood sugar',
    importance: 'Higher sensitivity protects against metabolic syndrome and early aging',
    helps: 'Guides dietary timing and lifestyle interventions for metabolic health'
  },
  {
    term: 'Mitochondria',
    meaning: 'The "energy factories" inside cells that convert nutrients into ATP',
    importance: 'Strong mitochondrial function supports energy, longevity, and resilience',
    helps: 'Signals how well the body can power daily activity and recovery'
  },
  {
    term: 'Hormesis',
    meaning: 'Beneficial stress that strengthens the body when applied moderately',
    importance: 'Many longevity tools work through hormesis (cold, exercise, fasting)',
    helps: 'Clarifies why controlled stressors are helpful for adaptation'
  },
  {
    term: 'Neuroplasticity',
    meaning: 'The brain\'s ability to rewire and adapt throughout life',
    importance: 'Enables emotional healing, skill growth, and cognitive improvement',
    helps: 'Encourages training the nervous system through gradual adaptation'
  }
];

export default function LearningCenter({ onNavigate }: LearningCenterProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTerms = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gettingStartedSections = [
    {
      title: 'Pricing Plans',
      icon: DollarSign,
      content: 'Choose from flexible subscription tiers designed to match your wellness journey. All plans include core services, with advanced tiers unlocking specialized assessments, device integrations, and premium AI guidance.'
    },
    {
      title: 'Member Zone',
      icon: Users,
      content: 'Your personalized health dashboard. Track progress across all services, review reports, manage device connections, set wellness goals, and access your complete health timeline in one secure location.'
    },
    {
      title: 'Services Guide',
      icon: FileText,
      content: 'Each service provides guided assessments, clear interpretations, and actionable recommendations. Services are activated individually, ensuring you only engage with what matters to you right now.'
    },
    {
      title: 'Categories',
      icon: Grid,
      content: 'Explore 20 major health categories containing 200+ services. Each category focuses on a specific domain of wellness, from critical health monitoring to longevity optimization and mental wellbeing.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 dark:bg-orange-700 rounded-2xl mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Understand your health journey through calm explanations, simple visuals, and confidence-building guidance
          </p>
        </div>

        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories, services, or health terms..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-600 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Started</h2>
              </div>

              <div className="space-y-3">
                {gettingStartedSections.map((section, index) => {
                  const Icon = section.icon;
                  const isExpanded = expandedSection === section.title;

                  return (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.title)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{section.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="p-4 bg-white dark:bg-gray-800">
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {section.content}
                          </p>
                          {section.title === 'Pricing Plans' && (
                            <button
                              onClick={() => onNavigate('services')}
                              className="mt-4 text-sm text-orange-600 dark:text-orange-500 hover:underline"
                            >
                              View Plans →
                            </button>
                          )}
                          {section.title === 'Member Zone' && (
                            <button
                              onClick={() => onNavigate('member')}
                              className="mt-4 text-sm text-orange-600 dark:text-orange-500 hover:underline"
                            >
                              Go to Member Zone →
                            </button>
                          )}
                          {section.title === 'Services Guide' && (
                            <button
                              onClick={() => onNavigate('services-catalog')}
                              className="mt-4 text-sm text-orange-600 dark:text-orange-500 hover:underline"
                            >
                              Browse All Services →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <Grid className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Categories</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Explore comprehensive health categories with specialized services
              </p>

              <div className="space-y-3">
                {filteredCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate('services-catalog', category.id)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{category.count} services</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{category.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-500 flex-shrink-0 ml-2 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6" />
                <h3 className="text-xl font-bold">AI Health Advisor</h3>
              </div>
              <p className="text-orange-100 mb-4 text-sm">
                Not sure where to start? The AI Health Advisor helps you find the right category and services based on your needs.
              </p>
              <button
                onClick={() => onNavigate('member')}
                className="w-full px-4 py-3 bg-white text-orange-700 hover:bg-orange-50 rounded-lg transition-colors font-medium text-sm"
              >
                Start Guided Tour
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <HelpCircle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Help</h3>
              </div>
              <button
                onClick={() => onNavigate('faq')}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                Visit FAQ →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Glossary</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Key scientific and health concepts explained in simple, actionable language
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((item, index) => {
              const isExpanded = selectedTerm === item.term;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedTerm(isExpanded ? null : item.term)}
                  className="text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.term}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.meaning}</p>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-orange-600 dark:text-orange-500 mb-1">Why it matters:</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.importance}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-orange-700 dark:text-orange-600 mb-1">How it helps:</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.helps}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Educational Philosophy</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            The Learning Center educates through reassurance, not overload. We bridge the gap between data and daily choices.
            There are no lectures — only clarity. Our tone is calm, science-backed, human, and non-medical.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">What We Do</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Explain services and their purpose clearly</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">How We Help</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Guide you to the right support</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Our Goal</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Build your confidence, not confusion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
