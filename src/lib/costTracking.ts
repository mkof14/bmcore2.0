import { supabase } from "./supabase";
import { logAuditEvent } from "./dataGovernance";

export interface UsageMetric {
  date: string;
  provider: string;
  service: string;
  usageCount: number;
  tokensUsed?: number;
  estimatedCostCents: number;
}

export async function trackUsage(
  provider: "openai" | "anthropic" | "gemini" | "stripe" | "supabase",
  service: string,
  options: {
    usageCount?: number;
    tokensUsed?: number;
    costCents?: number;
  } = {}
): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];

    await supabase.rpc("increment_usage_metric", {
      p_date: today,
      p_provider: provider,
      p_service: service,
      p_usage_count: options.usageCount || 1,
      p_tokens_used: options.tokensUsed || 0,
      p_cost_cents: options.costCents || 0,
    });
  } catch (error) {
    console.error("Failed to track usage:", error);
  }
}

export async function getDailyUsageMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<UsageMetric[]> {
  try {
    let query = supabase.from("daily_usage_metrics").select("*").order("date", { ascending: false });

    if (startDate) {
      query = query.gte("date", startDate.toISOString().split("T")[0]);
    }
    if (endDate) {
      query = query.lte("date", endDate.toISOString().split("T")[0]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to get usage metrics:", error);
      return [];
    }

    return (
      data?.map((row) => ({
        date: row.date,
        provider: row.provider,
        service: row.service,
        usageCount: row.usage_count,
        tokensUsed: row.tokens_used,
        estimatedCostCents: row.estimated_cost_cents,
      })) || []
    );
  } catch (error) {
    console.error("Get usage metrics error:", error);
    return [];
  }
}

export async function getTotalCostByProvider(days: number = 30): Promise<Record<string, number>> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await getDailyUsageMetrics(startDate);

    const costByProvider: Record<string, number> = {};

    for (const metric of metrics) {
      if (!costByProvider[metric.provider]) {
        costByProvider[metric.provider] = 0;
      }
      costByProvider[metric.provider] += metric.estimatedCostCents;
    }

    return costByProvider;
  } catch (error) {
    console.error("Get total cost error:", error);
    return {};
  }
}

export function estimateAICost(
  provider: "openai" | "anthropic" | "gemini",
  model: string,
  tokensUsed: number
): number {
  const costPer1kTokens: Record<string, number> = {
    "gpt-4": 3,
    "gpt-3.5-turbo": 0.2,
    "claude-3-opus": 1.5,
    "claude-3-sonnet": 0.3,
    "claude-3-haiku": 0.025,
    "gemini-pro": 0.05,
  };

  const cost = costPer1kTokens[model] || 1;
  return Math.ceil((tokensUsed / 1000) * cost * 100);
}

export async function trackAIUsage(
  provider: "openai" | "anthropic" | "gemini",
  model: string,
  tokensUsed: number
): Promise<void> {
  const costCents = estimateAICost(provider, model, tokensUsed);

  await trackUsage(provider, model, {
    usageCount: 1,
    tokensUsed,
    costCents,
  });

  await logAuditEvent({
    action: "ai_usage_tracked",
    entity: "ai_api",
    metadata: { provider, model, tokensUsed, costCents },
  });
}

export async function getMonthlyBudgetStatus(): Promise<{
  totalCostCents: number;
  budgetCents: number;
  percentUsed: number;
  breakdown: Record<string, number>;
}> {
  const monthlyBudgetCents = 10000;

  const costs = await getTotalCostByProvider(30);
  const totalCostCents = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

  return {
    totalCostCents,
    budgetCents: monthlyBudgetCents,
    percentUsed: (totalCostCents / monthlyBudgetCents) * 100,
    breakdown: costs,
  };
}

export async function checkBudgetAlert(): Promise<boolean> {
  const status = await getMonthlyBudgetStatus();

  if (status.percentUsed > 80) {
    await logAuditEvent({
      action: "budget_alert",
      entity: "system",
      metadata: {
        percentUsed: status.percentUsed,
        totalCostCents: status.totalCostCents,
      },
    });
    return true;
  }

  return false;
}
