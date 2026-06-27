import type { AppRole } from "./auth";

/**
 * Per-role sidebar group visibility. "*" = all groups visible.
 * Keep groups in sync with src/lib/modules.ts.
 */
export const roleGroupVisibility: Record<AppRole, string[] | "*"> = {
  super_admin: "*",
  admin: "*",
  manager: [
    "Command Center", "Overview", "Sales", "Operations", "People",
    "Insights", "Revenue", "Back office", "Marketplace", "Account", "System",
  ],
  accountant: [
    "Command Center", "Overview", "Finance", "Sales", "Insights",
    "Back office", "Account", "System",
  ],
  account_manager: [
    "Command Center", "Overview", "Sales", "Partners", "Marketplace",
    "Revenue", "Account", "System",
  ],
  user: ["Command Center", "Overview", "Account", "System"],
};

export function isGroupVisibleForRole(group: string, role: AppRole): boolean {
  const v = roleGroupVisibility[role];
  if (v === "*") return true;
  return v.includes(group);
}