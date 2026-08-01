/**
 * Sidebar debug engine: explains, per module, exactly why the current role set
 * sees (or does not see) an entry in the navigation.
 */

import type { AppRole } from "./auth";
import { modules, type ModuleItem } from "./modules";
import {
  can,
  moduleKeyFromUrl,
  permissionId,
  rolePolicies,
  moduleGroups,
  actionsForModule,
  type PermAction,
} from "./permissions";

export type VisibilityCode =
  | "granted"
  | "denied-by-deny-list"
  | "denied-no-grant"
  | "filtered-by-search";

export interface ModuleVisibility {
  module: ModuleItem;
  moduleKey: string;
  permission: string;
  group: string;
  visible: boolean;
  code: VisibilityCode;
  reason: string;
  /** roles that grant `<module>.view` */
  grantedBy: AppRole[];
  /** roles whose policy explicitly denies the module */
  deniedBy: AppRole[];
  actions: PermAction[];
}

export function explainModule(
  roles: AppRole[],
  module: ModuleItem,
  search = "",
): ModuleVisibility {
  const moduleKey = moduleKeyFromUrl(module.url);
  const permission = permissionId(moduleKey, "view");
  const group = moduleGroups[moduleKey] ?? module.group;
  const grantedBy = roles.filter((r) => can([r], permission));
  const deniedBy = roles.filter((r) => rolePolicies[r]?.deny?.includes(moduleKey));
  const allowed = grantedBy.length > 0;

  const needle = search.trim().toLowerCase();
  const matchesSearch =
    !needle ||
    module.title.toLowerCase().includes(needle) ||
    module.group.toLowerCase().includes(needle) ||
    module.desc.toLowerCase().includes(needle);

  let code: VisibilityCode;
  let reason: string;
  if (!allowed && deniedBy.length) {
    code = "denied-by-deny-list";
    reason = `Blocked by deny list on role${deniedBy.length > 1 ? "s" : ""}: ${deniedBy.join(", ")}`;
  } else if (!allowed) {
    code = "denied-no-grant";
    reason = `No role grants ${permission} (group "${group}" not covered by ${roles.join(", ") || "no roles"})`;
  } else if (!matchesSearch) {
    code = "filtered-by-search";
    reason = `Hidden by the sidebar filter "${search}"`;
  } else {
    code = "granted";
    reason = `${permission} granted by ${grantedBy.join(", ")}`;
  }

  return {
    module,
    moduleKey,
    permission,
    group,
    visible: code === "granted",
    code,
    reason,
    grantedBy,
    deniedBy,
    actions: actionsForModule(roles, moduleKey),
  };
}

export function explainAllModules(roles: AppRole[], search = ""): ModuleVisibility[] {
  return modules.map((m) => explainModule(roles, m, search));
}

/** Modules the sidebar should render for these roles (search-independent). */
export function visibleModulesForRoles(roles: AppRole[]): ModuleItem[] {
  return modules.filter((m) => explainModule(roles, m).visible);
}

export function visibilitySummary(roles: AppRole[], search = "") {
  const all = explainAllModules(roles, search);
  return {
    total: all.length,
    visible: all.filter((v) => v.visible).length,
    denied: all.filter((v) => v.code.startsWith("denied")).length,
    filtered: all.filter((v) => v.code === "filtered-by-search").length,
  };
}
