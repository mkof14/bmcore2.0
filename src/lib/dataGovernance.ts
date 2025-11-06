import { supabase } from "./supabase";

export interface AuditEvent {
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const { error } = await supabase.rpc("log_audit_event", {
      p_action: event.action,
      p_entity: event.entity,
      p_entity_id: event.entityId || null,
      p_metadata: event.metadata || {},
    });

    if (error) {
      console.error("Failed to log audit event:", error);
    }
  } catch (err) {
    console.error("Audit logging error:", err);
  }
}

export interface PIIExportData {
  profile: any;
  healthData: any[];
  reports: any[];
  conversations: any[];
  deviceConnections: any[];
}

export async function exportUserData(userId: string): Promise<PIIExportData | null> {
  try {
    const [profile, healthData, reports, conversations, deviceConnections] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("health_data").select("*").eq("user_id", userId),
      supabase.from("reports").select("*").eq("user_id", userId),
      supabase.from("ai_conversations").select("*").eq("user_id", userId),
      supabase.from("device_connections").select("*").eq("user_id", userId),
    ]);

    await logAuditEvent({
      action: "export_data",
      entity: "user",
      entityId: userId,
      metadata: { recordCount: healthData.data?.length || 0 },
    });

    return {
      profile: profile.data,
      healthData: healthData.data || [],
      reports: reports.data || [],
      conversations: conversations.data || [],
      deviceConnections: deviceConnections.data || [],
    };
  } catch (error) {
    console.error("Failed to export user data:", error);
    return null;
  }
}

export async function deleteUserData(userId: string, hardDelete: boolean = false): Promise<boolean> {
  try {
    if (hardDelete) {
      await Promise.all([
        supabase.from("health_data").delete().eq("user_id", userId),
        supabase.from("reports").delete().eq("user_id", userId),
        supabase.from("ai_conversations").delete().eq("user_id", userId),
        supabase.from("device_connections").delete().eq("user_id", userId),
        supabase.from("user_subscriptions").delete().eq("user_id", userId),
        supabase.from("profiles").delete().eq("id", userId),
      ]);

      await logAuditEvent({
        action: "hard_delete_user",
        entity: "user",
        entityId: userId,
      });
    } else {
      await supabase
        .from("profiles")
        .update({
          deleted_at: new Date().toISOString(),
          email: `deleted_${userId}@biomathcore.com`,
          full_name: "[Deleted User]",
        })
        .eq("id", userId);

      await logAuditEvent({
        action: "soft_delete_user",
        entity: "user",
        entityId: userId,
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to delete user data:", error);
    return false;
  }
}

export async function cleanupOldData(retentionDays: number = 90): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const { count, error } = await supabase
      .from("analytics_events")
      .delete()
      .lt("created_at", cutoffDate.toISOString())
      .select("*", { count: "exact" });

    if (error) {
      console.error("Failed to cleanup old data:", error);
      return 0;
    }

    await logAuditEvent({
      action: "cleanup_old_data",
      entity: "analytics_events",
      metadata: { deletedCount: count || 0, retentionDays },
    });

    return count || 0;
  } catch (error) {
    console.error("Data cleanup error:", error);
    return 0;
  }
}

export function sanitizePII(data: any): any {
  const sensitiveFields = ["email", "phone", "ssn", "address", "full_name"];

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePII(item));
  }

  if (typeof data === "object" && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object") {
        sanitized[key] = sanitizePII(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return data;
}

export async function getAuditLog(
  filters?: {
    actorId?: string;
    action?: string;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
  },
  limit: number = 100
): Promise<any[]> {
  try {
    let query = supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (filters?.actorId) {
      query = query.eq("actor_id", filters.actorId);
    }
    if (filters?.action) {
      query = query.eq("action", filters.action);
    }
    if (filters?.entity) {
      query = query.eq("entity", filters.entity);
    }
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate.toISOString());
    }
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to get audit log:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Audit log retrieval error:", error);
    return [];
  }
}
