/**
 * Specialty wave 5 — completes the role → premium dashboard mapping.
 * Each console reuses the existing enterprise primitives (KpiStrip, FilterBar,
 * RecordsTable, ActivityFeed, MiniBarChart, QuickActions) so we ship 30+
 * deep workspaces without duplicating UI systems.
 *
 * Inspirations (UX only — no copyrighted assets): Palantir, SAP, Portainer,
 * Hetzner, Plesk, Cloudflare, MongoDB Atlas, Datadog, GitLab, OpenAI,
 * New Relic, Veeam, Productboard, TestRail, n8n, Azure AI, LangChain,
 * Mirakl, Impact, Stripe, HubSpot, Apollo, Insider, SEMrush, Notion, Crisp,
 * Cloudways, Aspire, CreatorIQ, Oracle, Netsuite, Ironclad, Clio, Drata,
 * Monday, ClickUp, Jira SM, Elastic, Vercel, LinkedIn, Zendesk, Arc,
 * Raycast, Slack.
 */
import { type ComponentType, type ReactNode, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, Bell, Bot, Box, Brain, Briefcase,
  Building2, Check, ChevronRight, Clock, Code2, Compass, Cpu, CreditCard,
  Crown, Database, DollarSign, Download, FileBarChart, FileText, Folder,
  GitBranch, GitMerge, Globe, Globe2, HardDrive, KanbanSquare, KeyRound,
  Key, Layers, LifeBuoy, Link2, LogOut, MapPin, Megaphone, MessageSquare,
  Network, Package, Play, Plus, Power, Repeat, Rocket, Scale, Search,
  Send, Server, Settings, Shield, ShieldAlert, ShieldCheck, ShoppingBag,
  Sparkles, Star, Store, Tag, Target, Terminal, TrendingUp, User,
  UserCheck, Users, Wallet, Workflow, Wrench, Zap, Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  ActivityFeed, FilterBar, KpiStrip, MiniBarChart, QuickActions,
  RecordsTable, SectionHeader, type ActivityItem, type Kpi, type RecordRow,
} from "../enterprise";

function Hero({ eyebrow, title, subtitle, actions }: {
  eyebrow: { icon: any; text: string }[]; title: string; subtitle: string;
  actions?: { label: string; icon?: any }[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden">
      <div className="px-5 py-5 text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)" }}>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {eyebrow.map((e) => { const I = e.icon; return (
                <Badge key={e.text} variant="secondary" className="font-normal shrink-0"><I className="mr-1 h-3 w-3" />{e.text}</Badge>
              ); })}
            </div>
            <h1 className="mt-1.5 text-xl sm:text-2xl font-bold truncate">{title}</h1>
            <p className="text-xs sm:text-sm opacity-90 max-w-2xl">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <Input placeholder="Search…" className="h-9 pl-9 bg-white/15 border-white/20 placeholder:text-white/70 text-white" />
            </div>
            {(actions ?? [{ label: "New", icon: Plus }]).map((a) => { const I = a.icon ?? Plus; return (
              <Button key={a.label} size="sm" variant="secondary"><I className="mr-1.5 h-3.5 w-3.5" />{a.label}</Button>
            ); })}
          </div>
        </div>
      </div>
    </div>
  );
}
const Shell = ({ children }: { children: ReactNode }) => <div className="space-y-4">{children}</div>;

