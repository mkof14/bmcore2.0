import { useState, useEffect } from 'react';
import { FileText, Plus, Download, MessageSquare, TrendingUp, Clock, Zap, Heart, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { HealthReport } from '../types/database';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export default function Reports({ onNavigate }: ReportsProps) {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);
  const [showCreateFlow, setShowCreateFlow] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return 'General Report';
      case 'thematic': return 'Thematic';
      case 'dynamic': return 'Dynamic';
      case 'device_enhanced': return 'Device Enhanced';
      default: return type;
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'general': return FileText;
      case 'thematic': return Heart;
      case 'dynamic': return TrendingUp;
      case 'device_enhanced': return Activity;
      default: return FileText;
    }
  };

  if (showCreateFlow) {
    return (
      <CreateReportFlow
        onBack={() => setShowCreateFlow(false)}
        onComplete={() => {
          setShowCreateFlow(false);
          loadReports();
        }}
      />
    );
  }

  if (selectedReport) {
    return (
      <ReportView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
        onNavigate={onNavigate}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">
              My Reports
            </h1>
            <button
              onClick={() => setShowCreateFlow(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-600/20 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Report
            </button>
          </div>
          <p className="text-xl text-gray-400">
            Reports transform data into understanding: what's happening now, why, and what to do next.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-12 text-center border-2 border-dashed border-gray-700/50">
            <FileText className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No reports yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first report to get a personalized explanation of your state
              and specific steps for improvement.
            </p>
            <button
              onClick={() => setShowCreateFlow(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-600/20 text-white rounded-lg transition-colors font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => {
              const Icon = getReportIcon(report.report_type);
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {report.topic || getReportTypeLabel(report.report_type)}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(report.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold rounded">
                      {getReportTypeLabel(report.report_type)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {report.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {report.insights && Array.isArray(report.insights) && (
                        <span>{report.insights.length} insights</span>
                      )}
                      {report.recommendations && Array.isArray(report.recommendations) && (
                        <span>{report.recommendations.length} recommendations</span>
                      )}
                      {report.second_opinion_a && report.second_opinion_b && (
                        <span className="text-purple-600 dark:text-purple-400">+ Second Opinion</span>
                      )}
                    </div>
                    <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface CreateReportFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

function CreateReportFlow({ onBack, onComplete }: CreateReportFlowProps) {
  const [step, setStep] = useState<'type' | 'options' | 'generating'>('type');
  const [reportType, setReportType] = useState<'general' | 'thematic' | 'dynamic' | 'device_enhanced'>('general');
  const [includeSecondOpinion, setIncludeSecondOpinion] = useState(false);
  const [topic, setTopic] = useState('');

  const handleCreate = async () => {
    setStep('generating');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const mockReport: Partial<HealthReport> = {
        user_id: user.id,
        report_type: reportType,
        topic: topic || null,
        summary: 'Your body is currently in a stabilization state. Sleep is supporting recovery, but your nervous system hasn\'t returned to normal tone yet.',
        insights: [
          'Sleep quality is stable, duration within normal range',
          'HRV shows slight decrease over the last 3 days',
          'Energy remains steady, small drops after lunch',
          'Physical activity in adaptive zone'
        ],
        analysis: 'Your body is functioning well overall. Sleep metrics are adequate, but there\'s room for deeper recovery. HRV shows a slight drop - a signal of mild stress on the nervous system. Energy drops after lunch, which may be related to nutrition or lack of brief rest.',
        recommendations: [
          {
            title: 'Recovery Practices',
            description: 'Add 10 minutes of breathing exercises before bed. This will lower nervous system tension.',
            priority: 'high'
          },
          {
            title: 'Eating Pattern',
            description: 'Reduce carbohydrate load at lunch, add more protein and fiber.',
            priority: 'medium'
          },
          {
            title: 'Short Walk',
            description: 'Take a 10-15 minute walk after lunch to stabilize glucose levels.',
            priority: 'medium'
          }
        ],
        device_data: null
      };

      if (includeSecondOpinion) {
        mockReport.second_opinion_a = 'Your state is related to a slight decrease in parasympathetic activity. HRV drops due to insufficient recovery between stressful periods. This is a normal adaptive response, but it\'s important not to allow chronic overload.';
        mockReport.second_opinion_b = 'It looks like you\'ve picked up a slightly fast pace and your body is trying to catch up. This doesn\'t mean you need to stop - just add pauses between efforts. The body adapts better when load and recovery alternate.';
      }

      const { error } = await supabase
        .from('health_reports')
        .insert(mockReport);

      if (error) throw error;

      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error creating report:', error);
      setStep('options');
    }
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Zap className="h-16 w-16 text-orange-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Creating your report
          </h2>
          <div className="space-y-2 text-gray-400">
            <p>✓ Gathering latest data</p>
            <p>✓ Analyzing trends</p>
            <p>✓ Forming insights</p>
            <p className="animate-pulse">⏳ Preparing recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'options') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={onBack}
            className="mb-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-white mb-4">
            Report Settings
          </h1>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 border border-gray-700/50">
            <p className="text-gray-700 dark:text-gray-300">
              We'll gather your latest data and present the observations in a clear format: what's happening now,
              why, and what gentle step will help next.
            </p>
          </div>

          {reportType === 'thematic' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Report Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="For example: Why am I not sleeping well?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
              />
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSecondOpinion}
                onChange={(e) => setIncludeSecondOpinion(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-semibold text-white">
                  Include second opinion
                </p>
                <p className="text-sm text-gray-400">
                  Get two different explanations: physiological and behavioral
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-600/20 text-white rounded-lg font-semibold transition-colors"
          >
            Create Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">
          Choose Report Type
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => {
              setReportType('general');
              setStep('options');
            }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group"
          >
            <FileText className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">
              General State Report
            </h3>
            <p className="text-gray-400 text-sm">
              Learn what's happening with your body overall: sleep, energy, recovery, load adaptation
            </p>
          </button>

          <button
            onClick={() => {
              setReportType('thematic');
              setStep('options');
            }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all text-left group"
          >
            <Heart className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">
              Explore Specific Topic
            </h3>
            <p className="text-gray-400 text-sm">
              Deep analysis of one area: sleep, stress, recovery, nutrition, glucose
            </p>
          </button>

          <button
            onClick={() => {
              setReportType('dynamic');
              setStep('options');
            }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-all text-left group"
            disabled={reports.length < 2}
          >
            <TrendingUp className="h-12 w-12 text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">
              View Dynamics
            </h3>
            <p className="text-gray-400 text-sm">
              Compare state with previous reports and see trends
            </p>
            {reports.length < 2 && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                Available after creating 2+ reports
              </p>
            )}
          </button>

          <button
            onClick={() => {
              setReportType('device_enhanced');
              setStep('options');
            }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 transition-all text-left group"
          >
            <Activity className="h-12 w-12 text-teal-600 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">
              Report with Device Data
            </h3>
            <p className="text-gray-400 text-sm">
              Complete analysis with automatic integration of metrics from your devices
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ReportViewProps {
  report: HealthReport;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

function ReportView({ report, onBack, onNavigate }: ReportViewProps) {
  const [showOpinion, setShowOpinion] = useState<'a' | 'b' | 'both'>('a');

  const handleExportPDF = () => {
    alert('PDF export will be implemented in the next version');
  };

  const handleDiscussWithAI = () => {
    onNavigate('member-zone');
  };

  const handleCreateGoal = () => {
    alert('Navigation to Goals System will be implemented in MODULE 06');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to Reports List
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {report.topic || 'State Report'}
              </h1>
              <p className="text-gray-400">
                {new Date(report.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                PDF
              </button>
              <button
                onClick={handleDiscussWithAI}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Discuss with AI
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-4">
              Brief Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {report.summary}
            </p>
          </section>

          {report.insights && Array.isArray(report.insights) && report.insights.length > 0 && (
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4">
                Key Insights
              </h2>
              <ul className="space-y-3">
                {report.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-orange-500 text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-4">
              Detailed Analysis
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {report.analysis}
            </p>
          </section>

          {report.recommendations && Array.isArray(report.recommendations) && report.recommendations.length > 0 && (
            <section className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-bold text-white mb-4">
                Gentle Steps for Improvement
              </h2>
              <div className="space-y-4">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {report.second_opinion_a && report.second_opinion_b && (
            <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Second Opinion
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowOpinion('a')}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      showOpinion === 'a'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Opinion A
                  </button>
                  <button
                    onClick={() => setShowOpinion('b')}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      showOpinion === 'b'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Opinion B
                  </button>
                  <button
                    onClick={() => setShowOpinion('both')}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      showOpinion === 'both'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              {(showOpinion === 'a' || showOpinion === 'both') && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-white mb-2">
                    Opinion A (Physiology)
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {report.second_opinion_a}
                  </p>
                </div>
              )}

              {(showOpinion === 'b' || showOpinion === 'both') && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">
                    Opinion B (Lifestyle)
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {report.second_opinion_b}
                  </p>
                </div>
              )}
            </section>
          )}

          <section className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-800">
            <h2 className="text-xl font-bold text-white mb-2">
              Want to turn recommendations into a plan?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              I'll help turn the report's findings into an action plan. I'll suggest gentle steps
              that realistically fit into your life.
            </p>
            <button
              onClick={handleCreateGoal}
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-semibold"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Create Plan
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
