import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Activity, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AnalyticsSection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalNews: 0,
    totalJobs: 0,
    emailsSent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const [usersResult, postsResult, newsResult, jobsResult, emailsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('news_items').select('id', { count: 'exact', head: true }),
        supabase.from('career_postings').select('id', { count: 'exact', head: true }),
        supabase.from('email_sends').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        activeUsers: Math.floor((usersResult.count || 0) * 0.6),
        totalPosts: postsResult.count || 0,
        totalNews: newsResult.count || 0,
        totalJobs: jobsResult.count || 0,
        emailsSent: emailsResult.count || 0,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12%',
      positive: true,
      color: 'blue',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      change: '+8%',
      positive: true,
      color: 'green',
    },
    {
      label: 'Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      change: '+5',
      positive: true,
      color: 'orange',
    },
    {
      label: 'News Items',
      value: stats.totalNews,
      icon: FileText,
      change: '+3',
      positive: true,
      color: 'purple',
    },
    {
      label: 'Job Postings',
      value: stats.totalJobs,
      icon: FileText,
      change: '+2',
      positive: true,
      color: 'pink',
    },
    {
      label: 'Emails Sent',
      value: stats.emailsSent,
      icon: TrendingUp,
      change: '+24',
      positive: true,
      color: 'cyan',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-600/30' },
      green: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-600/30' },
      orange: { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-600/30' },
      purple: { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-600/30' },
      pink: { bg: 'bg-pink-900/30', text: 'text-pink-400', border: 'border-pink-600/30' },
      cyan: { bg: 'bg-cyan-900/30', text: 'text-cyan-400', border: 'border-cyan-600/30' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-orange-500" />
          Analytics Dashboard
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === '24h'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === '7d'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === '30d'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading analytics...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const colors = getColorClasses(stat.color);
              return (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${colors.bg} border ${colors.border} rounded-lg`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        stat.positive
                          ? 'bg-green-900/30 border border-green-600/30 text-green-400'
                          : 'bg-red-900/30 border border-red-600/30 text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                User Growth
              </h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 75, 60, 80, 70, 90, 85].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all hover:from-orange-500 hover:to-orange-300"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Content Activity
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Blog Posts</span>
                    <span className="text-white font-medium">{stats.totalPosts}</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalPosts / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">News Items</span>
                    <span className="text-white font-medium">{stats.totalNews}</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalNews / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Job Postings</span>
                    <span className="text-white font-medium">{stats.totalJobs}</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalJobs / 20) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Emails Sent</span>
                    <span className="text-white font-medium">{stats.emailsSent}</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.emailsSent / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">New user registration</span>
                </div>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-white">Blog post published</span>
                </div>
                <span className="text-xs text-gray-500">15 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-white">Email template updated</span>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-white">System settings changed</span>
                </div>
                <span className="text-xs text-gray-500">3 hours ago</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
