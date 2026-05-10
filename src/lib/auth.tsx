import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

  useEffect(() => {
    const loaded = load();
    setUser(loaded.user);
    setRolesState(loaded.roles);
  }, []);

  const value = useMemo<AuthState>(() => {
    const setRoles = (rs: AppRole[]) => {
      setRolesState(rs);
      persist({ user, roles: rs });
    };
    return {
      user,
      roles,
      isAuthenticated: !!user,
      primaryRole: roles[0] ?? "user",
      hasRole: (r) => roles.includes(r),
      hasAnyRole: (rs) => rs.some((r) => roles.includes(r)),
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
      },
      setRoles,
    };
  }, [user, roles]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}