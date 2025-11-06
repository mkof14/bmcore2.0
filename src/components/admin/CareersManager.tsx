import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CareerPostingForm from './CareerPostingForm';

interface CareerPosting {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range: string;
  status: string;
  created_at: string;
}

export default function CareersManager() {
  const [jobs, setJobs] = useState<CareerPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<CareerPosting | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const { data, error } = await supabase
        .from('career_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteJob(id: string) {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const { error } = await supabase
        .from('career_postings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job posting');
    }
  }

  async function toggleStatus(job: CareerPosting) {
    const newStatus = job.status === 'active' ? 'closed' : 'active';

    try {
      const { error } = await supabase
        .from('career_postings')
        .update({ status: newStatus })
        .eq('id', job.id);

      if (error) throw error;
      await loadJobs();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading jobs...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Careers Management</h1>
        <button
          onClick={() => {
            setEditingJob(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Job Posting
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-gray-800/50 border border-gray-700/30 border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      job.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-3">{job.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                    {job.department}
                  </span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.employment_type}</span>
                  {job.salary_range && (
                    <>
                      <span>•</span>
                      <span>{job.salary_range}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleStatus(job)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={job.status === 'active' ? 'Close position' : 'Activate position'}
                >
                  {job.status === 'active' ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingJob(job);
                    setShowForm(true);
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No job postings yet. Create your first one!</p>
        </div>
      )}

      {showForm && (
        <CareerPostingForm
          job={editingJob}
          onClose={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
          onSave={loadJobs}
        />
      )}
    </div>
  );
}