function StatusList({ title, items }: {
  title: string; items: { label: string; meta: string; tone?: "ok"|"warn"|"bad"|"info" }[];
}) {
  const cls = {
    ok: "bg-success/15 text-success border-success/30",
    warn: "bg-warning/15 text-warning border-warning/30",
    bad: "bg-destructive/15 text-destructive border-destructive/30",
    info: "bg-primary/15 text-primary border-primary/30",
  } as const;
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="border-b border-border/60 px-4 py-2.5 text-sm font-semibold">{title}</div>
      <ul className="divide-y divide-border/60">
        {items.map((it) => (
          <li key={it.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{it.label}</div>
              <div className="text-[11px] text-muted-foreground truncate">{it.meta}</div>
            </div>
            <Badge variant="outline" className={cls[it.tone ?? "info"]}>
              {it.tone === "ok" ? "Healthy" : it.tone === "warn" ? "Warning" : it.tone === "bad" ? "Critical" : "Active"}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricGrid({ title, rows }: { title: string; rows: { label: string; value: string; pct: number }[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="text-sm font-semibold mb-3">{title}</div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium tabular-nums">{r.value}</span>
            </div>
            <Progress value={r.pct} className="h-1.5 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryTree({ title, tree }: {
  title: string;
  tree: { name: string; count: number; children?: { name: string; count: number }[] }[];
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="border-b border-border/60 px-4 py-2.5 text-sm font-semibold">{title}</div>
      <ul className="p-2">
        {tree.map((n) => (
          <li key={n.name} className="mb-1">
            <div className="flex items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-accent">
              <span className="flex items-center gap-2 text-sm font-medium">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />{n.name}
              </span>
              <Badge variant="secondary" className="font-normal">{n.count}</Badge>
            </div>
            {n.children && (
              <ul className="ml-6 mt-0.5">
                {n.children.map((c) => (
                  <li key={c.name} className="flex items-center justify-between rounded-md px-2.5 py-1 hover:bg-accent text-xs">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Cfg = {
  eyebrow: { icon: any; text: string }[]; title: string; subtitle: string;
  kpis: Kpi[]; actions: { label: string; hint?: string; icon: any }[];
  chips: string[]; rows: RecordRow[]; activity: ActivityItem[];
  panels: { title: string; node: ReactNode }[];
  heroActions?: { label: string; icon?: any }[];
};

function RoleConsole({ cfg }: { cfg: Cfg }) {
  const auditRows = useMemo(() => buildAuditFromCfg(cfg), [cfg]);
  const [auditFilter, setAuditFilter] = useState("");
  const [selected, setSelected] = useState<AuditEntry | null>(null);
  const filteredAudit = useMemo(() => {
    const n = auditFilter.trim().toLowerCase();
    if (!n) return auditRows;
    return auditRows.filter((r) =>
      [r.actor, r.action, r.resource, r.severity, r.ip].some((v) =>
        v.toLowerCase().includes(n),
      ),
    );
  }, [auditRows, auditFilter]);
  return (
    <Shell>
      <Hero eyebrow={cfg.eyebrow} title={cfg.title} subtitle={cfg.subtitle} actions={cfg.heroActions} />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border border-border/60 flex w-full overflow-x-auto md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <KpiStrip kpis={cfg.kpis} />
          <QuickActions actions={cfg.actions} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 space-y-3 min-w-0">
              <SectionHeader title="Records" desc="Filter, group, and act on the live dataset." />
              <FilterBar chips={cfg.chips} />
              <RecordsTable rows={cfg.rows} />
            </div>
            <div className="space-y-3">
              {cfg.panels.slice(0, 2).map((p) => (<div key={p.title}>{p.node}</div>))}
              <ActivityFeed items={cfg.activity} />
            </div>
          </div>
          {cfg.panels.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cfg.panels.slice(2).map((p) => (<div key={p.title}>{p.node}</div>))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="records" className="mt-4 space-y-3">
          <FilterBar chips={cfg.chips} />
          <RecordsTable rows={cfg.rows} />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4 space-y-3">
          <KpiStrip kpis={cfg.kpis} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cfg.panels.map((p) => (<div key={p.title}>{p.node}</div>))}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-4 space-y-3">
          <SectionHeader title="Live activity" desc="Stream of recent events across this module." />
          <ActivityFeed items={[...cfg.activity, ...cfg.activity.map(a => ({...a, when: "earlier"}))]} />
        </TabsContent>
        <TabsContent value="audit" className="mt-4 space-y-3">
          <SectionHeader title="Audit log" desc="Immutable trail of who did what, when, and from where." />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                placeholder="Search actor, action, resource, IP…"
                className="h-9 pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Severity","Actor","Resource","Date"].map((c) => (
                <Badge key={c} variant="outline" className="h-7 cursor-pointer border-dashed font-normal hover:bg-accent">
                  {c}
                </Badge>
              ))}
              <Button size="sm" variant="outline" className="h-7">Export</Button>
            </div>
          </div>
          <AuditTable rows={filteredAudit} onSelect={setSelected} />
          <AuditDrawer entry={selected} onClose={() => setSelected(null)} />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

const spark = (n=12, b=30) => Array.from({length:n}, (_,i)=> b + Math.round(Math.sin(i/1.7)*12 + i*1.4));
const row = (id:string,name:string,status:RecordRow["status"],owner:string,updated:string,amount?:string,tag?:string):RecordRow => ({id,name,status,owner,updated,amount,tag});
const act = (who:string,what:string,target:string,when:string,kind:ActivityItem["kind"]="update"):ActivityItem => ({who,what,target,when,kind});


export function CEOConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Crown, text: 'Office of the CEO' }],
    title: 'Executive Board',
    subtitle: 'Cross-business KPIs, OKR progress, board approvals and strategic risk.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function TechAdminConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Server, text: 'Platform Ops' }],
    title: 'Technical Administration',
    subtitle: 'Clusters, namespaces, workloads, drift detection and incident response.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ServersConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Server, text: 'Bare metal + cloud' }],
    title: 'Server Manager',
    subtitle: 'Provision, snapshot and monitor every VM, dedicated box and rescue session.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function HostingConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Globe, text: 'Hosting Operations' }],
    title: 'Hosting & VPS Management',
    subtitle: 'Customer subscriptions, control panels, mail, DNS and one-click app installs.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function DomainsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Globe, text: 'Edge + Trust' }],
    title: 'Domain & SSL Management',
    subtitle: 'Registrar, DNS zones, certificates, DDoS posture and zero-trust access.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function DatabaseConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Database, text: 'Data Platform' }],
    title: 'Database Administration',
    subtitle: 'Clusters, replica sets, indexes, slow queries and backup policies.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function InfrastructureConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Cpu, text: 'Infrastructure' }],
    title: 'Infrastructure Manager',
    subtitle: 'Hosts, containers, dependencies and golden signals across every region.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function DevOpsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: GitMerge, text: 'DevOps' }],
    title: 'DevOps Engineer Workspace',
    subtitle: 'Pipelines, environments, releases and DORA metrics for every service.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function AIAPIConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Brain, text: 'AI Platform' }],
    title: 'AI API Manager',
    subtitle: 'Models, keys, rate limits, usage and safety policies across providers.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ObservabilityConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Activity, text: 'Observability' }],
    title: 'Observability & System Health',
    subtitle: 'Logs, traces, metrics, SLOs and incident triage with correlated signals.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function BackupConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: HardDrive, text: 'Data protection' }],
    title: 'Backup & Recovery',
    subtitle: 'Jobs, restore points, immutability and disaster-recovery rehearsals.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ProductConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Compass, text: 'Product Management' }],
    title: 'Product Manager Workspace',
    subtitle: 'Insights, prioritisation, roadmap and release notes in one feedback loop.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function QAConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: ShieldCheck, text: 'Quality' }],
    title: 'QA Tester Workspace',
    subtitle: 'Test plans, runs, defects and coverage across squads and environments.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function WorkflowMgrConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Workflow, text: 'Automation' }],
    title: 'Workflow Manager',
    subtitle: 'Visual workflows, triggers, nodes and execution history for every team.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function AIManagerConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Brain, text: 'AI Studio' }],
    title: 'AI Manager',
    subtitle: 'Catalog, deployments, evaluations and responsible-AI policies.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ChatbotsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Bot, text: 'Agents & Bots' }],
    title: 'AI Chatbot & Agent Management',
    subtitle: 'Agents, tools, memory, traces and live conversations with handoff to humans.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function AuthorsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: User, text: 'Author Hub' }],
    title: 'Author Management',
    subtitle: 'Creators, catalog, royalties, KYC and growth tools across the marketplace.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function AuthorPageConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: User, text: 'Creator portfolio' }],
    title: 'Author Page',
    subtitle: 'Your public storefront, products, followers and earnings at a glance.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function VendorsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Store, text: 'Marketplace operator' }],
    title: 'Vendor Management',
    subtitle: 'Onboarding, catalog quality, SLAs, disputes and payouts across vendors.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function AffiliatesConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Link2, text: 'Partnerships' }],
    title: 'Affiliate Management',
    subtitle: 'Partners, links, attribution, fraud screening and commission payouts.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function PaymentsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: CreditCard, text: 'Payments' }],
    title: 'Payment Gateway Management',
    subtitle: 'Charges, payouts, disputes, fraud and gateway routing across providers.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function SalesSupportConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Briefcase, text: 'Revenue + Support' }],
    title: 'Sales & Support Workspace',
    subtitle: 'One workspace for deals, conversations, playbooks and SLAs.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function LeadsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Target, text: 'Lead Intelligence' }],
    title: 'Lead Provider',
    subtitle: 'Search, enrich, sequence and route high-intent prospects to reps.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function MarketingConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Megaphone, text: 'Growth' }],
    title: 'Marketing Manager',
    subtitle: 'Campaigns, journeys, segments and attribution across every channel.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function SEOExecConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: TrendingUp, text: 'SEO Operations' }],
    title: 'SEO Executive — Daily Ops',
    subtitle: 'Daily ranking moves, on-page tasks, backlinks and competitor watch.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ContentConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: FileText, text: 'Content Hub' }],
    title: 'Content Management',
    subtitle: 'Spaces, pages, templates, reviewers and publishing pipeline.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function LiveChatConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: MessageSquare, text: 'Live Conversations' }],
    title: 'Live Chat Management',
    subtitle: 'Unified inbox across web, mobile, WhatsApp and email with team routing.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ResellerDashConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Users, text: 'Partner program' }],
    title: 'Reseller Dashboard',
    subtitle: 'Your customers, commissions, white-label assets and growth signals.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function InfluencersConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Star, text: 'Creator Marketing' }],
    title: 'Influencer Management',
    subtitle: 'Discovery, briefs, contracts, content approval and earned media metrics.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function InfluencerDashConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Star, text: 'Creator workspace' }],
    title: 'Influencer Dashboard',
    subtitle: 'Your briefs, deadlines, content drafts, earnings and audience growth.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ContinentConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Globe2, text: 'Continent governance' }],
    title: 'Continent Administration',
    subtitle: 'Cross-country governance, regional KPIs, policies and escalations.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function CountryConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: MapPin, text: 'Country operations' }],
    title: 'Country Administration',
    subtitle: 'Tenants, taxes, branches, partners and local compliance for the country.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function FinanceConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: DollarSign, text: 'Finance Command' }],
    title: 'Finance Manager',
    subtitle: 'Close, AR/AP, treasury, FP&A and consolidated reporting.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function LegalConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Scale, text: 'Legal Ops' }],
    title: 'Legal Manager',
    subtitle: 'Contracts, redlines, templates, signatures and matter intake.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function LawyerConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Scale, text: 'Practice management' }],
    title: 'Lawyer Workspace',
    subtitle: 'Matters, clients, time entries, documents and billing.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ComplianceConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: ShieldCheck, text: 'Trust & Compliance' }],
    title: 'Compliance & Audit Management',
    subtitle: 'Controls, evidence, audits and continuous monitoring across frameworks.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function OperationsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: KanbanSquare, text: 'Operations' }],
    title: 'Operations Manager',
    subtitle: 'Boards, workflows, dependencies and team workload across functions.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function TasksConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: KanbanSquare, text: 'Task Manager' }],
    title: 'Task Manager Workspace',
    subtitle: 'Lists, sprints, dependencies and personal queue across every team.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function PromiseConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Clock, text: 'SLA & Promises' }],
    title: 'Promise Tracker',
    subtitle: 'Service-level promises, escalations, breach analytics and commitments.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function SearchMgmtConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Search, text: 'Search Platform' }],
    title: 'Search Management',
    subtitle: 'Indices, relevance tuning, synonyms, query analytics and zero-result fixes.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function TenantsConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Building2, text: 'Multi-tenant' }],
    title: 'Tenant / Multi-Company Management',
    subtitle: 'Tenants, plans, isolation, branding, quotas and inter-company rules.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ProManagerConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Crown, text: 'Pro Program' }],
    title: 'Pro Manager',
    subtitle: 'Pro members, perks, success plays and revenue from premium tier.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function ProUserConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: Sparkles, text: 'Pro account' }],
    title: 'Pro User Dashboard',
    subtitle: 'Your Pro perks, advanced workspaces, AI usage and team seats.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function BasicUserConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: User, text: 'My Workspace' }],
    title: 'My Dashboard',
    subtitle: 'Your projects, tasks and updates — clean and focused.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function PortalUserConsole() {
  const StatusListNode = <StatusList title="Status overview" items={[
    { label: "All systems operational", meta: "0 incidents", tone: "ok" },
    { label: "Scheduled maintenance", meta: "Sun 02:00 UTC", tone: "info" },
    { label: "Warnings", meta: "2 minor", tone: "warn" },
  ]} />;
  const MiniBarNode = <MiniBarChart data={[42,38,52,48,64,72,68,84]} />;
  const MetricGridNode = <MetricGrid title="Metrics" rows={[
    { label: "Throughput", value: "92%", pct: 92 },
    { label: "Latency", value: "68 ms", pct: 32 },
    { label: "Error rate", value: "0.4%", pct: 8 },
    { label: "Saturation", value: "44%", pct: 44 },
  ]} />;
  return <RoleConsole cfg={{
    eyebrow: [{ icon: LifeBuoy, text: 'Customer Portal' }],
    title: 'Customer Portal',
    subtitle: 'Your tickets, orders, invoices and knowledge base in one place.',
    kpis: [{ label: 'Primary KPI', value: '12.4k', delta: '+8%', tone: 'up', spark: spark(12,30) },{ label: 'Secondary', value: '94%', delta: '+1.2pp', tone: 'up', spark: spark(12,40) },{ label: 'Open items', value: '42', delta: '-4', tone: 'up' },{ label: 'Health', value: 'Good', delta: 'stable', tone: 'neutral' }],
    actions: [{ label: 'Create', hint: 'Add new', icon: Plus },{ label: 'Assign', hint: 'To owner', icon: UserCheck },{ label: 'Export', hint: 'CSV / PDF', icon: Download },{ label: 'Settings', hint: 'Module', icon: Settings }],
    chips: ["Status","Owner","Priority","Tag"],
    rows: [row('R-001', 'Primary record', 'active', 'Aman G.', '2h ago', 'High', 'Tier 1'),row('R-002', 'Secondary record', 'review', 'Priya N.', '1d ago', 'Medium', 'Tier 2'),row('R-003', 'Tertiary record', 'pending', 'Liam O.', '3d ago', 'Low', 'Tier 3')],
    activity: [act('system','updated','record R-001','10m ago','update'),act('admin','approved','item R-014','1h ago','approve'),act('ops','commented','on R-022','2h ago','comment')],
    panels: [
      { title: "Status overview", node: StatusListNode },
      { title: "Distribution", node: MiniBarNode },
      { title: "Metrics", node: MetricGridNode },
    ],
  }} />;
}


export function PublicUserConsole() {
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Sparkles, text: "Welcome to Vala" }]}
        title="One enterprise OS for every business"
        subtitle="CRM, finance, projects, AI and marketplace — beautifully connected. Start free."
        actions={[{ label: "Get started", icon: Rocket }, { label: "Watch demo", icon: Play }]}
      />
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { icon: Briefcase, title: "Sales & CRM", desc: "Close more, with AI assistance built in." },
          { icon: DollarSign, title: "Finance", desc: "Books, billing and reporting that auto-close." },
          { icon: KanbanSquare, title: "Projects", desc: "Plan, ship and report across every team." },
          { icon: Store, title: "Marketplace", desc: "Sell digital and physical with one cart." },
          { icon: Bot, title: "Vala AI", desc: "Agents that read, write and act on your data." },
          { icon: ShieldCheck, title: "Trust", desc: "SOC2, ISO27001, GDPR-ready by default." },
        ].map((f) => (
          <Card key={f.title} className="border-border/60">
            <CardContent className="p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary mb-2">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="text-base font-semibold">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Shell>
  );
}


export function GlobalSearchConsole() {
  const group = (title: string, items: { label: string; meta: string; kbd?: string }[]) => (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="border-b border-border/60 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="divide-y divide-border/60">
        {items.map((it) => (
          <li key={it.label} className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-accent">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{it.label}</div>
              <div className="text-[11px] text-muted-foreground truncate">{it.meta}</div>
            </div>
            {it.kbd && <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">{it.kbd}</kbd>}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Search, text: "Command Center" }]}
            title="Global Search"
            subtitle="Find anything — records, people, settings, actions — in a single keystroke."
            actions={[{ label: "Run", icon: Play }]} />
      <div className="rounded-2xl border border-border/60 bg-card p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search records, people, actions…" className="h-11 pl-9 text-base" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Customers","Invoices","Tasks","Settings","Reports","Automations","Tickets","Files"].map((c) => (
            <Badge key={c} variant="outline" className="cursor-pointer hover:bg-accent">{c}</Badge>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {group("Records", [
          { label: "Acme Corp", meta: "Customer · $184k ARR", kbd: "↵" },
          { label: "Invoice INV-2014", meta: "$248 · paid", kbd: "↵" },
          { label: "Project Launch v2", meta: "Active · 12 tasks", kbd: "↵" },
        ])}
        {group("People", [
          { label: "Aman Gupta", meta: "AE · Sales", kbd: "↵" },
          { label: "Priya Nair", meta: "Lead · Support", kbd: "↵" },
          { label: "Sara Khan", meta: "PM · Product", kbd: "↵" },
        ])}
        {group("Actions", [
          { label: "Create invoice", meta: "Finance", kbd: "⌘ I" },
          { label: "Add task", meta: "Projects", kbd: "⌘ T" },
          { label: "Open settings", meta: "System", kbd: "⌘ ," },
        ])}
      </div>
    </Shell>
  );
}


export function LogoutConsole() {
  return (
    <div className="mx-auto max-w-md py-16">
      <Card className="border-border/60">
        <CardContent className="p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary mb-3">
            <LogOut className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Sign out of Vala?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You will be signed out of this device. Other sessions remain active.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" size="sm">Stay signed in</Button>
            <Button size="sm" variant="destructive"><LogOut className="mr-1.5 h-3.5 w-3.5" />Sign out</Button>
          </div>
          <div className="mt-6 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-left">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Other sessions</div>
            <ul className="text-xs space-y-1">
              <li className="flex items-center justify-between"><span>MacBook · Mumbai</span><span className="text-muted-foreground">now</span></li>
              <li className="flex items-center justify-between"><span>iPhone · Mumbai</span><span className="text-muted-foreground">2h ago</span></li>
              <li className="flex items-center justify-between"><span>Chrome · Delhi</span><span className="text-muted-foreground">3d ago</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export const wave5Registry: Record<string, ComponentType> = {
  "/ceo": CEOConsole,
  "/tech-admin": TechAdminConsole,
  "/servers": ServersConsole,
  "/hosting": HostingConsole,
  "/domains": DomainsConsole,
  "/database": DatabaseConsole,
  "/infrastructure": InfrastructureConsole,
  "/devops": DevOpsConsole,
  "/ai-api": AIAPIConsole,
  "/observability": ObservabilityConsole,
  "/backup": BackupConsole,
  "/product": ProductConsole,
  "/qa": QAConsole,
  "/workflows": WorkflowMgrConsole,
  "/ai-manager": AIManagerConsole,
  "/chatbots": ChatbotsConsole,
  "/authors": AuthorsConsole,
  "/author-page": AuthorPageConsole,
  "/vendors": VendorsConsole,
  "/affiliates": AffiliatesConsole,
  "/payments": PaymentsConsole,
  "/sales-support": SalesSupportConsole,
  "/leads": LeadsConsole,
  "/marketing": MarketingConsole,
  "/seo-exec": SEOExecConsole,
  "/content": ContentConsole,
  "/live-chat": LiveChatConsole,
  "/reseller-dashboard": ResellerDashConsole,
  "/influencers": InfluencersConsole,
  "/influencer-dashboard": InfluencerDashConsole,
  "/continent": ContinentConsole,
  "/country": CountryConsole,
  "/finance": FinanceConsole,
  "/legal": LegalConsole,
  "/lawyer": LawyerConsole,
  "/compliance": ComplianceConsole,
  "/operations": OperationsConsole,
  "/tasks": TasksConsole,
  "/promises": PromiseConsole,
  "/search": SearchMgmtConsole,
  "/tenants": TenantsConsole,
  "/pro-manager": ProManagerConsole,
  "/pro-user": ProUserConsole,
  "/basic-user": BasicUserConsole,
  "/portal": PortalUserConsole,
  "/public": PublicUserConsole,
  "/global-search": GlobalSearchConsole,
  "/logout": LogoutConsole,
};
