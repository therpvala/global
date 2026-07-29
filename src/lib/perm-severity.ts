/**
 * Permission audit severity + analytics.
 *
 * Derives a risk severity for every permission decision and rolls the trail up
 * into chartable series (by module, role, action and time bucket).
 */

import type { AppRole } from "./auth";
import type { PermEvent } from "./perm-audit";
import { groupOfModule, type PermAction } from "./permissions";

export type PermSeverity = "critical" | "high" | "medium" | "low";

export const SEVERITIES: PermSeverity[] = ["critical", "high", "medium", "low"];

const ACTION_WEIGHT: Record<string, number> = {
  delete: 4,
  configure: 4,
  approve: 3,
  edit: 3,
  create: 2,
  export: 2,
  view: 1,
};

/** Groups whose modules carry elevated blast radius. */
const SENSITIVE_GROUPS = new Set(["Security", "System", "Master", "Finance"]);

export function severityOf(event: Pick<PermEvent, "action" | "module" | "decision">): PermSeverity {
  let score = ACTION_WEIGHT[event.action] ?? 2;
  if (SENSITIVE_GROUPS.has(groupOfModule(event.module) ?? "")) score += 1;
  if (event.decision === "denied") score += 1;
  if (score >= 6) return "critical";
  if (score >= 4) return "high";
  if (score >= 3) return "medium";
  return "low";
}

export const severityToneClass: Record<PermSeverity, string> = {
  critical: "border-destructive/50 bg-destructive/15 text-destructive",
  high: "border-warning/50 bg-warning/15 text-warning",
  medium: "border-primary/40 bg-primary/10 text-primary",
  low: "border-border bg-muted text-muted-foreground",
};

export type TimeRange = "24h" | "7d" | "30d" | "all";

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

const RANGE_MS: Record<TimeRange, number> = {
  "24h": 24 * 3600_000,
  "7d": 7 * 24 * 3600_000,
  "30d": 30 * 24 * 3600_000,
  all: Number.POSITIVE_INFINITY,
};

export function withinRange(ts: string, range: TimeRange, now = Date.now()): boolean {
  if (range === "all") return true;
  return now - new Date(ts).getTime() <= RANGE_MS[range];
}

export interface CountRow {
  key: string;
  granted: number;
  denied: number;
  total: number;
}

function tally(events: PermEvent[], pick: (e: PermEvent) => string[]): CountRow[] {
  const map = new Map<string, CountRow>();
  for (const e of events) {
    for (const k of pick(e)) {
      const row = map.get(k) ?? { key: k, granted: 0, denied: 0, total: 0 };
      if (e.decision === "granted") row.granted++;
      else row.denied++;
      row.total++;
      map.set(k, row);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export const countByModule = (events: PermEvent[]) => tally(events, (e) => [e.module]);
export const countByAction = (events: PermEvent[]) => tally(events, (e) => [e.action as PermAction]);
export const countByRole = (events: PermEvent[]) =>
  tally(events, (e) => (e.roles.length ? (e.roles as AppRole[]).map(String) : ["none"]));
export const countBySeverity = (events: PermEvent[]) => tally(events, (e) => [severityOf(e)]);

/** Bucketed timeline: hourly for 24h, daily otherwise. */
export function timelineSeries(events: PermEvent[], range: TimeRange, now = Date.now()): CountRow[] {
  const hourly = range === "24h";
  const buckets = hourly ? 24 : range === "7d" ? 7 : 30;
  const step = hourly ? 3600_000 : 24 * 3600_000;
  const span = range === "all" ? 30 : buckets;
  const out: CountRow[] = [];
  const start = now - (span - 1) * step;
  for (let i = 0; i < span; i++) {
    const at = new Date(start + i * step);
    out.push({
      key: hourly
        ? `${String(at.getHours()).padStart(2, "0")}:00`
        : `${at.getMonth() + 1}/${at.getDate()}`,
      granted: 0,
      denied: 0,
      total: 0,
    });
  }
  for (const e of events) {
    const t = new Date(e.ts).getTime();
    const idx = Math.floor((t - start) / step);
    if (idx < 0 || idx >= out.length) continue;
    if (e.decision === "granted") out[idx].granted++;
    else out[idx].denied++;
    out[idx].total++;
  }
  return out;
}