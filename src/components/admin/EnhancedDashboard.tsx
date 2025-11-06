import { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  FileText,
  Bell,
  Eye,
  MousePointerClick,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalReports: number;
  recentReports: number;
  totalOpinions: number;
  pendingOpinions: number;
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  conversionRate: number;
  totalErrors: number;
  criticalErrors: number;
}

export default function EnhancedDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchDashboardMetrics();
  }, [timeRange]);

  async function fetchDashboardMetrics() {
    setLoading(true);
    try {
      const now = new Date();
      const ranges = {
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      };
      const startDate = ranges[timeRange];

      const [
        { count: totalUsers },
        { count: activeUsers },
        { data: subscriptions },
        { count: totalReports },
        { count: recentReports },
        { count: totalOpinions },
        { count: pendingOpinions },
        { data: analytics },
        { count: totalErrors },
        { count: criticalErrors },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in_at', startDate.toISOString()),
        supabase
          .from('subscriptions')
          .select('price')
          .in('status', ['active', 'trialing']),
        supabase.from('reports').select('*', { count: 'exact', head: true }),
        supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString()),
        supabase.from('second_opinions').select('*', { count: 'exact', head: true }),
        supabase
          .from('second_opinions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('analytics_events')
          .select('event_type, event_data')
          .gte('created_at', startDate.toISOString()),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }),
        supabase
          .from('error_logs')
          .select('*', { count: 'exact', head: true })
          .eq('severity', 'critical')
          .gte('created_at', startDate.toISOString()),
      ]);

      const totalRevenue = subscriptions?.reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;
      const pageViews = analytics?.filter((e) => e.event_type === 'page_view').length || 0;
      const uniqueVisitors = new Set(
        analytics?.map((e) => e.event_data?.user_id).filter(Boolean)
      ).size;

      const sessions = analytics?.filter((e) => e.event_type === 'session_start') || [];
      const avgSessionDuration =
        sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.event_data?.duration || 0), 0) /
            sessions.length
          : 0;

      const conversions = analytics?.filter((e) => e.event_type === 'sign_up').length || 0;
      const conversionRate = pageViews > 0 ? (conversions / pageViews) * 100 : 0;

      setMetrics({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalRevenue,
        monthlyRevenue: totalRevenue,
        totalReports: totalReports || 0,
        recentReports: recentReports || 0,
        totalOpinions: totalOpinions || 0,
        pendingOpinions: pendingOpinions || 0,
        pageViews,
        uniqueVisitors,
        avgSessionDuration,
        conversionRate,
        totalErrors: totalErrors || 0,
        criticalErrors: criticalErrors || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Failed to load dashboard metrics
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      subtitle: `${metrics.activeUsers} active`,
      icon: Users,
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      subtitle: 'Monthly recurring',
      icon: DollarSign,
      color: 'green',
      trend: '+23%',
    },
    {
      title: 'Reports',
      value: metrics.totalReports.toLocaleString(),
      subtitle: `${metrics.recentReports} this period`,
      icon: FileText,
      color: 'purple',
      trend: '+8%',
    },
    {
      title: 'Second Opinions',
      value: metrics.totalOpinions.toLocaleString(),
      subtitle: `${metrics.pendingOpinions} pending`,
      icon: Activity,
      color: 'orange',
      trend: '+15%',
    },
    {
      title: 'Page Views',
      value: metrics.pageViews.toLocaleString(),
      subtitle: `${metrics.uniqueVisitors} visitors`,
      icon: Eye,
      color: 'teal',
      trend: '+18%',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(2)}%`,
      subtitle: 'Sign-ups / Views',
      icon: TrendingUp,
      color: 'indigo',
      trend: '+5%',
    },
    {
      title: 'Avg Session',
      value: `${Math.round(metrics.avgSessionDuration / 60)}m`,
      subtitle: 'Duration',
      icon: Clock,
      color: 'pink',
      trend: '+2%',
    },
    {
      title: 'Errors',
      value: metrics.totalErrors.toLocaleString(),
      subtitle: `${metrics.criticalErrors} critical`,
      icon: AlertTriangle,
      color: 'red',
      trend: '-10%',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <div className="flex gap-2">
          {(['24h', '7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${colorClasses[card.color]}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  card.trend.startsWith('+')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {card.trend}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
