import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

interface CareersProps {
  onNavigate: (page: string) => void;
}

interface CareerPosting {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  salary_range: string;
}

export default function Careers({ onNavigate }: CareersProps) {
  const [jobs, setJobs] = useState<CareerPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('career_postings')
        .select('id, title, slug, department, location, employment_type, description, salary_range')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      console.log('Loaded jobs:', data);
      setJobs(data || []);
    } catch (err) {
      console.error('Error loading jobs:', err);
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
            <Briefcase className="h-10 w-10 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Careers</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join us in building the future of personalized health intelligence
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why BioMath Core?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-white mb-3 text-lg">Innovation-Driven</h3>
              <p className="text-gray-400 leading-relaxed">Work on cutting-edge AI and biomathematics</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-3 text-lg">Impact-Focused</h3>
              <p className="text-gray-400 leading-relaxed">Help millions improve their health</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-3 text-lg">Growth-Oriented</h3>
              <p className="text-gray-400 leading-relaxed">Continuous learning and development</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Loading positions...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-12">
            <p className="text-red-400 font-semibold mb-3 text-xl">Error Loading Positions</p>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button
              onClick={loadJobs}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-12">
            <p className="text-gray-300 mb-4 text-lg">No open positions at the moment.</p>
            <p className="text-sm text-gray-500">Check back soon or send us your CV at careers@biomathcore.com</p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-50 transition-colors">{job.title}</h3>
                      <span className="inline-block px-3 py-1 bg-orange-900/30 border border-orange-600/20 text-orange-400 text-xs font-medium rounded-full">
                        {job.department}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{job.employment_type}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
