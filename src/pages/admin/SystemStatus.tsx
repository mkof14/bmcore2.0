import { useEffect, useState } from "react";
import { Activity, Database, CreditCard, Brain, RefreshCw } from "lucide-react";

interface DepsStatus {
  ok: boolean;
  supabase: { ok: boolean; status?: number; reason?: string };
  stripe: { ok: boolean; reason?: string };
  ai: { ok: boolean; openai: boolean; anthropic: boolean; gemini: boolean };
  timestamp: string;
}

interface UptimeStatus {
  ok: boolean;
  status: string;
  timestamp: string;
  version: string;
  service: string;
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
  );
}

export default function SystemStatus() {
  const [deps, setDeps] = useState<DepsStatus | null>(null);
  const [uptime, setUptime] = useState<UptimeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const [depsRes, uptimeRes] = await Promise.all([
        fetch(`${supabaseUrl}/functions/v1/deps-check`).catch(() => null),
        fetch(`${supabaseUrl}/functions/v1/uptime`).catch(() => null),
      ]);

      if (depsRes?.ok) {
        const depsData = await depsRes.json();
        setDeps(depsData);
      }

      if (uptimeRes?.ok) {
        const uptimeData = await uptimeRes.json();
        setUptime(uptimeData);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
              <p className="text-sm text-gray-500">Overall system health</p>
            </div>
          </div>

          {uptime ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={uptime.ok} />
                  <span className="text-sm font-medium text-gray-900">
                    {uptime.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-mono text-gray-900">{uptime.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service</span>
                <span className="text-sm font-mono text-gray-900">{uptime.service}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading...</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Database</h2>
              <p className="text-sm text-gray-500">Supabase connection</p>
            </div>
          </div>

          {deps?.supabase ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connection</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={deps.supabase.ok} />
                  <span className="text-sm font-medium text-gray-900">
                    {deps.supabase.ok ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
              {deps.supabase.status && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status Code</span>
                  <span className="text-sm font-mono text-gray-900">
                    {deps.supabase.status}
                  </span>
                </div>
              )}
              {deps.supabase.reason && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reason</span>
                  <span className="text-sm text-red-600">{deps.supabase.reason}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading...</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
              <p className="text-sm text-gray-500">Stripe integration</p>
            </div>
          </div>

          {deps?.stripe ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={deps.stripe.ok} />
                  <span className="text-sm font-medium text-gray-900">
                    {deps.stripe.ok ? "Operational" : "Unavailable"}
                  </span>
                </div>
              </div>
              {deps.stripe.reason && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reason</span>
                  <span className="text-sm text-red-600">{deps.stripe.reason}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading...</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Services</h2>
              <p className="text-sm text-gray-500">LLM providers</p>
            </div>
          </div>

          {deps?.ai ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={deps.ai.ok} />
                  <span className="text-sm font-medium text-gray-900">
                    {deps.ai.ok ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">OpenAI</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={deps.ai.openai} />
                  <span className="text-sm font-medium text-gray-900">
                    {deps.ai.openai ? "Configured" : "Not configured"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Anthropic</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={deps.ai.anthropic} />
                  <span className="text-sm font-medium text-gray-900">
                    {deps.ai.anthropic ? "Configured" : "Not configured"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gemini</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={deps.ai.gemini} />
                  <span className="text-sm font-medium text-gray-900">
                    {deps.ai.gemini ? "Configured" : "Not configured"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading...</div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Dependencies Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dependencies Check</h3>
            <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-64">
              {deps ? JSON.stringify(deps, null, 2) : "Loading..."}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Uptime Status</h3>
            <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-64">
              {uptime ? JSON.stringify(uptime, null, 2) : "Loading..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
