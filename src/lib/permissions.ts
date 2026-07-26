/**
 * Permission engine.
 *
 * Pure, dependency-light layer that turns the role x permission matrix into
 * concrete `module.action` grants so the UI can gate navigation, pages and
 * individual console actions consistently across the whole app.
 */

import type { AppRole } from "./auth";
import { modules } from "./modules";

export type PermAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "export"
  | "configure";

export const PERM_ACTIONS: PermAction[] = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "export",
  "configure",
];

const READ_ONLY: PermAction[] = ["view"];
const CONTRIBUTOR: PermAction[] = ["view", "create", "edit", "export"];
const OPERATOR: PermAction[] = ["view", "create", "edit", "export", "approve"];
const FULL: PermAction[] = PERM_ACTIONS;

/** Virtual modules that are not part of the sidebar registry. */
const VIRTUAL_MODULES: { key: string; group: string }[] = [
  { key: "home", group: "Overview" },
  { key: "admin", group: "Master" },
  { key: "manager", group: "Overview" },
  { key: "accountant", group: "Finance" },
  { key: "account-manager", group: "Sales" },
  { key: "apps", group: "Overview" },
];

export function moduleKeyFromUrl(url: string): string {
  const clean = url.split("?")[0].split("#")[0];
  const seg = clean.replace(/^\/+/, "").split("/")[0];
  return seg || "home";
}

/** module key -> sidebar group */
export const moduleGroups: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const v of VIRTUAL_MODULES) map[v.key] = v.group;
  for (const m of modules) map[moduleKeyFromUrl(m.url)] = m.group;
  return map;
})();

export function groupOfModule(key: string): string | undefined {
  return moduleGroups[key];
}

export interface RolePolicy {
  /** Grant these actions on every module in the listed groups. */
  groups?: { groups: string[]; actions: PermAction[] }[];
  /** Per-module overrides (win over group rules). */
  modules?: Record<string, PermAction[]>;
  /** Modules that are fully hidden regardless of the rules above. */
  deny?: string[];
  /** Everything, everywhere. */
  wildcard?: boolean;
}

const ALL_GROUPS = Array.from(new Set(Object.values(moduleGroups)));

export const rolePolicies: Record<AppRole, RolePolicy> = {
  super_admin: { wildcard: true },
  admin: {
    groups: [{ groups: ALL_GROUPS, actions: FULL }],
    modules: { "super-admin": READ_ONLY },
  },
  manager: {
    groups: [
      { groups: ["Overview", "Sales", "Operations", "People", "Insights"], actions: OPERATOR },
      { groups: ["Partners", "Finance", "Platform", "System"], actions: READ_ONLY },
    ],
    modules: {
      approvals: OPERATOR,
      profile: CONTRIBUTOR,
      manager: READ_ONLY,
    },
    deny: ["super-admin", "admin", "accountant", "account-manager", "roles", "threats", "api-manager"],
  },
  accountant: {
    groups: [
      { groups: ["Finance"], actions: FULL },
      { groups: ["Overview", "Insights"], actions: ["view", "export"] },
      { groups: ["Sales", "System"], actions: READ_ONLY },
    ],
    modules: {
      invoices: FULL,
      wallet: OPERATOR,
      accountant: READ_ONLY,
      profile: CONTRIBUTOR,
    },
    deny: ["super-admin", "admin", "manager", "account-manager", "roles", "hrm", "recruitment", "threats", "sessions", "devices", "api-manager"],
  },
  account_manager: {
    groups: [
      { groups: ["Sales", "Partners"], actions: OPERATOR },
      { groups: ["Overview", "Insights"], actions: ["view", "export"] },
      { groups: ["Platform", "System"], actions: READ_ONLY },
    ],
    modules: {
      "account-manager": READ_ONLY,
      profile: CONTRIBUTOR,
    },
    deny: ["super-admin", "admin", "manager", "accountant", "roles", "hrm", "recruitment", "threats", "sessions", "devices", "api-manager", "audit", "trail"],
  },
  user: {
    groups: [{ groups: ["Overview"], actions: READ_ONLY }],
    modules: {
      profile: CONTRIBUTOR,
      settings: READ_ONLY,
      notifications: READ_ONLY,
      messaging: CONTRIBUTOR,
      knowledge: READ_ONLY,
      support: CONTRIBUTOR,
      achievements: READ_ONLY,
      leaderboard: READ_ONLY,
      wallet: READ_ONLY,
      theme: READ_ONLY,
    },
    deny: ["super-admin", "admin", "manager", "accountant", "account-manager", "roles", "audit", "trail", "threats", "sessions", "devices", "api-manager"],
  },
};

export const permissionId = (moduleKey: string, action: PermAction) => `${moduleKey}.${action}`;

/** Expand a role policy into a concrete grant set. */
export function grantsForRole(role: AppRole): Set<string> {
  const policy = rolePolicies[role] ?? rolePolicies.user;
  const grants = new Set<string>();
  const keys = Object.keys(moduleGroups);

  if (policy.wildcard) {
    for (const key of keys) for (const a of PERM_ACTIONS) grants.add(permissionId(key, a));
    return grants;
  }

  for (const key of keys) {
    const group = moduleGroups[key];
    const actions = new Set<PermAction>();
    for (const rule of policy.groups ?? []) {
      if (rule.groups.includes(group)) rule.actions.forEach((a) => actions.add(a));
    }
    const override = policy.modules?.[key];
    if (override) {
      actions.clear();
      override.forEach((a) => actions.add(a));
    }
    if (policy.deny?.includes(key)) actions.clear();
    for (const a of actions) grants.add(permissionId(key, a));
  }
  return grants;
}

const cache = new Map<AppRole, Set<string>>();
function cachedGrants(role: AppRole): Set<string> {
  let g = cache.get(role);
  if (!g) {
    g = grantsForRole(role);
    cache.set(role, g);
  }
  return g;
}

/** Union of grants across all of a user's roles. */
export function grantsForRoles(roles: AppRole[]): Set<string> {
  const out = new Set<string>();
  for (const r of roles) for (const g of cachedGrants(r)) out.add(g);
  return out;
}

/**
 * `permission` may be a full id ("crm.edit"), a wildcard ("crm.*" / "*.export")
 * or a bare module key ("crm", implying `.view`).
 */
export function can(roles: AppRole[], permission: string): boolean {
  const grants = grantsForRoles(roles);
  const perm = permission.includes(".") ? permission : `${permission}.view`;
  if (grants.has(perm)) return true;
  const [modKey, action] = perm.split(".");
  if (action === "*") {
    for (const g of grants) if (g.startsWith(`${modKey}.`)) return true;
    return false;
  }
  if (modKey === "*") {
    for (const g of grants) if (g.endsWith(`.${action}`)) return true;
    return false;
  }
  return false;
}

export function canAccessModule(roles: AppRole[], url: string): boolean {
  return can(roles, permissionId(moduleKeyFromUrl(url), "view"));
}

export function actionsForModule(roles: AppRole[], moduleKeyOrUrl: string): PermAction[] {
  const key = moduleKeyOrUrl.startsWith("/") ? moduleKeyFromUrl(moduleKeyOrUrl) : moduleKeyOrUrl;
  const grants = grantsForRoles(roles);
  return PERM_ACTIONS.filter((a) => grants.has(permissionId(key, a)));
}

export function allowedModules(roles: AppRole[]) {
  return modules.filter((m) => canAccessModule(roles, m.url));
}

export const __test = { cachedGrants, ALL_GROUPS };
