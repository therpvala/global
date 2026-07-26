import { describe, expect, it } from "vitest";
import {
  actionsForModule,
  allowedModules,
  can,
  canAccessModule,
  grantsForRole,
  moduleKeyFromUrl,
  permissionId,
  PERM_ACTIONS,
} from "./permissions";

describe("moduleKeyFromUrl", () => {
  it("takes the first path segment", () => {
    expect(moduleKeyFromUrl("/crm")).toBe("crm");
    expect(moduleKeyFromUrl("/crm/leads/42")).toBe("crm");
    expect(moduleKeyFromUrl("/")).toBe("home");
    expect(moduleKeyFromUrl("/roles?tab=matrix")).toBe("roles");
  });
});

describe("super_admin", () => {
  it("has every action on every module", () => {
    const grants = grantsForRole("super_admin");
    for (const a of PERM_ACTIONS) expect(grants.has(permissionId("crm", a))).toBe(true);
    expect(can(["super_admin"], "roles.delete")).toBe(true);
    expect(canAccessModule(["super_admin"], "/super-admin")).toBe(true);
  });
});

describe("admin", () => {
  it("runs the business but cannot mutate the super-admin console", () => {
    expect(can(["admin"], "crm.edit")).toBe(true);
    expect(can(["admin"], "roles.configure")).toBe(true);
    expect(can(["admin"], "super-admin.view")).toBe(true);
    expect(can(["admin"], "super-admin.configure")).toBe(false);
  });
});

describe("manager", () => {
  it("operates its own groups and is read-only elsewhere", () => {
    expect(can(["manager"], "crm.approve")).toBe(true);
    expect(can(["manager"], "accounting.view")).toBe(true);
    expect(can(["manager"], "accounting.edit")).toBe(false);
  });
  it("is denied privileged modules", () => {
    for (const m of ["/roles", "/super-admin", "/threats", "/api-manager"]) {
      expect(canAccessModule(["manager"], m)).toBe(false);
    }
  });
});

describe("accountant", () => {
  it("owns finance and can export insights", () => {
    expect(can(["accountant"], "accounting.delete")).toBe(true);
    expect(can(["accountant"], "invoices.configure")).toBe(true);
    expect(can(["accountant"], "analytics.export")).toBe(true);
  });
  it("cannot touch people or security modules", () => {
    expect(canAccessModule(["accountant"], "/hrm")).toBe(false);
    expect(canAccessModule(["accountant"], "/sessions")).toBe(false);
    expect(can(["accountant"], "crm.edit")).toBe(false);
  });
});

describe("account_manager", () => {
  it("works sales + partners, reads platform", () => {
    expect(can(["account_manager"], "crm.approve")).toBe(true);
    expect(can(["account_manager"], "resellers.edit")).toBe(true);
    expect(can(["account_manager"], "automation.view")).toBe(true);
    expect(can(["account_manager"], "automation.edit")).toBe(false);
    expect(canAccessModule(["account_manager"], "/audit")).toBe(false);
  });
});

describe("user", () => {
  it("only sees overview + personal modules", () => {
    expect(canAccessModule(["user"], "/dashboard")).toBe(true);
    expect(canAccessModule(["user"], "/profile")).toBe(true);
    expect(can(["user"], "profile.edit")).toBe(true);
    expect(canAccessModule(["user"], "/crm")).toBe(false);
    expect(canAccessModule(["user"], "/roles")).toBe(false);
    expect(can(["user"], "settings.configure")).toBe(false);
  });
});

describe("wildcards and unions", () => {
  it("resolves module and action wildcards", () => {
    expect(can(["user"], "crm.*")).toBe(false);
    expect(can(["accountant"], "accounting.*")).toBe(true);
    expect(can(["user"], "*.delete")).toBe(false);
    expect(can(["admin"], "*.delete")).toBe(true);
  });
  it("treats a bare module key as .view", () => {
    expect(can(["user"], "profile")).toBe(true);
    expect(can(["user"], "crm")).toBe(false);
  });
  it("unions grants across multiple roles", () => {
    expect(can(["user", "accountant"], "accounting.edit")).toBe(true);
    expect(can(["user"], "accounting.edit")).toBe(false);
  });
  it("denies unknown modules and empty role sets", () => {
    expect(canAccessModule(["admin"], "/does-not-exist")).toBe(false);
    expect(can([], "crm.view")).toBe(false);
  });
});

describe("derived helpers", () => {
  it("actionsForModule matches the grant set", () => {
    expect(actionsForModule(["accountant"], "/accounting")).toEqual(PERM_ACTIONS);
    expect(actionsForModule(["manager"], "accounting")).toEqual(["view"]);
    expect(actionsForModule(["user"], "/crm")).toEqual([]);
  });
  it("allowedModules narrows the sidebar per role", () => {
    const su = allowedModules(["super_admin"]).length;
    expect(allowedModules(["user"]).length).toBeLessThan(su);
    expect(allowedModules(["manager"]).length).toBeLessThan(su);
    expect(allowedModules(["user"]).every((m) => canAccessModule(["user"], m.url))).toBe(true);
  });
});
