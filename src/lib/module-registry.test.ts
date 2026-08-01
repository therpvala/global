import { describe, expect, it } from "vitest";
import { modules } from "./modules";
import { resolveModulePath, normalizeModulePath, MODULE_ALIASES } from "./module-resolver";
import { explainModule, visibleModulesForRoles, visibilitySummary } from "./sidebar-debug";
import type { AppRole } from "./auth";

const bossModules = modules.filter((m) => m.group.startsWith("Control Panel"));
const rndModules = modules.filter((m) => m.group === "R&D");
const urls = (list: { url: string }[]) => list.map((m) => m.url);

describe("registry integrity", () => {
  it("registers every Control Panel grade and the R&D department", () => {
    expect(bossModules.length).toBeGreaterThanOrEqual(30);
    expect(rndModules.length).toBeGreaterThanOrEqual(13);
    for (const g of [
      "Control Panel · Command",
      "Control Panel · Delivery",
      "Control Panel · Growth",
      "Control Panel · Network",
      "Control Panel · Regions",
      "Control Panel · Corporate",
      "Control Panel · Portals",
      "Control Panel · Core",
    ]) {
      expect(bossModules.some((m) => m.group === g)).toBe(true);
    }
    expect(urls(bossModules)).toContain("/cp/boss");
    expect(urls(rndModules)).toContain("/rnd");
  });

  it("has unique, normalized urls", () => {
    const seen = new Set<string>();
    for (const m of modules) {
      const n = normalizeModulePath(m.url);
      expect(n, `${m.url} is not canonical`).toBe(m.url);
      expect(seen.has(n), `duplicate url ${n}`).toBe(false);
      seen.add(n);
    }
  });
});

describe("direct route resolution", () => {
  it("resolves every registered module exactly", () => {
    for (const m of modules) {
      const r = resolveModulePath(m.url);
      expect(r.status, m.url).toBe("exact");
      expect(r.module?.url).toBe(m.url);
    }
  });

  it("prefers the longest prefix so nested modules are not swallowed", () => {
    expect(resolveModulePath("/rnd/pipeline").module?.url).toBe("/rnd/pipeline");
    expect(resolveModulePath("/rnd/wallet").module?.url).toBe("/rnd/wallet");
    const deep = resolveModulePath("/rnd/pipeline/idea/42");
    expect(deep.status).toBe("nested");
    expect(deep.module?.url).toBe("/rnd/pipeline");
  });

  it("redirects aliases and non-canonical paths to the module route", () => {
    for (const [alias, target] of Object.entries(MODULE_ALIASES)) {
      const r = resolveModulePath(alias);
      expect(r.status, alias).toBe("redirect");
      if (r.status === "redirect") expect(r.target).toBe(target);
    }
    const trailing = resolveModulePath("/cp/boss/");
    expect(trailing.status).toBe("redirect");
    if (trailing.status === "redirect") expect(trailing.target).toBe("/cp/boss");

    const cased = resolveModulePath("/CP/Boss");
    expect(cased.status).toBe("redirect");
    if (cased.status === "redirect") expect(cased.target).toBe("/cp/boss");

    const query = resolveModulePath("/rnd/radar?tab=adopt");
    expect(query.module?.url).toBe("/rnd/radar");
  });

  it("returns unknown for unregistered paths", () => {
    expect(resolveModulePath("/definitely-not-a-module").status).toBe("unknown");
  });
});

describe("sidebar visibility per role", () => {
  const boss: AppRole[] = ["super_admin"];

  it("shows all Boss and R&D modules to super_admin and admin", () => {
    for (const roles of [boss, ["admin"] as AppRole[]]) {
      const visible = new Set(urls(visibleModulesForRoles(roles)));
      for (const m of [...bossModules, ...rndModules]) {
        expect(visible.has(m.url), `${roles[0]} should see ${m.url}`).toBe(true);
      }
    }
  });

  it("hides Boss and R&D modules from low-privilege roles", () => {
    for (const role of ["user", "accountant", "account_manager"] as AppRole[]) {
      const visible = new Set(urls(visibleModulesForRoles([role])));
      for (const m of [...bossModules, ...rndModules]) {
        expect(visible.has(m.url), `${role} should not see ${m.url}`).toBe(false);
      }
    }
  });

  it("explains why a module is shown or hidden", () => {
    const bossDash = modules.find((m) => m.url === "/cp/boss")!;
    const granted = explainModule(boss, bossDash);
    expect(granted.visible).toBe(true);
    expect(granted.code).toBe("granted");
    expect(granted.reason).toContain("super_admin");

    const denied = explainModule(["user"], bossDash);
    expect(denied.visible).toBe(false);
    expect(denied.code.startsWith("denied")).toBe(true);
    expect(denied.permission).toBe("cp.view");

    const filtered = explainModule(boss, bossDash, "zzzz-no-match");
    expect(filtered.code).toBe("filtered-by-search");
    expect(filtered.visible).toBe(false);
  });

  it("summarizes visibility counts", () => {
    const s = visibilitySummary(boss);
    expect(s.total).toBe(modules.length);
    expect(s.visible).toBe(modules.length);
    expect(visibilitySummary(["user"]).denied).toBeGreaterThan(0);
  });

  it("keeps direct routes working even when the sidebar hides the module", () => {
    const hidden = visibleModulesForRoles(["user"]);
    const hiddenUrls = urls(modules).filter((u) => !urls(hidden).includes(u));
    for (const u of hiddenUrls.slice(0, 20)) {
      expect(resolveModulePath(u).module?.url).toBe(u);
    }
  });
});
