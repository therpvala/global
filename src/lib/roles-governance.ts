/**
 * Pure state layer for the Roles & Governance console.
 *
 * Extracted so the UI can be dumb (render + dispatch) and the behaviour of
 * the role x permission matrix, role CRUD, access-request queue, and SoD
 * resolution is unit-testable without a DOM.
 */

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type RoleType = "System" | "Custom";

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  scope: string;
  users: number;
  risk: RiskLevel;
  updated: string;
  description?: string;
}

export interface Permission {
  id: string; // e.g. "invoices.write"
  category: string;
  sensitive?: boolean;
}

export type RequestStatus = "pending" | "approved" | "denied";

export interface AccessRequest {
  id: string;
  title: string;
  requester: string;
  status: RequestStatus;
  age: string;
  tag?: string;
}

export interface SodConflict {
  id: string;
  pair: string;
  users: number;
  severity: RiskLevel;
  resolved: boolean;
}

export interface GovernanceState {
  roles: Role[];
  permissions: Permission[];
  /** Set of `${roleId}::${permissionId}` grants. */
  grants: Set<string>;
  requests: AccessRequest[];
  sod: SodConflict[];
}

export const grantKey = (roleId: string, permId: string) => `${roleId}::${permId}`;

export function hasGrant(state: GovernanceState, roleId: string, permId: string) {
  return state.grants.has(grantKey(roleId, permId));
}

/* ------------------------------- seed ------------------------------- */

const seedRoles: Role[] = [
  { id: "super_admin", name: "Super Admin", type: "System", scope: "Global", users: 3, perms: 184 as unknown as never, risk: "Critical", updated: "2d" } as unknown as Role,
  { id: "admin", name: "Admin", type: "System", scope: "Workspace", users: 12, risk: "High", updated: "5d" },
  { id: "manager", name: "Manager", type: "Custom", scope: "Team", users: 48, risk: "Medium", updated: "1w" },
  { id: "account_manager", name: "Account Manager", type: "Custom", scope: "Customer", users: 22, risk: "Medium", updated: "2w" },
  { id: "accountant", name: "Accountant", type: "Custom", scope: "Finance", users: 8, risk: "High", updated: "3d" },
  { id: "support", name: "Support Agent", type: "Custom", scope: "Support", users: 31, risk: "Low", updated: "1d" },
  { id: "readonly", name: "Read-only", type: "System", scope: "Reports", users: 64, risk: "Low", updated: "1mo" },
].map((r) => ({
  id: r.id,
  name: r.name,
  type: r.type as RoleType,
  scope: r.scope,
  users: r.users,
  risk: r.risk as RiskLevel,
  updated: r.updated,
}));

const seedPermissions: Permission[] = [
  { id: "invoices.read", category: "Billing" },
  { id: "invoices.write", category: "Billing", sensitive: true },
  { id: "refunds.issue", category: "Billing", sensitive: true },
  { id: "payouts.manage", category: "Billing", sensitive: true },
  { id: "leads.read", category: "CRM" },
  { id: "leads.write", category: "CRM" },
  { id: "deals.close", category: "CRM" },
  { id: "contacts.export", category: "CRM", sensitive: true },
  { id: "employees.read", category: "HR" },
  { id: "payroll.run", category: "HR", sensitive: true },
  { id: "offers.send", category: "HR" },
  { id: "terminate", category: "HR", sensitive: true },
  { id: "users.invite", category: "Platform" },
  { id: "roles.assign", category: "Platform", sensitive: true },
  { id: "api-keys.create", category: "Platform", sensitive: true },
  { id: "audit.read", category: "Platform" },
  { id: "reports.read", category: "Data" },
  { id: "reports.export", category: "Data" },
  { id: "warehouse.query", category: "Data", sensitive: true },
  { id: "pii.unmask", category: "Data", sensitive: true },
];

/**
 * Deterministic seed grants so the matrix looks populated on first render
 * while still being fully mutable at runtime.
 */
function seedGrants(roles: Role[], perms: Permission[]): Set<string> {
  const grants = new Set<string>();
  for (const role of roles) {
    for (const perm of perms) {
      const critical = perm.sensitive === true;
      if (role.id === "super_admin") grants.add(grantKey(role.id, perm.id));
      else if (role.id === "admin" && !(critical && perm.id === "pii.unmask")) grants.add(grantKey(role.id, perm.id));
      else if (role.id === "manager" && perm.category !== "Billing" && !critical) grants.add(grantKey(role.id, perm.id));
      else if (role.id === "accountant" && (perm.category === "Billing" || perm.id === "reports.read")) grants.add(grantKey(role.id, perm.id));
      else if (role.id === "account_manager" && (perm.category === "CRM" || perm.id === "invoices.read")) grants.add(grantKey(role.id, perm.id));
      else if (role.id === "support" && (perm.id === "leads.read" || perm.id === "employees.read")) grants.add(grantKey(role.id, perm.id));
      else if (role.id === "readonly" && perm.id.endsWith(".read")) grants.add(grantKey(role.id, perm.id));
    }
  }
  return grants;
}

