import { useState, useEffect } from 'react';
import { Star, Check, X, Eye, EyeOff, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Testimonial {
  id: string;
  full_name: string;
  role: string;
  company: string;
  avatar_url?: string;
  content: string;
  rating: number;
  featured: boolean;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  display_order: number;
  created_at: string;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      let query = supabase.from('testimonials').select('*').order('display_order');

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  }

  async function toggleFeatured(id: string, currentFeatured: boolean) {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  }

  async function toggleVerified(id: string, currentVerified: boolean) {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ verified: !currentVerified })
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling verified:', error);
    }
  }

  async function updateDisplayOrder(id: string, direction: 'up' | 'down') {
    const currentIndex = testimonials.findIndex((t) => t.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;

    try {
      const current = testimonials[currentIndex];
      const other = testimonials[newIndex];

      await Promise.all([
        supabase
          .from('testimonials')
          .update({ display_order: other.display_order })
          .eq('id', current.id),
        supabase
          .from('testimonials')
          .update({ display_order: current.display_order })
          .eq('id', other.id),
      ]);

      fetchTestimonials();
    } catch (error) {
      console.error('Error updating display order:', error);
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Testimonials Management
        </h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.full_name}
                    </h3>
                    {testimonial.verified && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    {testimonial.featured && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    testimonial.status === 'approved'
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : testimonial.status === 'rejected'
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {testimonial.status}
                </span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
              {testimonial.content}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {testimonial.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateStatus(testimonial.id, 'approved')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(testimonial.id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </>
              )}

              <button
                onClick={() => toggleFeatured(testimonial.id, testimonial.featured)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  testimonial.featured
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {testimonial.featured ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {testimonial.featured ? 'Unfeature' : 'Feature'}
              </button>

              <button
                onClick={() => toggleVerified(testimonial.id, testimonial.verified)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  testimonial.verified
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Check className="h-4 w-4" />
                {testimonial.verified ? 'Verified' : 'Verify'}
              </button>

              <button
                onClick={() => updateDisplayOrder(testimonial.id, 'up')}
                className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>

              <button
                onClick={() => updateDisplayOrder(testimonial.id, 'down')}
                className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>

              <button
                onClick={() => deleteTestimonial(testimonial.id)}
                className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No testimonials found
          </div>
        )}
      </div>
    </div>
  );
}
