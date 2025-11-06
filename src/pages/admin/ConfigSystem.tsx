import { useEffect, useMemo, useState } from "react";
import { CONFIG_SECTIONS } from "@/config/configSchema";
import { computeCompletion } from "@/lib/envUtils";
import { Download } from "lucide-react";

type StatusPayload = {
  lock: boolean;
  ts: number;
  groups: {
    group: string;
    title: string;
    subtitle?: string;
    items: {
      key: string;
      label: string;
      group: string;
      required: boolean;
      scope: string;
      envTarget: string;
      present: boolean;
      ok: boolean;
    }[];
  }[];
};

function Pill({ ok, required }: { ok: boolean; required: boolean }) {
  const cls = ok
    ? "bg-emerald-100 text-emerald-700"
    : required
    ? "bg-red-100 text-red-700"
    : "bg-yellow-100 text-yellow-700";
  const text = ok ? "OK" : required ? "Missing" : "Optional";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{text}</span>;
}

export default function ConfigSystem() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = () => {
      const groups = CONFIG_SECTIONS.map(sec => {
        const items = sec.keys.map(k => {
          const val = import.meta.env[k.key];
          const present = Boolean(val);
          const ok = present && validateValue(val, k.validator);
          return {
            key: k.key,
            label: k.label,
            group: sec.group,
            required: k.required,
            scope: k.scope,
            envTarget: k.envTarget,
            present,
            ok
          };
        });
        return {
          group: sec.group,
          title: sec.title,
          subtitle: sec.subtitle,
          items
        };
      });

      const lock = import.meta.env.VITE_CONFIG_LOCK === "1";
      setData({ lock, ts: Date.now(), groups });
      setLoading(false);
    };

    fetchStatus();
  }, []);

  const completion = useMemo(() => (data ? computeCompletion(data.groups) : { total: 0, ok: 0, pct: 0 }), [data]);

  const lock = data?.lock ?? true;

  const filteredGroups = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    if (!s) return data.groups;
    return data.groups
      .map(g => ({
        ...g,
        items: g.items.filter(it => (it.key + it.label + g.group).toLowerCase().includes(s))
      }))
      .filter(g => g.items.length > 0);
  }, [data, q]);

  async function onSave(type: "env" | "csv") {
    const lines: string[] = [];

    if (type === "env") {
      CONFIG_SECTIONS.forEach(sec => {
        lines.push(`# ---- ${sec.title}`);
        sec.keys.forEach(k => {
          if (k.scope === "server_private") {
            lines.push(`# ${k.key}=   # set in Vercel (${k.envTarget})`);
          } else {
            const v = import.meta.env[k.key] || "";
            lines.push(`${k.key}=${v}`);
          }
        });
        lines.push("");
      });
      const content = lines.join("\n");
      downloadTextFile(content, ".env.generated");
    } else {
      const rows = [["key", "value", "environment"]];
      CONFIG_SECTIONS.forEach(sec => {
        sec.keys.forEach(k => {
          const v = import.meta.env[k.key] || "";
          const envs = k.envTarget === "both" ? ["Preview", "Production"] : [k.envTarget === "preview" ? "Preview" : "Production"];
          envs.forEach(e => rows.push([k.key, v, e]));
        });
      });
      const content = rows.map(r => r.join(",")).join("\n");
      downloadTextFile(content, "vercel-env.csv");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading configuration...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Failed to load configuration</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Config System (Vault)</h1>
          <p className="text-sm text-gray-600 mt-1">Status of keys · {new Date(data.ts).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave("env")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            .env
          </button>
          <button
            onClick={() => onSave("csv")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            vercel.csv
          </button>
        </div>
      </div>

      <div className="border rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-600 font-medium">Required coverage</div>
            <div className="text-4xl font-bold mt-2 text-gray-900">{completion.pct}%</div>
            <div className="text-sm text-gray-500 mt-1">
              {completion.ok}/{completion.total} OK
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 font-medium mb-2">Config Lock</div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                lock ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {lock ? "ON" : "OFF"}
            </span>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completion.pct}%` }}
          />
        </div>
      </div>

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search keys, labels, or groups..."
        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-6">
        {filteredGroups.map(g => (
          <section key={g.group} className="border rounded-2xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{g.title}</h2>
                {g.subtitle && <p className="text-sm text-gray-600 mt-1">{g.subtitle}</p>}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {g.items.filter(i => i.ok).length}/{g.items.length} OK
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {g.items.map(it => {
                const sec = CONFIG_SECTIONS.find(s => s.group === g.group)!;
                const schema = sec.keys.find(k => k.key === it.key)!;
                const editable = !lock && schema.scope !== "server_private";
                const currentValue = import.meta.env[schema.key] || "";

                return (
                  <div key={it.key} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{schema.label}</div>
                      <Pill ok={it.ok} required={it.required} />
                    </div>
                    <div className="text-xs text-gray-500 font-mono mb-2">{it.key}</div>
                    {schema.description && <div className="text-xs text-gray-600 mb-2">{schema.description}</div>}
                    {schema.example && <div className="text-xs text-gray-400 mb-2">Example: {schema.example}</div>}
                    <div className="mt-3">
                      {schema.scope === "server_private" ? (
                        <div className="text-xs text-gray-600 italic bg-white rounded-lg px-3 py-2 border">
                          Server-only secret. Set in Vercel/Bolt Env.
                        </div>
                      ) : (
                        <input
                          defaultValue={currentValue}
                          disabled={!editable}
                          placeholder={lock ? "Unlock to edit" : "Enter value"}
                          className={`w-full border rounded-lg px-3 py-2 text-sm font-mono ${
                            editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                          }`}
                        />
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-white border text-xs text-gray-600">
                        Scope: {schema.scope}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white border text-xs text-gray-600">
                        Env: {schema.envTarget}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 flex gap-3 shadow-lg">
        <button
          onClick={() => onSave("env")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          Save → .env
        </button>
        <button
          onClick={() => onSave("csv")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          Save → vercel.csv
        </button>
      </div>
    </div>
  );
}

function validateValue(
  value: string | undefined,
  rules?: { startsWith?: string; regex?: string; notContains?: string[] }
): boolean {
  if (!value) return false;
  if (rules?.startsWith && !value.startsWith(rules.startsWith)) return false;
  if (rules?.regex && !new RegExp(rules.regex).test(value)) return false;
  if (rules?.notContains && rules.notContains.some(s => value.includes(s))) return false;
  return true;
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
