import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "accountant"
  | "account_manager"
  | "user";

export interface AuthUser {
  email: string;
  name: string;
}

export interface CloudAuthResult {
  ok: boolean;
  error?: string;
}

export interface AuthState {
  user: AuthUser | null;
  roles: AppRole[];
  isAuthenticated: boolean;
  primaryRole: AppRole;
  hasRole: (r: AppRole) => boolean;
  hasAnyRole: (rs: AppRole[]) => boolean;
  login: (email: string, roles?: AppRole[]) => void;
  logout: () => Promise<void>;
  setRoles: (roles: AppRole[]) => void;
  /** Real backend session (null when only the local workspace profile is active). */
  cloudUser: User | null;
  cloudSession: Session | null;
  cloudReady: boolean;
  signInWithPassword: (email: string, password: string) => Promise<CloudAuthResult>;
  signUpWithPassword: (email: string, password: string) => Promise<CloudAuthResult>;
}

const STORAGE_KEY = "vala.auth";

const AuthContext = createContext<AuthState | null>(null);

const defaultUser: AuthUser = { email: "admin@vala.app", name: "Admin" };
const defaultRoles: AppRole[] = ["admin"];

function load(): { user: AuthUser; roles: AppRole[] } {
  if (typeof window === "undefined") return { user: defaultUser, roles: defaultRoles };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: defaultUser, roles: defaultRoles };
}

function persist(state: { user: AuthUser | null; roles: AppRole[] }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(defaultUser);
  const [roles, setRolesState] = useState<AppRole[]>(defaultRoles);
  const [cloudSession, setCloudSession] = useState<Session | null>(null);
  const [cloudRoles, setCloudRoles] = useState<AppRole[]>([]);
  const [cloudReady, setCloudReady] = useState(false);

  useEffect(() => {
    const loaded = load();
    setUser(loaded.user);
    setRolesState(loaded.roles);
  }, []);

  // Bridge the real backend session on top of the local workspace profile.
  useEffect(() => {
    let active = true;

    const loadRoles = async (userId: string) => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (!active) return;
      setCloudRoles(((data ?? []) as { role: string }[]).map((r) => r.role as AppRole));
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setCloudSession(session);
      if (session?.user) void loadRoles(session.user.id);
      else setCloudRoles([]);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setCloudSession(data.session);
      setCloudReady(true);
      if (data.session?.user) void loadRoles(data.session.user.id);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => {
    const setRoles = (rs: AppRole[]) => {
      setRolesState(rs);
      persist({ user, roles: rs });
    };
    const effectiveRoles = Array.from(new Set([...roles, ...cloudRoles])) as AppRole[];
    const cloudUser = cloudSession?.user ?? null;
    return {
      user: cloudUser
        ? { email: cloudUser.email ?? user?.email ?? "", name: (cloudUser.email ?? "user").split("@")[0] }
        : user,
      roles: effectiveRoles,
      isAuthenticated: !!user || !!cloudUser,
      primaryRole: effectiveRoles[0] ?? "user",
      hasRole: (r) => effectiveRoles.includes(r),
      hasAnyRole: (rs) => rs.some((r) => effectiveRoles.includes(r)),
      login: (email, rs = ["admin"]) => {
        const u = { email, name: email.split("@")[0] };
        setUser(u);
        setRolesState(rs);
        persist({ user: u, roles: rs });
      },
      logout: async () => {
        setUser(null);
        setRolesState([]);
        persist({ user: null, roles: [] });
        await supabase.auth.signOut();
        setCloudSession(null);
        setCloudRoles([]);
      },
      setRoles,
      cloudUser,
      cloudSession,
      cloudReady,
      signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { ok: false, error: error.message } : { ok: true };
      },
      signUpWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    };
  }, [user, roles, cloudSession, cloudRoles, cloudReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
