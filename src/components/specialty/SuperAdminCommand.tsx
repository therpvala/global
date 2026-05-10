import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  Globe2,
  Network,
  Plus,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ActivityFeed,
  KpiStrip,
  MiniBarChart,
  SectionHeader,
  Sparkline,
  type ActivityItem,
  type Kpi,
} from "../enterprise";

const kpis: Kpi[] = [
  { label: "Tenants", value: "248", delta: "+12", tone: "up", spark: [4, 5, 6, 7, 8, 9, 10], hint: "across 14 regions" },
  { label: "Active users", value: "8,412", delta: "+4.2%", tone: "up", spark: [4, 5, 5, 6, 7, 8, 9] },
  { label: "MRR", value: "$184K", delta: "+9.1%", tone: "up", spark: [3, 4, 5, 6, 7, 8, 9] },
  { label: "Critical alerts", value: "3", delta: "-2", tone: "up", spark: [6, 5, 4, 4, 3, 3, 3], hint: "p95 < 200ms" },
];

const regions = [
  { name: "North America", load: 64, status: "healthy", users: "3,124", lat: "92ms" },
  { name: "Europe", load: 78, status: "healthy", users: "2,408", lat: "108ms" },
  { name: "APAC", load: 88, status: "warn", users: "1,902", lat: "184ms" },
  { name: "LATAM", load: 41, status: "healthy", users: "612", lat: "142ms" },
  { name: "MENA", load: 33, status: "healthy", users: "366", lat: "166ms" },
];

const incidents = [
  { sev: "P1", title: "APAC ingestion lag", region: "Singapore", age: "12m", status: "investigating" },
  { sev: "P3", title: "Stripe webhook retries", region: "Global", age: "44m", status: "monitoring" },
  { sev: "P4", title: "Search index drift", region: "EU-West", age: "2h", status: "mitigated" },
];

const services = [
  { name: "API Gateway", icon: Network, status: "ok", value: "182ms", spark: [6, 7, 6, 7, 6, 6, 5] },
  { name: "Postgres Primary", icon: Database, status: "ok", value: "98% cache", spark: [8, 8, 8, 9, 9, 9, 9] },
  { name: "Compute Pool", icon: Cpu, status: "ok", value: "64% load", spark: [4, 5, 6, 7, 7, 8, 7] },
  { name: "Object Storage", icon: Server, status: "ok", value: "2.4PB", spark: [3, 4, 4, 5, 5, 6, 6] },
  { name: "Auth (SSO)", icon: ShieldCheck, status: "ok", value: "0 errors", spark: [2, 2, 2, 1, 1, 1, 1] },
  { name: "AI Gateway", icon: Zap, status: "warn", value: "throttled 3%", spark: [3, 4, 5, 6, 7, 6, 5] },
];

const activity: ActivityItem[] = [
  { who: "auto-scaler", what: "added 4 nodes in", target: "ap-southeast-1", when: "2m", kind: "update" },
  { who: "Ava Chen", what: "approved tenant", target: "Northwind Co.", when: "14m", kind: "approve" },
  { who: "policy engine", what: "rotated keys for", target: "stripe-prod", when: "38m", kind: "update" },
  { who: "SOC", what: "flagged anomaly on", target: "tenant 4421", when: "1h", kind: "reject" },
  { who: "deploy", what: "shipped", target: "API v4.12 → prod", when: "3h", kind: "create" },
];

const sevTone: Record<string, string> = {
  P1: "border-destructive/40 text-destructive bg-destructive/10",
  P2: "border-destructive/40 text-destructive bg-destructive/5",
  P3: "border-warning/40 text-warning bg-warning/10",
  P4: "border-muted-foreground/30 text-muted-foreground bg-muted",
};

export function SuperAdminCommand() {
  return (
    <div className="space-y-5">
      {/* Command bar header */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div
          className="px-5 py-4 text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Global control
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  <Globe2 className="mr-1 h-3 w-3" />
                  14 regions
                </Badge>
              </div>
              <h1 className="mt-1.5 text-2xl font-bold">Command Center</h1>
              <p className="text-sm opacity-90">
                Master operating control across every tenant, branch, and module.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-96">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <Input
                  placeholder="Search tenants, services, regions…"
                  className="h-10 pl-9 bg-white/15 border-white/20 placeholder:text-white/70 text-white"
                />
              </div>
              <Button size="sm" variant="secondary">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Tenant
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
          {[
            { l: "All systems", v: "Operational", icon: CheckCircle2, tone: "text-success" },
            { l: "Uptime (30d)", v: "99.982%", icon: Activity, tone: "text-foreground" },
            { l: "Open P1/P2", v: "1", icon: ShieldAlert, tone: "text-destructive" },
            { l: "AI quota used", v: "62%", icon: Zap, tone: "text-warning" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.l} className="px-4 py-2.5 flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${s.tone}`} />
                <div>
                  <div className="text-[11px] text-muted-foreground">{s.l}</div>
                  <div className="text-sm font-semibold">{s.v}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <KpiStrip kpis={kpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Regions */}
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader
              title="Regional load"
              desc="Realtime utilization & latency"
              right={
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Open map
                </Button>
              }
            />
            <div className="mt-3 space-y-2">
              {regions.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground tabular-nums">
                        {r.users} users · {r.lat}
                      </div>
                    </div>
                    <Progress
                      value={r.load}
                      className={`mt-1.5 h-1.5 ${r.status === "warn" ? "[&>div]:bg-warning" : ""}`}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      r.status === "warn"
                        ? "border-warning/40 text-warning"
                        : "border-success/40 text-success"
                    }
                  >
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incidents */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader
              title="Active incidents"
              right={
                <Badge variant="outline" className="font-normal">
                  3 open
                </Badge>
              }
            />
            <ul className="mt-3 space-y-2">
              {incidents.map((i) => (
                <li
                  key={i.title}
                  className="flex items-start gap-2.5 rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <Badge variant="outline" className={`font-mono text-[10px] ${sevTone[i.sev]}`}>
                    {i.sev}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-tight">{i.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {i.region} · {i.age} · {i.status}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    Open
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Service grid */}
      <div>
        <SectionHeader title="Platform services" desc="Live health across the stack" />
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.name} className="border-border/60">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={`h-2 w-2 rounded-full ${s.status === "warn" ? "bg-warning" : "bg-success"}`}
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold truncate">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.value}</div>
                  <div className="mt-1.5">
                    <Sparkline data={s.spark} tone={s.status === "warn" ? "down" : "up"} width={120} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom row: throughput + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Global throughput" desc="Requests · last 7 days" />
            <div className="mt-3">
              <MiniBarChart
                data={[124, 168, 142, 196, 220, 248, 284]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              />
            </div>
          </CardContent>
        </Card>
        <ActivityFeed items={activity} />
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Tenants", icon: Building2, to: "/companies" },
          { label: "Users & RBAC", icon: Users, to: "/security" },
          { label: "Branches", icon: Network, to: "/branches" },
          { label: "Audit log", icon: AlertTriangle, to: "/audit" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to as any}
              className="group flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3 py-2.5 hover:border-primary/40 transition"
            >
              <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{s.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
