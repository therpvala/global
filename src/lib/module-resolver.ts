/**
 * Module route resolution.
 *
 * Guarantees that any direct URL for a registered module opens the correct
 * enterprise workspace, even when the module is not currently rendered in the
 * sidebar (hidden by permissions, search filter, or a collapsed group) or when
 * the user typed a legacy / alias / sub-route path.
 */

import { modules, type ModuleItem } from "./modules";

/** Legacy + convenience paths that should land on a canonical module URL. */
export const MODULE_ALIASES: Record<string, string> = {
  "/cp": "/cp/home",
  "/control-panel": "/cp/home",
  "/controlpanel": "/cp/home",
  "/boss": "/cp/boss",
  "/boss-dashboard": "/cp/boss",
  "/ceo": "/cp/ceo",
  "/vala-ai": "/cp/vala-ai",
  "/server-manager": "/cp/server-manager",
  "/rd": "/rnd",
  "/r-and-d": "/rnd",
  "/research": "/rnd",
  "/research-and-development": "/rnd",
  "/innovation": "/rnd/pipeline",
};

export function normalizeModulePath(input: string): string {
  let path = (input ?? "").trim();
  try {
    path = decodeURIComponent(path);
  } catch {}
  path = path.split("?")[0].split("#")[0];
  path = "/" + path.replace(/^\/+/, "");
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path.toLowerCase();
}

const byUrl: Map<string, ModuleItem> = new Map(
  modules.map((m) => [normalizeModulePath(m.url), m]),
);

/** last path segment -> module (first registration wins) */
const bySlug: Map<string, ModuleItem> = (() => {
  const map = new Map<string, ModuleItem>();
  for (const m of modules) {
    const slug = normalizeModulePath(m.url).split("/").filter(Boolean).pop();
    if (slug && !map.has(slug)) map.set(slug, m);
  }
  return map;
})();

export type ModuleResolution =
  | { status: "exact"; path: string; module: ModuleItem }
  /** deep link below a module (e.g. /crm/leads/42) — render that workspace */
  | { status: "nested"; path: string; module: ModuleItem }
  /** known-but-not-canonical path — router should redirect to `target` */
  | { status: "redirect"; path: string; module: ModuleItem | null; target: string; reason: string }
  | { status: "unknown"; path: string; module: null };

/**
 * Resolve any incoming path to a registered module.
 * Longest-prefix wins, so `/rnd/pipeline` never gets swallowed by `/rnd`.
 */
export function resolveModulePath(input: string): ModuleResolution {
  const raw = (input ?? "").trim();
  const path = normalizeModulePath(raw);

  // 1. Canonical exact match.
  const exact = byUrl.get(path);
  if (exact) {
    if (raw !== exact.url) {
      return {
        status: "redirect",
        path,
        module: exact,
        target: exact.url,
        reason: "Normalized path (casing, trailing slash or duplicate separators)",
      };
    }
    return { status: "exact", path, module: exact };
  }

  // 2. Alias table.
  const alias = MODULE_ALIASES[path];
  if (alias) {
    return {
      status: "redirect",
      path,
      module: byUrl.get(normalizeModulePath(alias)) ?? null,
      target: alias,
      reason: "Alias for a canonical module route",
    };
  }

  // 3. Deep link below a registered module — longest prefix wins.
  let best: ModuleItem | null = null;
  let bestLen = 0;
  for (const [url, m] of byUrl) {
    if (path.startsWith(url + "/") && url.length > bestLen) {
      best = m;
      bestLen = url.length;
    }
  }
  if (best) return { status: "nested", path, module: best };

  // 4. Slug fallback: /pipeline -> /rnd/pipeline.
  const slug = path.split("/").filter(Boolean).pop();
  const slugHit = slug ? bySlug.get(slug) : undefined;
  if (slugHit) {
    return {
      status: "redirect",
      path,
      module: slugHit,
      target: slugHit.url,
      reason: `Matched module slug "${slug}"`,
    };
  }

  return { status: "unknown", path, module: null };
}

/** Convenience: the module a path should render, regardless of resolution kind. */
export function moduleForPath(input: string): ModuleItem | null {
  return resolveModulePath(input).module;
}
