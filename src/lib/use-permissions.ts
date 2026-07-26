import { useMemo } from "react";
import { useAuth } from "./auth";
import {
  actionsForModule,
  allowedModules,
  can as canWith,
  canAccessModule as canAccessModuleWith,
  moduleKeyFromUrl,
  type PermAction,
} from "./permissions";

export function usePermissions() {
  const { roles } = useAuth();
  return useMemo(
    () => ({
      roles,
      can: (permission: string) => canWith(roles, permission),
      canAccessModule: (url: string) => canAccessModuleWith(roles, url),
      actionsFor: (moduleKeyOrUrl: string) => actionsForModule(roles, moduleKeyOrUrl),
      allowedModules: () => allowedModules(roles),
      moduleKey: moduleKeyFromUrl,
    }),
    [roles],
  );
}

/** Convenience: `useCan("crm.edit")`. */
export function useCan(permission: string): boolean {
  const { can } = usePermissions();
  return can(permission);
}

/** Actions available to the current user on a module. */
export function useModuleActions(moduleKeyOrUrl: string): PermAction[] {
  const { actionsFor } = usePermissions();
  return actionsFor(moduleKeyOrUrl);
}
