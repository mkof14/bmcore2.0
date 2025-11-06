import { supabase } from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export async function getSessionFromRequest(req: Request): Promise<AuthSession | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email || "",
        role: user.user_metadata?.role,
      },
      accessToken: token,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request): Promise<AuthSession> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

export async function requireAdmin(req: Request): Promise<AuthSession> {
  const session = await requireAuth(req);

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    throw new Error("FORBIDDEN: Admin access required");
  }

  return session;
}

export function requireRole(role: string) {
  return async (req: Request): Promise<AuthSession> => {
    const session = await requireAuth(req);
    if (session.user.role !== role) {
      throw new Error(`FORBIDDEN: ${role} role required`);
    }
    return session;
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || "",
      role: user.user_metadata?.role,
    };
  } catch {
    return null;
  }
}

export async function requireCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
