import { supabase } from "./supabase";

const flagCache = new Map<string, { enabled: boolean; timestamp: number }>();
const CACHE_TTL = 60000;

export async function getFeatureFlag(flagKey: string): Promise<boolean> {
  const cached = flagCache.get(flagKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.enabled;
  }

  try {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("enabled")
      .eq("flag_key", flagKey)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    flagCache.set(flagKey, { enabled: data.enabled, timestamp: Date.now() });
    return data.enabled;
  } catch {
    return false;
  }
}

export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  try {
    const { data, error } = await supabase.from("feature_flags").select("flag_key, enabled");

    if (error || !data) {
      return {};
    }

    const flags: Record<string, boolean> = {};
    for (const flag of data) {
      flags[flag.flag_key] = flag.enabled;
      flagCache.set(flag.flag_key, { enabled: flag.enabled, timestamp: Date.now() });
    }

    return flags;
  } catch {
    return {};
  }
}

export async function setFeatureFlag(flagKey: string, enabled: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("feature_flags")
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq("flag_key", flagKey);

    if (error) {
      console.error("Failed to set feature flag:", error);
      return false;
    }

    flagCache.delete(flagKey);
    return true;
  } catch (error) {
    console.error("Feature flag update error:", error);
    return false;
  }
}

export function clearFlagCache(): void {
  flagCache.clear();
}

export const FeatureFlags = {
  AI_SECOND_OPINION: "ai.second_opinion",
  AI_HEALTH_ASSISTANT: "ai.health_assistant",
  DEVICES_INTEGRATION: "devices.integration",
  REPORTS_GENERATION: "reports.generation",
  KILLSWITCH_OPENAI: "killswitch.openai",
  KILLSWITCH_ANTHROPIC: "killswitch.anthropic",
} as const;

export async function isFeatureEnabled(flag: string): Promise<boolean> {
  const envOverride = import.meta.env[`VITE_FEATURE_${flag.toUpperCase().replace(/\./g, "_")}`];
  if (envOverride !== undefined) {
    return envOverride === "true" || envOverride === "1";
  }

  return await getFeatureFlag(flag);
}

export async function checkKillSwitch(service: "openai" | "anthropic"): Promise<boolean> {
  const killswitchKey = `killswitch.${service}`;
  const isKilled = await getFeatureFlag(killswitchKey);
  return !isKilled;
}

export function useFeatureFlag(flagKey: string, defaultValue: boolean = false): boolean {
  const cached = flagCache.get(flagKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.enabled;
  }

  return defaultValue;
}

export async function createFeatureFlag(
  flagKey: string,
  enabled: boolean,
  description?: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from("feature_flags").insert({
      flag_key: flagKey,
      enabled,
      description,
    });

    if (error) {
      console.error("Failed to create feature flag:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Feature flag creation error:", error);
    return false;
  }
}
