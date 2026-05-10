import { type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ----------------------------- KPI ----------------------------- */
export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  tone?: "up" | "down" | "neutral";
  hint?: string;
  spark?: number[];
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const tone =
    kpi.tone === "up"
      ? "text-success"
      : kpi.tone === "down"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <Card className="border-border/60 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </div>
          {kpi.delta && (
            <span className={`inline-flex items-center gap-0.5 text-xs ${tone}`}>
              {kpi.tone === "down" ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
              {kpi.delta}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
          {kpi.spark && <Sparkline data={kpi.spark} tone={kpi.tone} />}
        </div>
        {kpi.hint && (
          <div className="mt-1.5 text-[11px] text-muted-foreground">{kpi.hint}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((k) => (
        <KpiCard key={k.label} kpi={k} />
      ))}
    </section>
  );
}

/* --------------------------- Sparkline -------------------------- */
export function Sparkline({
  data,
  tone = "up",
  width = 80,
  height = 28,
}: {
  data: number[];
  tone?: "up" | "down" | "neutral";
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  const stroke =
    tone === "down"
      ? "var(--destructive)"
      : tone === "neutral"
        ? "var(--muted-foreground)"
        : "var(--success)";
  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline fill="none" stroke={stroke} strokeWidth="1.75" points={points} />
    </svg>
  );
}

/* ------------------------- Section header ----------------------- */
export function SectionHeader({
  title,
  desc,
  right,
}: {
  title: string;
  desc?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

/* --------------------------- Filter bar ------------------------- */
export function FilterBar({
  placeholder = "Search records…",
  chips = [],
}: {
  placeholder?: string;
  chips?: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card p-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={placeholder} className="h-8 pl-8 bg-transparent border-0 focus-visible:ring-0" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <Badge
            key={c}
            variant="outline"
            className="h-6 cursor-pointer border-dashed font-normal hover:bg-accent"
          >
            <Filter className="mr-1 h-3 w-3" />
            {c}
          </Badge>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
          View
        </Button>
        <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
          Export
        </Button>
        <Button size="sm" className="h-8 px-3 text-xs">
          New
        </Button>
      </div>
    </div>
  );
}

/* --------------------------- Records ---------------------------- */
export interface Record {
  id: string;
  name: string;
  status: "active" | "pending" | "archived" | "draft" | "review";
  owner: string;
  updated: string;
  amount?: string;
  tag?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  archived: "bg-muted text-muted-foreground border-border",
  draft: "bg-muted text-muted-foreground border-border",
  review: "bg-primary/15 text-primary border-primary/30",
};

export function RecordsTable({ rows }: { rows: Record[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} className="cursor-pointer">
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[10px] font-bold text-accent-foreground">
                    {r.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-tight">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.id} {r.tag && `· ${r.tag}`}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`capitalize font-normal ${statusStyles[r.status]}`}>
                  {r.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-primary/15 text-primary">
                      {r.owner
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{r.owner}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{r.updated}</TableCell>
              <TableCell className="text-right tabular-nums text-sm font-medium">
                {r.amount ?? "—"}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ------------------------- Activity feed ------------------------ */
export interface ActivityItem {
  who: string;
  what: string;
  target?: string;
  when: string;
  kind?: "create" | "update" | "approve" | "reject" | "comment";
}

const activityKind: Record<string, { dot: string; icon: any }> = {
  create: { dot: "bg-primary", icon: ArrowUpRight },
  update: { dot: "bg-warning", icon: Clock },
  approve: { dot: "bg-success", icon: CheckCircle2 },
  reject: { dot: "bg-destructive", icon: XCircle },
  comment: { dot: "bg-muted-foreground", icon: Clock },
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="border-b border-border/60 px-4 py-2.5 text-sm font-semibold">
        Activity
      </div>
      <ul className="divide-y divide-border/60">
        {items.map((it, i) => {
          const meta = activityKind[it.kind ?? "update"];
          return (
            <li key={i} className="flex items-start gap-3 px-4 py-2.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className="font-medium">{it.who}</span>{" "}
                  <span className="text-muted-foreground">{it.what}</span>{" "}
                  {it.target && <span className="font-medium">{it.target}</span>}
                </div>
                <div className="text-[11px] text-muted-foreground">{it.when}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------- Approvals --------------------------- */
export interface Approval {
  id: string;
  title: string;
  requester: string;
  amount?: string;
  age: string;
  sla?: "ok" | "warn" | "breach";
}

export function ApprovalsList({ items }: { items: Approval[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <div className="text-sm font-semibold">Approvals queue</div>
        <Badge variant="secondary">{items.length} pending</Badge>
      </div>
      <ul className="divide-y divide-border/60">
        {items.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{a.title}</div>
              <div className="text-[11px] text-muted-foreground">
                {a.requester} · {a.age}
                {a.amount && ` · ${a.amount}`}
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                a.sla === "breach"
                  ? "border-destructive/40 text-destructive"
                  : a.sla === "warn"
                    ? "border-warning/40 text-warning"
                    : "border-success/40 text-success"
              }
            >
              SLA {a.sla ?? "ok"}
            </Badge>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
              Review
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------- Mini chart -------------------------- */
export function MiniBarChart({
  data,
  labels,
}: {
  data: number[];
  labels?: string[];
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-end gap-1.5 h-32">
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-gradient-to-t from-primary/40 to-primary"
              style={{ height: `${(v / max) * 100}%` }}
            />
            {labels?.[i] && (
              <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- Quick actions ------------------------ */
export function QuickActions({
  actions,
}: {
  actions: { label: string; hint?: string; icon: any }[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {actions.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.label}
            className="group flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-left hover:border-primary/40 hover:shadow-[var(--shadow-elegant)] transition"
          >
            <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{a.label}</div>
              {a.hint && (
                <div className="text-[10px] text-muted-foreground truncate">{a.hint}</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