export function createInitialState(): GovernanceState {
  const roles = seedRoles.slice();
  const permissions = seedPermissions.slice();
  return {
    roles,
    permissions,
    grants: seedGrants(roles, permissions),
    requests: [
      { id: "REQ-4421", title: "Elevate to Finance Admin", requester: "Priya Shah", status: "pending", age: "18m", tag: "Justified" },
      { id: "REQ-4420", title: "Grant warehouse.query", requester: "Ravi Kumar", status: "pending", age: "42m", tag: "SoD check" },
      { id: "REQ-4418", title: "Add to Support Agent", requester: "Nia Adeyemi", status: "approved", age: "2h", tag: "Auto-approved" },
      { id: "REQ-4415", title: "Emergency break-glass", requester: "Ops · On-call", status: "pending", age: "5h", tag: "Time-bound 4h" },
    ],
    sod: [
      { id: "sod-1", pair: "Vendor create ↔ Payment approve", users: 2, severity: "High", resolved: false },
      { id: "sod-2", pair: "Journal post ↔ Journal approve", users: 1, severity: "Critical", resolved: false },
      { id: "sod-3", pair: "User invite ↔ Role assign", users: 4, severity: "Medium", resolved: false },
      { id: "sod-4", pair: "Refund issue ↔ Refund approve", users: 0, severity: "Low", resolved: false },
    ],
  };
}

/* ------------------------------ reducer ----------------------------- */

export type Action =
  | { type: "toggle_grant"; roleId: string; permId: string }
  | { type: "set_grant"; roleId: string; permId: string; granted: boolean }
  | { type: "add_role"; role: Omit<Role, "id" | "users" | "updated" | "type"> & Partial<Pick<Role, "id" | "users" | "updated" | "type">> }
  | { type: "clone_role"; sourceId: string; name: string }
  | { type: "delete_role"; roleId: string }
  | { type: "decide_request"; id: string; decision: "approve" | "deny" }
  | { type: "resolve_sod"; id: string };

export function reducer(state: GovernanceState, action: Action): GovernanceState {
  switch (action.type) {
    case "toggle_grant": {
      const key = grantKey(action.roleId, action.permId);
      const grants = new Set(state.grants);
      if (grants.has(key)) grants.delete(key);
      else grants.add(key);
      return { ...state, grants };
    }
    case "set_grant": {
      const key = grantKey(action.roleId, action.permId);
      const grants = new Set(state.grants);
      if (action.granted) grants.add(key);
      else grants.delete(key);
      return { ...state, grants };
    }
    case "add_role": {
      const name = action.role.name.trim();
      if (!name) return state;
      const id = (action.role.id ?? slug(name)).trim();
      if (!id || state.roles.some((r) => r.id === id)) return state;
      const role: Role = {
        id,
        name,
        type: action.role.type ?? "Custom",
        scope: action.role.scope ?? "Workspace",
        users: action.role.users ?? 0,
        risk: action.role.risk,
        updated: action.role.updated ?? "just now",
        description: action.role.description,
      };
      return { ...state, roles: [...state.roles, role] };
    }
    case "clone_role": {
      const source = state.roles.find((r) => r.id === action.sourceId);
      const name = action.name.trim();
      if (!source || !name) return state;
      const id = slug(name);
      if (state.roles.some((r) => r.id === id)) return state;
      const clone: Role = { ...source, id, name, type: "Custom", users: 0, updated: "just now" };
      const grants = new Set(state.grants);
      for (const perm of state.permissions) {
        if (state.grants.has(grantKey(source.id, perm.id))) grants.add(grantKey(id, perm.id));
      }
      return { ...state, roles: [...state.roles, clone], grants };
    }
    case "delete_role": {
      const role = state.roles.find((r) => r.id === action.roleId);
      if (!role || role.type === "System") return state; // system roles are immutable
      const grants = new Set<string>();
      for (const key of state.grants) {
        if (!key.startsWith(`${action.roleId}::`)) grants.add(key);
      }
      return { ...state, roles: state.roles.filter((r) => r.id !== action.roleId), grants };
    }
    case "decide_request": {
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.id && r.status === "pending"
            ? { ...r, status: action.decision === "approve" ? "approved" : "denied" }
            : r,
        ),
      };
    }
    case "resolve_sod": {
      return {
        ...state,
        sod: state.sod.map((s) => (s.id === action.id ? { ...s, resolved: true, users: 0 } : s)),
      };
    }
    default:
      return state;
  }
}

/* ----------------------------- selectors ---------------------------- */

export function filterRoles(roles: Role[], query: string): Role[] {
  const q = query.trim().toLowerCase();
  if (!q) return roles;
  return roles.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.scope.toLowerCase().includes(q) ||
      r.risk.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q),
  );
}

export function permissionCountFor(state: GovernanceState, roleId: string): number {
  let count = 0;
  for (const key of state.grants) if (key.startsWith(`${roleId}::`)) count += 1;
  return count;
}

export function pendingRequests(state: GovernanceState): AccessRequest[] {
  return state.requests.filter((r) => r.status === "pending");
}

export function activeSodConflicts(state: GovernanceState): SodConflict[] {
  return state.sod.filter((s) => !s.resolved);
}

export function assignmentsToCsv(state: GovernanceState): string {
  const header = "role_id,role_name,permission_id,permission_category,sensitive";
  const rows: string[] = [header];
  for (const role of state.roles) {
    for (const perm of state.permissions) {
      if (hasGrant(state, role.id, perm.id)) {
        rows.push([role.id, role.name, perm.id, perm.category, perm.sensitive ? "true" : "false"].join(","));
      }
    }
  }
  return rows.join("\n");
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export const __test = { slug, seedGrants };
