import { useEffect, useMemo, useState } from "react";
import { KEY_SPECS, CATEGORIES, KeyCategory } from "@/config/secretKeys";
import { Key, CheckCircle, AlertCircle, Loader } from "lucide-react";

type StatusRow = {
  key: string;
  label: string;
  scope: "client_public" | "server_private" | "flag";
  envTarget: "preview" | "production" | "both";
  category: KeyCategory;
  company: string;
  example?: string;
  description?: string;
  required: boolean;
  status: { ok: boolean; local: boolean; vercel: { production: boolean; preview: boolean } };
};

export default function AllAPIKeysManager() {
  const [rows, setRows] = useState<StatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<KeyCategory | "all">("all");
  const lock = import.meta.env.VITE_CONFIG_LOCK === "1";

  async function load() {
    setLoading(true);
    try {
      const data = KEY_SPECS.map(spec => {
        const val = import.meta.env[spec.key];
        const present = Boolean(val);
        return {
          key: spec.key,
          label: spec.label,
          scope: spec.scope,
          envTarget: spec.envTarget,
          category: spec.category,
          company: spec.company,
          example: spec.example,
          description: spec.description,
          required: !!spec.required,
          status: {
            ok: present,
            local: present,
            vercel: { production: false, preview: false }
          }
        };
      });
      setRows(data);
    } catch (error) {
      console.error("Failed to load status:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let filtered = rows;
    if (activeCategory !== "all") {
      filtered = filtered.filter(r => r.category === activeCategory);
    }
    const s = q.trim().toLowerCase();
    if (s) {
      filtered = filtered.filter(r => (r.key + r.label + r.company).toLowerCase().includes(s));
    }
    return filtered;
  }, [rows, q, activeCategory]);

  const stats = useMemo(() => {
    const byCategory = CATEGORIES.map(cat => {
      const catRows = rows.filter(r => r.category === cat.id);
      const total = catRows.length;
      const applied = catRows.filter(r => r.status.ok).length;
      const required = catRows.filter(r => r.required).length;
      const requiredApplied = catRows.filter(r => r.required && r.status.ok).length;
      return { category: cat.id, total, applied, required, requiredApplied };
    });
    return byCategory;
  }, [rows]);

  async function applySecret(key: string, value: string, envTarget: "preview" | "production" | "both") {
    setBusy(key);
    setSuccessMsg(null);
    try {
      const response = await fetch("/api/admin/secrets-apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, value, env: envTarget })
      });

      if (response.ok) {
        const inputEl = document.getElementById(`inp-${key}`) as HTMLInputElement;
        if (inputEl) inputEl.value = "";
        setSuccessMsg(`${key} applied successfully`);
        setTimeout(() => setSuccessMsg(null), 3000);
        await load();
      } else {
        const errorText = await response.text();
        alert(`Failed to apply ${key}: ${errorText}`);
      }
    } catch (error) {
      alert(`Error applying ${key}: ${error}`);
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <aside className="w-80 flex-shrink-0 space-y-2">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">CATEGORIES</h3>
          <button
            onClick={() => setActiveCategory("all")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all mb-2 ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">All Services</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700">
                {rows.length}
              </span>
            </div>
          </button>
          {CATEGORIES.map(cat => {
            const catStat = stats.find(s => s.category === cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all mb-2 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium flex-1">{cat.label}</span>
                </div>
                <div className="text-xs opacity-75 ml-8">{cat.description}</div>
                {catStat && (
                  <div className="flex items-center gap-2 mt-2 ml-8">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {catStat.applied}/{catStat.total} applied
                    </span>
                    {catStat.required > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        {catStat.requiredApplied}/{catStat.required} required
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Key className="w-7 h-7" />
              API Keys Management (Secrets Bridge)
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Never stores secrets in DB. Forward-only to environment. Status fetched live.
            </p>
          </div>
          <div className="text-sm flex items-center gap-2">
            <span className="text-gray-400">Lock:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                lock ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              {lock ? "ON (read-only)" : "OFF (editable)"}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400">{successMsg}</span>
          </div>
        )}

        <div className="flex gap-3">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search keys, companies..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(r => {
            const isServer = r.scope === "server_private";
            const canEdit = !lock && isServer;
            const ok = r.status.ok;

            return (
              <div
                key={r.key}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-white text-lg">{r.label}</div>
                    </div>
                    <div className="text-xs text-blue-400 font-medium mb-1">{r.company}</div>
                    <div className="text-xs text-gray-500 font-mono">{r.key}</div>
                    {r.description && <div className="text-xs text-gray-400 mt-2">{r.description}</div>}
                    {r.example && <div className="text-xs text-gray-400 mt-1">Example: {r.example}</div>}
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                      ok
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : r.required
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {ok ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Applied
                      </span>
                    ) : r.required ? (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Missing
                      </span>
                    ) : (
                      "Optional"
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 text-xs">
                    Scope: {r.scope}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 text-xs">
                    Env: {r.envTarget}
                  </span>
                  {r.status.vercel.production && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                      Vercel: prod
                    </span>
                  )}
                  {r.status.vercel.preview && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                      Vercel: preview
                    </span>
                  )}
                  {r.status.local && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                      Local
                    </span>
                  )}
                </div>

                {isServer ? (
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder={lock ? "Unlock to apply" : "Enter secret"}
                      disabled={!canEdit || busy === r.key}
                      className={`w-full bg-gray-900/50 border rounded-lg px-3 py-2 text-white placeholder-gray-500 ${
                        canEdit && busy !== r.key
                          ? "border-gray-600 focus:border-blue-500 focus:outline-none"
                          : "border-gray-700 cursor-not-allowed opacity-50"
                      }`}
                      id={`inp-${r.key}`}
                    />
                    <div className="flex gap-2">
                      <select
                        id={`env-${r.key}`}
                        defaultValue={r.envTarget}
                        disabled={!canEdit || busy === r.key}
                        className={`bg-gray-900/50 border rounded-lg px-3 py-2 text-white text-sm ${
                          canEdit && busy !== r.key
                            ? "border-gray-600"
                            : "border-gray-700 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <option value="production">production</option>
                        <option value="preview">preview</option>
                        <option value="both">both</option>
                      </select>
                      <button
                        disabled={!canEdit || busy === r.key}
                        onClick={() => {
                          const inputEl = document.getElementById(`inp-${r.key}`) as HTMLInputElement;
                          const selectEl = document.getElementById(`env-${r.key}`) as HTMLSelectElement;
                          const value = inputEl.value;
                          const env = selectEl.value as "production" | "preview" | "both";
                          if (!value) {
                            alert("Enter value");
                            return;
                          }
                          applySecret(r.key, value, env);
                        }}
                        className={`flex-1 px-4 py-2 rounded-xl text-white font-medium transition-colors ${
                          busy === r.key
                            ? "bg-gray-600 cursor-not-allowed"
                            : canEdit
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                        }`}
                      >
                        {busy === r.key ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            Applying...
                          </span>
                        ) : (
                          "Apply (hide)"
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      Value is never displayed. On success UI shows "Applied" with green badge.
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">
                    Client/Flag keys managed via regular env and Config System. Secrets Bridge works only for
                    server_private.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
