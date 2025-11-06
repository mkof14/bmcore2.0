import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Clock, Filter, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Report {
  id: string;
  report_title: string;
  report_type: string;
  status: string;
  created_at: string;
}

export default function MyReportsSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filterType === 'all'
    ? reports
    : reports.filter(r => r.report_type === filterType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900/30 border-green-600/30 text-green-400';
      case 'processing': return 'bg-blue-900/30 border-blue-600/30 text-blue-400';
      case 'pending': return 'bg-yellow-900/30 border-yellow-600/30 text-yellow-400';
      default: return 'bg-gray-700/30 border-gray-600/30 text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-orange-500" />
          My Reports
        </h1>
        <p className="text-gray-400">
          Access and manage all your AI-generated health reports and analyses
        </p>
      </div>

      <div className="mb-6 grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-900 border border-blue-600/30 rounded-xl p-4">
          <FileText className="h-6 w-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{reports.length}</p>
          <p className="text-xs text-gray-400">Total Reports</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-gray-900 border border-green-600/30 rounded-xl p-4">
          <Clock className="h-6 w-6 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">
            {reports.filter(r => r.status === 'completed').length}
          </p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-gray-900 border border-orange-600/30 rounded-xl p-4">
          <Clock className="h-6 w-6 text-orange-400 mb-2" />
          <p className="text-2xl font-bold text-white">
            {reports.filter(r => r.status === 'processing').length}
          </p>
          <p className="text-xs text-gray-400">Processing</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-gray-900 border border-purple-600/30 rounded-xl p-4">
          <FileText className="h-6 w-6 text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-white">
            {reports[0] ? new Date(reports[0].created_at).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-xs text-gray-400">Latest Report</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setFilterType('comprehensive')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'comprehensive'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Comprehensive
          </button>
          <button
            onClick={() => setFilterType('focused')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'focused'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Focused
          </button>
        </div>

        <button
          onClick={() => alert('Generate New Report: This will redirect to the Reports generation page.')}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Generate New Report
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading reports...</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No reports found</p>
          <p className="text-sm text-gray-500">Generate your first AI health report to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-400" />
                </div>
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {report.report_title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-300 capitalize">{report.report_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Generated:</span>
                  <span className="text-gray-300">{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Viewing report: ${report.report_title}`)}
                  className="flex-1 p-2 bg-blue-900/30 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => alert(`Downloading report: ${report.report_title}`)}
                  className="p-2 bg-green-900/30 border border-green-600/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
