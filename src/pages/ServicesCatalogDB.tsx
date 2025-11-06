import { useState, useEffect } from 'react';
import { Search, ChevronRight, Activity, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Service } from '../types/database';

const categoryHeroImages: Record<string, string> = {
  'critical-health': 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'everyday-wellness': 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'longevity': 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'mental-wellness': 'https://images.pexels.com/photos/7592370/pexels-photo-7592370.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'fitness-performance': 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'womens-health': 'https://images.pexels.com/photos/3737169/pexels-photo-3737169.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'mens-health': 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'beauty-skincare': 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'nutrition-diet': 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'sleep-recovery': 'https://images.pexels.com/photos/6942086/pexels-photo-6942086.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'environmental-health': 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'family-health': 'https://images.pexels.com/photos/4259140/pexels-photo-4259140.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'preventive-medicine': 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'biohacking': 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'senior-care': 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'eye-health': 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'digital-therapeutics': 'https://images.pexels.com/photos/5632379/pexels-photo-5632379.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'general-sexual': 'https://images.pexels.com/photos/3259580/pexels-photo-3259580.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'mens-sexual-health': 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'womens-sexual-health': 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

interface ServicesCatalogDBProps {
  onNavigate: (page: string, categoryId?: string) => void;
  categoryFilter?: string;
}

export default function ServicesCatalogDB({ onNavigate, categoryFilter }: ServicesCatalogDBProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFilter || null);
  const [loading, setLoading] = useState(true);
  const [locale] = useState<'en' | 'ru'>('en');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  const loadData = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('published', true)
        .order('sort_order');

      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('published', true)
        .order('sort_order');

      if (categoriesData) setCategories(categoriesData);
      if (servicesData) setServices(servicesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (selectedCategory && service.category_id !== selectedCategory) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const name = locale === 'en' ? service.name_en : service.name_ru;
    const short = locale === 'en' ? service.short_en : service.short_ru;

    return (
      name.toLowerCase().includes(query) ||
      short?.toLowerCase().includes(query) ||
      service.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const displayCategories = selectedCategory
    ? categories.filter(c => c.id === selectedCategory)
    : categories;

  const selectedCategoryData = selectedCategory
    ? categories.find(c => c.id === selectedCategory)
    : null;

  const categoryServicesCount = selectedCategoryData
    ? filteredServices.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      {selectedCategoryData ? (
        <section className="relative h-80 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${categoryHeroImages[selectedCategoryData.slug] || 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

          <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => onNavigate('home')}
              className="absolute top-6 left-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Categories</span>
            </button>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-900/50 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <Activity className={`h-12 w-12 ${selectedCategoryData.color_class} drop-shadow-lg`} strokeWidth={2} />
                </div>
              </div>

              <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${selectedCategoryData.color_class} drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}>
                {locale === 'en' ? selectedCategoryData.name_en : selectedCategoryData.name_ru}
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {locale === 'en' ? selectedCategoryData.description_en : selectedCategoryData.description_ru}
              </p>

              <div className={`inline-block px-6 py-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-white/20 ${selectedCategoryData.color_class} font-semibold text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}>
                {categoryServicesCount} services available
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Services Catalog
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Explore our comprehensive suite of 200+ biomathematical health services across 20 specialized categories
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services or categories..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedCategoryData && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                />
              </div>
            </div>
          </div>
        </section>
      )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === null
                  ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">All Categories</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{categories.length} total</div>
              </div>
            </button>
            {categories.map((category) => {
              const categoryServices = services.filter(s => s.category_id === category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                    {locale === 'en' ? category.title_en : category.title_ru}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {categoryServices.length} services
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">No services found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {displayCategories.map((category) => {
                const categoryServices = filteredServices.filter(s => s.category_id === category.id);
                if (categoryServices.length === 0) return null;

                return (
                  <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {locale === 'en' ? category.title_en : category.title_ru}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {locale === 'en' ? category.intro_en : category.intro_ru}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {categoryServices.length} Services
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => onNavigate('service-detail', `${category.slug}/${service.slug}`)}
                          className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {locale === 'en' ? service.name_en : service.name_ru}
                            </h3>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {locale === 'en' ? service.short_en : service.short_ru}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Access the complete BioMath Core platform with all 200+ services. Start your free trial today.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
