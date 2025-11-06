import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

interface NewsProps {
  onNavigate: (page: string) => void;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  published_at: string;
}

export default function News({ onNavigate }: NewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('news_items')
        .select('id, title, slug, excerpt, image_url, published_at')
        .eq('status', 'published')
        .order('priority', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(20);

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      console.log('Loaded news:', data);
      setNews(data || []);
    } catch (err) {
      console.error('Error loading news:', err);
      setError(`Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl mb-6 shadow-lg shadow-orange-600/10">
            <Newspaper className="h-10 w-10 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">News</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Latest updates, announcements, and milestones from BioMath Core
          </p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Loading news...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-12">
            <p className="text-red-400 font-semibold mb-3 text-xl">Error Loading News</p>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button
              onClick={loadNews}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-12">
            <p className="text-gray-300 mb-4 text-lg">No news available yet.</p>
            <p className="text-sm text-gray-500">Stay tuned for updates!</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="space-y-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-orange-600/50 transition-all duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="md:flex relative">
                  {item.image_url && (
                    <div className="md:w-1/3 aspect-video md:aspect-square bg-gray-800">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>{new Date(item.published_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-50 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center text-orange-500 font-medium group-hover:text-orange-400 transition-colors">
                      <span>Read more</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
