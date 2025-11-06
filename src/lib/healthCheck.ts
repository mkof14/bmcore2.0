import { supabase } from "./supabase";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
}

export interface DependencyStatus {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  responseTime?: number;
  error?: string;
  lastCheck: string;
}

export interface SystemHealth {
  overall: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  dependencies: DependencyStatus[];
}

const startTime = Date.now();

export async function getBasicHealth(): Promise<HealthStatus> {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: Date.now() - startTime,
  };
}

export async function checkDatabase(): Promise<DependencyStatus> {
  const start = Date.now();
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      return {
        name: "database",
        status: "unhealthy",
        error: error.message,
        lastCheck: new Date().toISOString(),
      };
    }

    return {
      name: "database",
      status: "healthy",
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: "database",
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastCheck: new Date().toISOString(),
    };
  }
}

export async function checkStripe(): Promise<DependencyStatus> {
  const start = Date.now();
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    return {
      name: "stripe",
      status: "degraded",
      error: "Stripe key not configured",
      lastCheck: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch("https://api.stripe.com/v1/balance", {
      headers: {
        Authorization: `Bearer ${stripeKey}`,
      },
    });

    if (!response.ok && response.status !== 401) {
      return {
        name: "stripe",
        status: "unhealthy",
        error: `HTTP ${response.status}`,
        lastCheck: new Date().toISOString(),
      };
    }

    return {
      name: "stripe",
      status: "healthy",
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: "stripe",
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Connection failed",
      lastCheck: new Date().toISOString(),
    };
  }
}

export async function checkSupabase(): Promise<DependencyStatus> {
  const start = Date.now();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (!supabaseUrl) {
    return {
      name: "supabase",
      status: "unhealthy",
      error: "Supabase URL not configured",
      lastCheck: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    });

    if (!response.ok) {
      return {
        name: "supabase",
        status: "degraded",
        error: `HTTP ${response.status}`,
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
      };
    }

    return {
      name: "supabase",
      status: "healthy",
      responseTime: Date.now() - start,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: "supabase",
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Connection failed",
      lastCheck: new Date().toISOString(),
    };
  }
}

export async function checkAllDependencies(): Promise<SystemHealth> {
  const dependencies = await Promise.all([
    checkDatabase(),
    checkSupabase(),
    checkStripe(),
  ]);

  const hasUnhealthy = dependencies.some((dep) => dep.status === "unhealthy");
  const hasDegraded = dependencies.some((dep) => dep.status === "degraded");

  let overall: "healthy" | "degraded" | "unhealthy" = "healthy";
  if (hasUnhealthy) {
    overall = "unhealthy";
  } else if (hasDegraded) {
    overall = "degraded";
  }

  return {
    overall,
    timestamp: new Date().toISOString(),
    dependencies,
  };
}

export function createHealthCheckEndpoint() {
  return async () => {
    const health = await getBasicHealth();
    return Response.json(health);
  };
}

export function createDependenciesEndpoint() {
  return async () => {
    const health = await checkAllDependencies();
    return Response.json(health);
  };
}
