/**
 * Permission audit log.
 *
 * Lightweight client-side event store that records every permission decision
 * (granted / denied) taken by the guard primitives, plus simulator probes.
 * Persisted to localStorage so admins can review + export the trail.
 */

import type { AppRole } from "./auth";
import { moduleKeyFromUrl } from "./permissions";

export type PermDecision = "granted" | "denied";
export type PermSource = "page" | "action" | "navigation" | "simulator";

export interface PermEvent {
  id: string;
  ts: string;
  actor: string;
  roles: AppRole[];
  permission: string;
  module: string;
  action: string;
  decision: PermDecision;
  source: PermSource;
  detail?: string;
}

const KEY = "vala.perm.audit.v1";
const LIMIT = 800;

let events: PermEvent[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(events.slice(0, LIMIT)));
  } catch {}
}

function seed(): PermEvent[] {
  const base = Date.now();
  const rows: Array<[string, AppRole[], string, PermDecision, PermSource, string]> = [
    ["admin@vala.app", ["admin"], "roles.configure", "granted", "page", "Opened Identity Governance"],
    ["admin@vala.app", ["admin"], "super-admin.configure", "denied", "action", "Tried to edit master console"],
    ["nina@vala.app", ["manager"], "accounting.edit", "denied", "action", "Ledger entry blocked"],
    ["nina@vala.app", ["manager"], "crm.approve", "granted", "action", "Approved deal 4821"],
    ["omar@vala.app", ["accountant"], "invoices.export", "granted", "action", "Exported AR aging"],
    ["omar@vala.app", ["accountant"], "hrm.view", "denied", "navigation", "Sidebar module hidden"],
    ["lia@vala.app", ["account_manager"], "resellers.edit", "granted", "page", "Partner record updated"],
    ["lia@vala.app", ["account_manager"], "audit.view", "denied", "page", "Access restricted screen"],
    ["sam@vala.app", ["user"], "crm.view", "denied", "page", "Access restricted screen"],
    ["sam@vala.app", ["user"], "profile.edit", "granted", "action", "Updated profile details"],
  ];
  return rows.map(([actor, roles, permission, decision, source, detail], i) => {
    const [module, action] = permission.split(".");
    return {
      id: `seed-${i}`,
      ts: new Date(base - (i + 1) * 1000 * 60 * 17).toISOString(),
      actor,
      roles,
      permission,
      module,
      action,
      decision,
      source,
      detail,
    };
  });
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    events = raw ? (JSON.parse(raw) as PermEvent[]) : seed();
  } catch {
    events = seed();
  }
  if (!events.length) events = seed();
  persist();
  emit();
}

export function subscribePermEvents(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getPermEvents(): PermEvent[] {
  return events;
}

/** SSR snapshot — always empty so hydration stays stable. */
const EMPTY: PermEvent[] = [];
export function getPermEventsServer(): PermEvent[] {
  return EMPTY;
}

let seq = 0;

export function recordPermEvent(input: {
  actor: string;
  roles: AppRole[];
  permission: string;
  decision: PermDecision;
  source: PermSource;
  detail?: string;
}) {
  if (typeof window === "undefined") return;
  hydrate();
  const perm = input.permission.includes(".") ? input.permission : `${input.permission}.view`;
  const [module, action] = perm.split(".");
  const last = events[0];
  // Collapse identical back-to-back decisions (re-renders) within 2s.
  if (
    last &&
    last.permission === perm &&
    last.actor === input.actor &&
    last.decision === input.decision &&
    last.source === input.source &&
    Date.now() - new Date(last.ts).getTime() < 2000
  ) {
    return;
  }
  events = [
    {
      id: `evt-${Date.now()}-${seq++}`,
      ts: new Date().toISOString(),
      actor: input.actor,
      roles: input.roles,
      permission: perm,
      module: moduleKeyFromUrl(module),
      action,
      decision: input.decision,
      source: input.source,
      detail: input.detail,
    },
    ...events,
  ].slice(0, LIMIT);
  persist();
  emit();
}

export function clearPermEvents() {
  events = [];
  persist();
  emit();
}

export function permEventsToCsv(rows: PermEvent[]): string {
  const head = ["timestamp", "actor", "roles", "permission", "module", "action", "decision", "source", "detail"];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((r) =>
    [r.ts, r.actor, r.roles.join(" "), r.permission, r.module, r.action, r.decision, r.source, r.detail ?? ""]
      .map((v) => esc(String(v)))
      .join(","),
  );
  return [head.join(","), ...body].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}