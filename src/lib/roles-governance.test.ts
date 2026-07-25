import { describe, expect, it } from "vitest";
import {
  activeSodConflicts,
  assignmentsToCsv,
  createInitialState,
  filterRoles,
  grantKey,
  hasGrant,
  pendingRequests,
  permissionCountFor,
  reducer,
  type GovernanceState,
} from "./roles-governance";

const seed = () => createInitialState();

describe("roles-governance seed", () => {
  it("seeds every configured role and permission", () => {
    const s = seed();
    expect(s.roles.map((r) => r.id)).toEqual([
      "super_admin",
      "admin",
      "manager",
      "account_manager",
      "accountant",
      "support",
      "readonly",
    ]);
    expect(s.permissions.length).toBeGreaterThan(15);
  });

  it("super_admin owns every permission by default", () => {
    const s = seed();
    for (const p of s.permissions) expect(hasGrant(s, "super_admin", p.id)).toBe(true);
    expect(permissionCountFor(s, "super_admin")).toBe(s.permissions.length);
  });

  it("read-only only receives .read permissions", () => {
    const s = seed();
    for (const p of s.permissions) {
      expect(hasGrant(s, "readonly", p.id)).toBe(p.id.endsWith(".read"));
    }
  });

  it("support cannot issue refunds or unmask pii", () => {
    const s = seed();
    expect(hasGrant(s, "support", "refunds.issue")).toBe(false);
    expect(hasGrant(s, "support", "pii.unmask")).toBe(false);
  });
});

describe("role x permission matrix", () => {
  it("toggling a grant flips it and is idempotent under double toggle", () => {
    let s: GovernanceState = seed();
    const before = hasGrant(s, "manager", "refunds.issue");
    s = reducer(s, { type: "toggle_grant", roleId: "manager", permId: "refunds.issue" });
    expect(hasGrant(s, "manager", "refunds.issue")).toBe(!before);
    s = reducer(s, { type: "toggle_grant", roleId: "manager", permId: "refunds.issue" });
    expect(hasGrant(s, "manager", "refunds.issue")).toBe(before);
  });

  it("set_grant is explicit and does not depend on prior state", () => {
    let s = seed();
    s = reducer(s, { type: "set_grant", roleId: "support", permId: "audit.read", granted: true });
    s = reducer(s, { type: "set_grant", roleId: "support", permId: "audit.read", granted: true });
    expect(hasGrant(s, "support", "audit.read")).toBe(true);
    s = reducer(s, { type: "set_grant", roleId: "support", permId: "audit.read", granted: false });
    expect(hasGrant(s, "support", "audit.read")).toBe(false);
  });

  it("does not mutate the source state (immutable grants Set)", () => {
    const s = seed();
    const key = grantKey("manager", "refunds.issue");
    const before = s.grants.has(key);
    const next = reducer(s, { type: "toggle_grant", roleId: "manager", permId: "refunds.issue" });
    expect(s.grants.has(key)).toBe(before);
    expect(next.grants).not.toBe(s.grants);
  });
});

describe("role CRUD", () => {
  it("add_role appends a Custom role with a stable slug id", () => {
    let s = seed();
    s = reducer(s, { type: "add_role", role: { name: "Data Steward", scope: "Data", risk: "Medium" } });
    const r = s.roles.at(-1)!;
    expect(r.id).toBe("data_steward");
    expect(r.type).toBe("Custom");
    expect(r.users).toBe(0);
  });

  it("add_role rejects empty names and duplicate ids", () => {
    let s = seed();
    const before = s.roles.length;
    s = reducer(s, { type: "add_role", role: { name: "  ", risk: "Low" } });
    s = reducer(s, { type: "add_role", role: { name: "Admin", risk: "High" } }); // dup id "admin"
    expect(s.roles.length).toBe(before);
  });

  it("clone_role copies every grant from the source role", () => {
    let s = seed();
    s = reducer(s, { type: "clone_role", sourceId: "accountant", name: "Junior Accountant" });
    const cloneId = "junior_accountant";
    const clone = s.roles.find((r) => r.id === cloneId);
    expect(clone?.type).toBe("Custom");
    for (const p of s.permissions) {
      expect(hasGrant(s, cloneId, p.id)).toBe(hasGrant(s, "accountant", p.id));
    }
  });

  it("delete_role refuses system roles and cascades grants for custom roles", () => {
    let s = seed();
    const beforeAdmin = s.roles.length;
    s = reducer(s, { type: "delete_role", roleId: "admin" }); // system
    expect(s.roles.length).toBe(beforeAdmin);

    s = reducer(s, { type: "delete_role", roleId: "manager" });
    expect(s.roles.some((r) => r.id === "manager")).toBe(false);
    for (const key of s.grants) expect(key.startsWith("manager::")).toBe(false);
  });
});

describe("access request workflow", () => {
  it("approve moves the request out of the pending queue", () => {
    let s = seed();
    const initialPending = pendingRequests(s).length;
    s = reducer(s, { type: "decide_request", id: "REQ-4421", decision: "approve" });
    expect(pendingRequests(s).length).toBe(initialPending - 1);
    expect(s.requests.find((r) => r.id === "REQ-4421")?.status).toBe("approved");
  });

  it("deny transitions pending -> denied but does not touch already-decided rows", () => {
    let s = seed();
    s = reducer(s, { type: "decide_request", id: "REQ-4420", decision: "deny" });
    s = reducer(s, { type: "decide_request", id: "REQ-4418", decision: "deny" }); // already approved
    expect(s.requests.find((r) => r.id === "REQ-4420")?.status).toBe("denied");
    expect(s.requests.find((r) => r.id === "REQ-4418")?.status).toBe("approved");
  });
});

describe("SoD conflicts", () => {
  it("resolve marks the conflict resolved and zeroes affected users", () => {
    let s = seed();
    expect(activeSodConflicts(s).length).toBeGreaterThan(0);
    s = reducer(s, { type: "resolve_sod", id: "sod-2" });
    const c = s.sod.find((x) => x.id === "sod-2")!;
    expect(c.resolved).toBe(true);
    expect(c.users).toBe(0);
  });
});

describe("selectors", () => {
  it("filterRoles searches name, scope, risk and type", () => {
    const s = seed();
    expect(filterRoles(s.roles, "admin").map((r) => r.id)).toEqual(
      expect.arrayContaining(["super_admin", "admin"]),
    );
    expect(filterRoles(s.roles, "finance").map((r) => r.id)).toEqual(["accountant"]);
    expect(filterRoles(s.roles, "custom").every((r) => r.type === "Custom")).toBe(true);
  });

  it("assignmentsToCsv emits one row per granted permission", () => {
    const s = seed();
    const csv = assignmentsToCsv(s);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("role_id,role_name,permission_id,permission_category,sensitive");
    // header + at least one grant per non-empty role
    const dataRows = lines.length - 1;
    let expected = 0;
    for (const r of s.roles) expected += permissionCountFor(s, r.id);
    expect(dataRows).toBe(expected);
  });
});
