// Adapter over the real AuthContext (src/lib/auth) so imported market
// components can keep using `@/hooks/use-auth` unchanged.
import { useAuth as useRealAuth } from "@/lib/auth";

export function useAuth() {
  const a = useRealAuth();
  return {
    session: a.isAuthenticated ? { user: a.user } : null,
    user: a.user,
    loading: false,
    signOut: async () => {
      await a.logout();
    },
  };
}
