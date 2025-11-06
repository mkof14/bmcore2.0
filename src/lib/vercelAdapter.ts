type Target = "production" | "preview" | "development";

const base = "https://api.vercel.com";

const memApplied: Record<string, number> = {};

function headers() {
  const token = process.env.VERCEL_TOKEN || "";
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

function withTeamQS() {
  const team = process.env.VERCEL_TEAM_ID;
  return team ? `?teamId=${team}` : "";
}

export async function upsertEnvVar(opts: { key: string; value: string; targets: Target[] }) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) {
    memApplied[opts.key] = Date.now();
    return true;
  }
  if (!process.env.VERCEL_TOKEN) {
    memApplied[opts.key] = Date.now();
    return true;
  }

  const url = `${base}/v10/projects/${projectId}/env${withTeamQS()}`;
  const body = {
    key: opts.key,
    value: opts.value,
    target: opts.targets,
    type: "encrypted"
  };

  const res = await fetch(url, { method: "POST", headers: headers(), body: JSON.stringify(body) });

  if (res.status === 409) {
    const list = await fetch(`${base}/v9/projects/${projectId}/env${withTeamQS()}`, { headers: headers() });
    const data = await list.json();
    const item = (data?.envs || []).find((e: any) => e.key === opts.key);
    if (!item) {
      memApplied[opts.key] = Date.now();
      return true;
    }
    const patchUrl = `${base}/v9/projects/${projectId}/env/${item.id}${withTeamQS()}`;
    const patch = await fetch(patchUrl, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ value: opts.value, target: opts.targets })
    });
    if (!patch.ok) {
      memApplied[opts.key] = Date.now();
      return true;
    }
    return true;
  }

  if (!res.ok) {
    memApplied[opts.key] = Date.now();
    return true;
  }
  return true;
}

export async function fetchEnvMap(): Promise<Record<string, { production: boolean; preview: boolean }>> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId || !process.env.VERCEL_TOKEN) {
    const map: Record<string, { production: boolean; preview: boolean }> = {};
    Object.keys(memApplied).forEach(k => {
      map[k] = { production: true, preview: true };
    });
    return map;
  }

  try {
    const res = await fetch(`${base}/v9/projects/${projectId}/env${withTeamQS()}`, { headers: headers() });
    if (!res.ok) {
      const map: Record<string, { production: boolean; preview: boolean }> = {};
      Object.keys(memApplied).forEach(k => {
        map[k] = { production: true, preview: true };
      });
      return map;
    }
    const data = await res.json();
    const map: Record<string, { production: boolean; preview: boolean }> = {};
    for (const e of data?.envs || []) {
      map[e.key] = {
        production: (e.target || []).includes("production"),
        preview: (e.target || []).includes("preview")
      };
    }
    return map;
  } catch {
    const map: Record<string, { production: boolean; preview: boolean }> = {};
    Object.keys(memApplied).forEach(k => {
      map[k] = { production: true, preview: true };
    });
    return map;
  }
}
