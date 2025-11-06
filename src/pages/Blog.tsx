import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';
import LoadingSpinner, { SkeletonList } from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { generateArticleSchema, injectStructuredData } from '../lib/structuredData';

interface BlogProps {
  onNavigate: (page: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  published_at: string;
}

export default function Blog({ onNavigate }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, category, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12);

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      console.log('Loaded posts:', data);
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(`Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 pt-20 pb-16">
      <SEO
        title="Health & Wellness Blog - Expert Articles & Insights"
        description="Explore our collection of articles on health analytics, wellness optimization, preventive care, and personalized medicine. Expert insights from BioMath Core."
        keywords={['health blog', 'wellness articles', 'health insights', 'preventive care tips', 'personalized medicine blog', 'health technology articles']}
        url="/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl mb-6 shadow-lg shadow-orange-600/10">
            <BookOpen className="h-10 w-10 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Blog</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Insights, research, and stories about health, wellness, and the future of personalized care
          </p>
        </div>

        {loading && (
          <div className="py-20">
            <SkeletonList count={6} />
          </div>
        )}

        {error && (
          <div className="py-12">
            <ErrorMessage
              title="Failed to Load Articles"
              message={error}
              onRetry={loadPosts}
            />
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="py-20">
            <EmptyState
              icon={BookOpen}
              title="No Articles Yet"
              description="Check back soon for health insights, research, and wellness stories."
            />
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-orange-600/50 transition-all duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {post.featured_image && (
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 relative">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-orange-900/30 border border-orange-600/20 text-orange-400 text-xs font-medium rounded-full mb-3">
                      {post.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-50 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-orange-500 group-hover:text-orange-400 transition-colors" />
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
