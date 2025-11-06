import { useState, useEffect } from 'react';
import { Search, ChevronRight, Heart, Brain, Users, Activity, Sparkles, Moon, Shield, Zap, Apple, Leaf, Eye, Tablet, Hourglass, ArrowLeft, TrendingUp, Dumbbell, Flower2, User, Droplets, HeartHandshake, Smartphone, Fingerprint, Target, Blend } from 'lucide-react';
import { serviceCategories } from '../data/services';
import BackButton from '../components/BackButton';

interface ServicesCatalogProps {
  onNavigate: (page: string, categoryId?: string) => void;
  initialCategory?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Brain,
  Users,
  Activity,
  Sparkles,
  Moon,
  Shield,
  Zap,
  Apple,
  Leaf,
  Eye,
  Tablet,
  Hourglass,
  TrendingUp,
  Dumbbell,
  Flower2,
  User,
  Droplets,
  HeartHandshake,
  Smartphone,
  Fingerprint,
  Target,
  Blend
};

const categoryHeroData: Record<string, { bgImage: string; iconColor: string; textColor: string }> = {
  'critical-health': {
    bgImage: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-orange-400',
    textColor: 'text-orange-400'
  },
  'everyday-wellness': {
    bgImage: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-green-400',
    textColor: 'text-green-400'
  },
  'longevity': {
    bgImage: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  },
  'mental-wellness': {
    bgImage: 'https://images.pexels.com/photos/7592370/pexels-photo-7592370.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-400'
  },
  'fitness-performance': {
    bgImage: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-400'
  },
  'womens-health': {
    bgImage: 'https://images.pexels.com/photos/3737169/pexels-photo-3737169.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  },
  'mens-health': {
    bgImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'beauty-skincare': {
    bgImage: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  },
  'nutrition-diet': {
    bgImage: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-green-400',
    textColor: 'text-green-400'
  },
  'sleep-recovery': {
    bgImage: 'https://images.pexels.com/photos/6942086/pexels-photo-6942086.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-purple-400',
    textColor: 'text-purple-400'
  },
  'environmental-health': {
    bgImage: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-teal-400',
    textColor: 'text-teal-400'
  },
  'family-health': {
    bgImage: 'https://images.pexels.com/photos/4259140/pexels-photo-4259140.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-orange-400',
    textColor: 'text-orange-400'
  },
  'preventive-medicine': {
    bgImage: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-400'
  },
  'biohacking': {
    bgImage: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'senior-care': {
    bgImage: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-slate-300',
    textColor: 'text-slate-300'
  },
  'eye-health': {
    bgImage: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'digital-therapeutics': {
    bgImage: 'https://images.pexels.com/photos/5632379/pexels-photo-5632379.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-purple-400',
    textColor: 'text-purple-400'
  },
  'general-sexual': {
    bgImage: 'https://images.pexels.com/photos/3259580/pexels-photo-3259580.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-red-400',
    textColor: 'text-red-400'
  },
  'mens-sexual-health': {
    bgImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  },
  'womens-sexual-health': {
    bgImage: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=1200',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-400'
  }
};

export default function ServicesCatalog({ onNavigate, initialCategory }: ServicesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredCategories = serviceCategories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.services.some(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      )
    );
  });

  const selectedCategoryData = selectedCategory
    ? serviceCategories.find(c => c.id === selectedCategory)
    : null;

  const heroData = selectedCategoryData ? categoryHeroData[selectedCategoryData.id] : null;
  const IconComponent = selectedCategoryData ? iconMap[selectedCategoryData.icon] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      {selectedCategoryData && heroData && IconComponent ? (
        <section className="relative h-80 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroData.bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

          <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-6 left-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Categories</span>
            </button>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gray-900/50 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center ${heroData.iconColor} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
                  <IconComponent className="h-12 w-12" strokeWidth={2} />
                </div>
              </div>

              <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${heroData.textColor} drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}>
                {selectedCategoryData.name}
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {selectedCategoryData.description}
              </p>

              <div className={`inline-block px-6 py-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-white/20 ${heroData.textColor} font-semibold text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}>
                {selectedCategoryData.services.length} services available
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <BackButton onNavigate={onNavigate} />

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="flex-1 text-right">
                  <h1 className="text-5xl font-bold text-white mb-4">
                    Complete Services Catalog
                  </h1>
                  <p className="text-xl text-gray-300">
                    Explore our comprehensive suite of 200+ biomathematical health services across 20 specialized categories
                  </p>
                </div>
                <img
                  src="/Copilot_20251022_202220.png"
                  alt="BioMath Services"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-700 bg-gray-800 text-white focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedCategoryData && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900/50 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-700 bg-gray-800 text-white focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          {!selectedCategoryData ? (
            <div>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">No categories found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const IconComponent = iconMap[category.icon] || Activity;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="group p-6 rounded-2xl border border-gray-800 hover:border-gray-700 bg-gray-900/50 backdrop-blur hover:shadow-2xl hover:shadow-orange-500/20 transition-all text-left"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`flex-shrink-0 w-14 h-14 bg-gray-800/50 rounded-xl flex items-center justify-center`}>
                            <IconComponent className={`h-7 w-7 ${categoryHeroData[category.id]?.iconColor || 'text-orange-400'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${categoryHeroData[category.id]?.textColor || 'text-orange-400'} mb-1`}>
                              {category.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-400">
                              {category.services.length} Services
                            </p>
                          </div>
                          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400">
                          {category.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {selectedCategoryData.services.filter(service => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  service.name.toLowerCase().includes(query) ||
                  service.description.toLowerCase().includes(query)
                );
              }).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">No services found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategoryData.services
                    .filter(service => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        service.name.toLowerCase().includes(query) ||
                        service.description.toLowerCase().includes(query)
                      );
                    })
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => onNavigate('service-detail', `${selectedCategoryData.id}/${service.id}`)}
                        className="group p-5 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-900/50 backdrop-blur hover:shadow-2xl hover:shadow-orange-500/20 transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-white group-hover:text-orange-400 transition-colors pr-2">
                            {service.name}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400">{service.description}</p>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Choose a plan that matches your needs and get instant access to our comprehensive health analytics platform.
          </p>
          <button
            onClick={() => onNavigate('pricing')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg shadow-2xl shadow-orange-500/50 transition-all transform hover:scale-105"
          >
            View Pricing Plans
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="mt-6 text-sm text-gray-400">
            All plans include a 5-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
