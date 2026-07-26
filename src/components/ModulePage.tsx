import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Download,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  Sparkles,
  Star,
  Layers,
  Workflow,
  Zap,
  ClipboardCheck,
  FileText,
  ScrollText,
  Plug,
  Bot,
  Upload,
  Shield,
  Building2,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ModuleItem } from "@/lib/modules";
import { useModuleActions } from "@/lib/use-permissions";
import { PermButton } from "@/components/permissions";
import {
  KpiStrip,
  RecordsTable,
  ActivityFeed,
  ApprovalsList,
  FilterBar,
  MiniBarChart,
  SectionHeader,
  QuickActions,
  type Kpi,
  type RecordRow,
  type ActivityItem,
  type Approval,
} from "./enterprise";

/* ----------- Module-aware mock generators (UI only) ----------- */

function mockKpis(m: ModuleItem): Kpi[] {
  const g = m.group;
  if (g === "Sales")
    return [
      { label: "Pipeline", value: "$1.24M", delta: "+8.2%", tone: "up", spark: [4, 6, 5, 8, 7, 9, 11], hint: "vs. last 30d" },
      { label: "Won this month", value: "$184K", delta: "+12%", tone: "up", spark: [2, 3, 4, 3, 6, 7, 8] },
      { label: "Avg cycle", value: "21d", delta: "-3d", tone: "up", spark: [9, 8, 7, 6, 5, 6, 5] },
      { label: "At-risk deals", value: "7", delta: "+2", tone: "down", spark: [1, 2, 2, 3, 3, 4, 5] },
    ];
  if (g === "Finance")
    return [
      { label: "Revenue MTD", value: "$94,210", delta: "+11%", tone: "up", spark: [3, 4, 5, 6, 7, 8, 9] },
      { label: "Outstanding AR", value: "$28,400", delta: "-4%", tone: "up", spark: [9, 8, 7, 7, 6, 6, 5] },
      { label: "Bills due (7d)", value: "9", tone: "neutral", spark: [4, 4, 5, 4, 6, 5, 5] },
      { label: "Reconciled", value: "96%", delta: "+1.2%", tone: "up", spark: [6, 7, 7, 8, 8, 9, 9] },
    ];
  if (g === "Operations")
    return [
      { label: "Open orders", value: "342", delta: "+18", tone: "up", spark: [4, 5, 6, 7, 8, 9, 10] },
      { label: "On-time rate", value: "94.6%", delta: "+0.4%", tone: "up", spark: [7, 7, 8, 8, 9, 9, 9] },
      { label: "Stock alerts", value: "12", delta: "+3", tone: "down", spark: [2, 3, 3, 4, 4, 5, 6] },
      { label: "Cycle time", value: "1.8d", delta: "-0.2d", tone: "up", spark: [8, 8, 7, 7, 6, 6, 6] },
    ];
  if (g === "People")
    return [
      { label: "Headcount", value: "312", delta: "+6", tone: "up", spark: [4, 5, 5, 6, 7, 8, 9] },
      { label: "Open reqs", value: "14", tone: "neutral", spark: [3, 4, 4, 5, 5, 6, 6] },
      { label: "Attrition", value: "3.2%", delta: "-0.4%", tone: "up", spark: [6, 6, 5, 5, 5, 4, 4] },
      { label: "eNPS", value: "+48", delta: "+5", tone: "up", spark: [5, 6, 6, 7, 7, 8, 9] },
    ];
  if (g === "Partners")
    return [
      { label: "Active partners", value: "142", delta: "+5", tone: "up", spark: [5, 6, 7, 7, 8, 9, 10] },
      { label: "Renewals (30d)", value: "18", tone: "neutral", spark: [4, 4, 5, 5, 6, 6, 7] },
      { label: "At-risk", value: "4", delta: "-1", tone: "up", spark: [5, 5, 4, 4, 3, 3, 3] },
      { label: "Commissions paid", value: "$42K", delta: "+9%", tone: "up", spark: [4, 5, 6, 6, 7, 8, 9] },
    ];
  if (g === "Platform" || g === "Security")
    return [
      { label: "Uptime", value: "99.98%", delta: "+0.01%", tone: "up", spark: [9, 9, 9, 9, 9, 9, 9] },
      { label: "p95 latency", value: "184ms", delta: "-12ms", tone: "up", spark: [8, 7, 7, 6, 6, 6, 5] },
      { label: "Active alerts", value: "3", delta: "-2", tone: "up", spark: [6, 5, 4, 4, 3, 3, 3] },
      { label: "Error rate", value: "0.04%", delta: "-0.01%", tone: "up", spark: [4, 4, 3, 3, 3, 2, 2] },
    ];
  if (g === "Insights")
    return [
      { label: "Tracked events", value: "2.4M", delta: "+9%", tone: "up", spark: [4, 5, 6, 6, 7, 8, 9] },
      { label: "Conversion", value: "3.8%", delta: "+0.3%", tone: "up", spark: [3, 4, 5, 5, 6, 7, 7] },
      { label: "Active users", value: "8,412", delta: "+4.2%", tone: "up", spark: [5, 6, 6, 7, 8, 8, 9] },
      { label: "Reports built", value: "27", tone: "neutral", spark: [3, 3, 4, 4, 5, 5, 5] },
    ];
  if (g === "Master" || g === "Organization")
    return [
      { label: "Tenants", value: "248", delta: "+12", tone: "up", spark: [4, 5, 6, 7, 8, 9, 10] },
      { label: "Branches", value: "61", delta: "+3", tone: "up", spark: [3, 4, 4, 5, 5, 6, 6] },
      { label: "MRR", value: "$184K", delta: "+9%", tone: "up", spark: [4, 5, 6, 7, 8, 9, 10] },
      { label: "Critical alerts", value: "3", delta: "-2", tone: "up", spark: [6, 5, 4, 3, 3, 2, 2] },
    ];
  return [
    { label: "Total", value: "1,248", spark: [4, 5, 6, 5, 7, 8, 9] },
    { label: "Active", value: "942", delta: "+3%", tone: "up", spark: [3, 4, 5, 5, 6, 7, 8] },
    { label: "Pending", value: "37", tone: "neutral", spark: [3, 3, 4, 4, 4, 4, 5] },
    { label: "Archived", value: "269", spark: [2, 2, 2, 3, 3, 3, 3] },
  ];
}

function mockRows(m: ModuleItem): RecordRow[] {
  const base = m.title;
  const owners = ["Ava Chen", "Marcus Hill", "Priya Shah", "Diego Romero", "Noor Idris", "Yui Tanaka"];
  const statuses: RecordRow["status"][] = ["active", "pending", "review", "draft", "archived", "active"];
  const tags = ["high-priority", "EU", "renewal", "trial", "enterprise", "SMB"];
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `${m.title.slice(0, 2).toUpperCase()}-${1024 + i}`,
    name: `${base} record ${i + 1}`,
    status: statuses[i % statuses.length],
    owner: owners[i % owners.length],
    updated: `${i + 1}h ago`,
    amount: i % 2 === 0 ? `$${(1240 * (i + 1)).toLocaleString()}` : undefined,
    tag: tags[i % tags.length],
  }));
}

function mockActivity(m: ModuleItem): ActivityItem[] {
  return [
    { who: "Ava Chen", what: "approved", target: `${m.title} request #1029`, when: "2 min ago", kind: "approve" },
    { who: "System", what: "auto-synced 1,204 records in", target: m.title, when: "14 min ago", kind: "update" },
    { who: "Marcus Hill", what: "commented on", target: "deal Acme-2026", when: "1 h ago", kind: "comment" },
    { who: "Priya Shah", what: "created", target: `${m.title} workflow`, when: "3 h ago", kind: "create" },
    { who: "Diego Romero", what: "rejected", target: "expense #882", when: "Yesterday", kind: "reject" },
  ];
}

function mockApprovals(_m: ModuleItem): Approval[] {
  return [
    { id: "1", title: "Discount waiver — Acme Industries", requester: "Marcus Hill", amount: "$4,200", age: "18m", sla: "ok" },
    { id: "2", title: "PO #4421 over threshold", requester: "Priya Shah", amount: "$12,800", age: "2h", sla: "warn" },
    { id: "3", title: "Leave request — 5 days", requester: "Yui Tanaka", age: "1d", sla: "ok" },
    { id: "4", title: "Refund for invoice INV-0918", requester: "Customer Support", amount: "$240", age: "3d", sla: "breach" },
  ];
}

/* ------------------------ ModulePage ------------------------ */

export function ModulePage({ module }: { module: ModuleItem }) {
  const Icon = module.icon;
  const actions = useModuleActions(module.url);
  const key = module.url.replace(/^\/+/, "").split("/")[0];
  const perm = (a: string) => `${key}.${a}`;
  const allow = (a: string) => actions.includes(a as never);
  const kpis = mockKpis(module);
  const rows = mockRows(module);
  const activity = mockActivity(module);
  const approvals = mockApprovals(module);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-[var(--shadow-elegant)]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Workspace
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span>{module.group}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{module.title}</span>
            </nav>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
              <Badge variant="secondary" className="font-normal">
                {module.group}
              </Badge>
              <Badge variant="outline" className="font-normal border-success/30 text-success">
                Live
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{module.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-8">
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Pin
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Discuss
          </Button>
          <PermButton permission={perm("export")} variant="outline" size="sm" className="h-8">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </PermButton>
          <PermButton permission={perm("create")} size="sm" className="h-8">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New
          </PermButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={!allow("configure")}>Configure</DropdownMenuItem>
              <DropdownMenuItem disabled={!allow("configure")}>Permissions</DropdownMenuItem>
              <DropdownMenuItem disabled={!allow("view")}>Audit log</DropdownMenuItem>
              <DropdownMenuItem disabled={!allow("delete")} className="text-destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPIs */}
      <KpiStrip kpis={kpis} />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <ScrollArea className="w-full">
          <TabsList className="bg-transparent border-b border-border/60 rounded-none w-max min-w-full justify-start h-auto p-0">
            {([
              ["overview", "Overview"],
              ["records", "Records"],
              ["pipeline", "Pipeline"],
              ["categories", "Categories"],
              ["workflow", "Workflow"],
              ["automation", "Automation"],
              ["approvals", "Approvals"],
              ["analytics", "Analytics"],
              ["reports", "Reports"],
              ["activity", "Activity"],
              ["audit", "Audit"],
              ["notifications", "Notifications"],
              ["integrations", "Integrations"],
              ["ai", "AI Assist"],
              ["data", "Import / Export"],
              ["access", "Access"],
              ["settings", "Settings"],
            ] as [string, string][])
              .filter(([v]) => {
                if (v === "approvals") return allow("approve");
                if (v === "data") return allow("export") || allow("create");
                if (v === "access" || v === "settings") return allow("configure");
                if (v === "automation") return allow("edit");
                return true;
              })
              .map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-xs md:text-sm whitespace-nowrap"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border/60">
                <CardContent className="p-4">
                  <SectionHeader
                    title="Trend (last 7d)"
                    desc="Volume across primary metric"
                    right={
                      <Badge variant="outline" className="font-normal">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Auto-insight
                      </Badge>
                    }
                  />
                  <div className="mt-3">
                    <MiniBarChart
                      data={[12, 18, 14, 22, 25, 21, 28]}
                      labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                    />
                  </div>
                </CardContent>
              </Card>

              <QuickActions
                actions={[
                  { label: "New record", hint: "Create + assign", icon: Plus },
                  { label: "Run report", hint: "Realtime", icon: Filter },
                  { label: "Configure", hint: "Module settings", icon: Settings },
                  { label: "Notify team", hint: "Channel ping", icon: Bell },
                ]}
              />
            </div>
            <div className="space-y-4">
              <ApprovalsList items={approvals} />
              <ActivityFeed items={activity.slice(0, 4)} />
            </div>
          </div>
        </TabsContent>

        {/* Records */}
        <TabsContent value="records" className="mt-4 space-y-3">
          <FilterBar
            placeholder={`Search ${module.title.toLowerCase()}…`}
            chips={["Status", "Owner", "Date range", "Tag"]}
          />
          <RecordsTable rows={rows} />
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Showing 1–{rows.length} of 1,248</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Pipeline (kanban-ish columns) */}
        <TabsContent value="pipeline" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {["New", "In progress", "Review", "Done"].map((col, i) => (
              <div key={col} className="rounded-xl border border-border/60 bg-card">
                <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{col}</span>
                  <Badge variant="secondary" className="font-normal">
                    {3 + i}
                  </Badge>
                </div>
                <div className="p-2 space-y-2">
                  {rows.slice(i, i + 3).map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg border border-border/60 bg-background p-2.5 hover:border-primary/40 transition cursor-pointer"
                    >
                      <div className="text-[11px] text-muted-foreground">{r.id}</div>
                      <div className="text-sm font-medium leading-tight">{r.name}</div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{r.owner.split(" ")[0]}</span>
                        <span>{r.amount ?? r.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="p-4">
                <SectionHeader title="Volume" desc="Daily" />
                <div className="mt-3">
                  <MiniBarChart
                    data={[8, 12, 16, 14, 20, 24, 22]}
                    labels={["M", "T", "W", "T", "F", "S", "S"]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-4">
                <SectionHeader title="Distribution" desc="By status" />
                <div className="mt-3">
                  <MiniBarChart
                    data={[44, 22, 16, 12, 6]}
                    labels={["Active", "Pending", "Review", "Draft", "Arch"]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="mt-4">
          <ActivityFeed items={[...activity, ...activity]} />
        </TabsContent>

        {/* Categories — category / subcategory / nano / micro */}
        <TabsContent value="categories" className="mt-4 space-y-3">
          <FilterBar placeholder="Search taxonomy…" chips={["Category", "Subcategory", "Nano", "Micro"]} />
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { level: "Category", count: 12, examples: ["Operations", "Commerce", "Finance"] },
              { level: "Subcategory", count: 48, examples: ["Orders", "Refunds", "Payouts"] },
              { level: "Nano category", count: 184, examples: ["EU orders", "US refunds"] },
              { level: "Micro category", count: 612, examples: ["SKU-EU-12", "SKU-US-08"] },
            ].map((t) => (
              <Card key={t.level} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold inline-flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" /> {t.level}
                    </div>
                    <Badge variant="secondary" className="font-normal">{t.count}</Badge>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    {t.examples.map((e) => (
                      <li key={e} className="flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5">
                        <span className="truncate">{e}</span>
                        <ChevronRight className="h-3 w-3" />
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-2 h-7 px-2 text-xs">Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workflow */}
        <TabsContent value="workflow" className="mt-4 space-y-3">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader title="Enterprise workflow" desc={`Stage-gated lifecycle for ${module.title.toLowerCase()}`} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {["Draft", "Validate", "Approve", "Execute", "Reconcile", "Close"].map((s, i, arr) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs " + (i < 2 ? "border-success/30 text-success bg-success/5" : i === 2 ? "border-warning/30 text-warning bg-warning/5" : "border-border/60 text-muted-foreground")}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {s}
                    </div>
                    {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                  </div>
                ))}
              </div>
              <Progress value={42} className="mt-4 h-1.5" />
              <div className="mt-1 text-[11px] text-muted-foreground">42% of records progressed past Approve gate this week</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation */}
        <TabsContent value="automation" className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: "Auto-assign new records", trigger: "On create", action: "Route by territory + load", runs: "1,284", enabled: true },
              { name: "Stale record reminder", trigger: "Idle > 48h", action: "Notify owner & manager", runs: "412", enabled: true },
              { name: "Escalate breached SLA", trigger: "SLA breached", action: "Escalate to lead", runs: "37", enabled: true },
              { name: "Nightly reconciliation", trigger: "Daily 02:00 UTC", action: "Sync ledger + flag drift", runs: "30", enabled: false },
            ].map((r) => (
              <Card key={r.name} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold">
                        <Zap className="h-4 w-4 text-primary" /> {r.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{r.trigger}</span> → {r.action}
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground">{r.runs} runs · 30d</div>
                    </div>
                    <Switch defaultChecked={r.enabled} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Approvals (chains) */}
        <TabsContent value="approvals" className="mt-4 space-y-3">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader title="Approval chains" desc="Multi-step routing with SLA tracking" />
              <div className="mt-3 space-y-2">
                {[
                  { step: 1, role: "Owner", who: "Marcus Hill", state: "done" },
                  { step: 2, role: "Team lead", who: "Ava Chen", state: "done" },
                  { step: 3, role: "Finance", who: "Priya Shah", state: "current" },
                  { step: 4, role: "Compliance", who: "—", state: "pending" },
                  { step: 5, role: "CFO", who: "—", state: "pending" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={"grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold " + (s.state === "done" ? "bg-success/10 text-success" : s.state === "current" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground")}>
                        {s.step}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{s.role}</div>
                        <div className="text-[11px] text-muted-foreground">{s.who}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-normal capitalize">{s.state === "done" ? <CheckCircle2 className="mr-1 h-3 w-3 text-success" /> : s.state === "current" ? <Clock className="mr-1 h-3 w-3 text-warning" /> : <Clock className="mr-1 h-3 w-3 text-muted-foreground" />}{s.state}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <ApprovalsList items={approvals} />
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-4 space-y-3">
          <FilterBar placeholder="Search reports…" chips={["Pinned", "Mine", "Shared", "Scheduled"]} />
          <div className="grid gap-3 md:grid-cols-3">
            {[
              "Daily summary", "Weekly performance", "Monthly close", "Cohort analysis",
              "SLA breach report", "Top performers", "Anomaly digest", "Forecast vs actual", "Tenant breakdown",
            ].map((r) => (
              <Card key={r} className="border-border/60">
                <CardContent className="p-4">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-primary" /> {r}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Auto-generated · last run today</div>
                  <div className="mt-2 flex gap-1.5">
                    <PermButton permission={perm("view")} variant="outline" size="sm" className="h-7 px-2 text-xs">Run</PermButton>
                    <PermButton permission={perm("edit")} variant="ghost" size="sm" className="h-7 px-2 text-xs">Schedule</PermButton>
                    <PermButton permission={perm("export")} variant="ghost" size="sm" className="h-7 px-2 text-xs">Export</PermButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit */}
        <TabsContent value="audit" className="mt-4 space-y-3">
          <FilterBar placeholder="Search audit trail…" chips={["User", "Action", "Date", "IP"]} />
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {[
                  { user: "Ava Chen", act: "updated record", target: "REC-1024", ip: "10.4.2.1", t: "2 min" },
                  { user: "Marcus Hill", act: "approved", target: "REQ-118", ip: "10.4.2.7", t: "14 min" },
                  { user: "System", act: "auto-sync", target: "ledger", ip: "internal", t: "1 h" },
                  { user: "Priya Shah", act: "exported CSV", target: "records 1–500", ip: "10.4.2.9", t: "3 h" },
                  { user: "Diego Romero", act: "deleted draft", target: "REC-0991", ip: "10.4.2.3", t: "yday" },
                ].map((a, i) => (
                  <div key={i} className="grid grid-cols-12 items-center gap-2 px-4 py-2.5 text-xs">
                    <div className="col-span-3 font-medium">{a.user}</div>
                    <div className="col-span-3 text-muted-foreground">{a.act}</div>
                    <div className="col-span-3 truncate">{a.target}</div>
                    <div className="col-span-2 text-muted-foreground tabular-nums">{a.ip}</div>
                    <div className="col-span-1 text-right text-muted-foreground">{a.t}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { ch: "Email", desc: "Daily digest + critical alerts", on: true },
              { ch: "In-app", desc: "Real-time bell + activity feed", on: true },
              { ch: "Slack", desc: "#ops channel · @here for breaches", on: true },
              { ch: "SMS", desc: "On-call escalation only", on: false },
              { ch: "Webhook", desc: "POST to ops.internal/events", on: true },
              { ch: "Mobile push", desc: "iOS / Android operator app", on: false },
            ].map((c) => (
              <Card key={c.ch} className="border-border/60">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Bell className="h-4 w-4 text-primary" /> {c.ch}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{c.desc}</div>
                  </div>
                  <Switch defaultChecked={c.on} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4 space-y-3">
          <FilterBar placeholder="Search integrations…" chips={["Connected", "Available", "Marketplace"]} />
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { n: "Stripe", s: "Connected", t: "Payments" },
              { n: "QuickBooks", s: "Connected", t: "Ledger" },
              { n: "Slack", s: "Connected", t: "Messaging" },
              { n: "HubSpot", s: "Available", t: "CRM" },
              { n: "Twilio", s: "Available", t: "SMS / Voice" },
              { n: "Cloudflare", s: "Connected", t: "Edge" },
            ].map((i) => (
              <Card key={i.n} className="border-border/60">
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Plug className="h-4 w-4 text-primary" /> {i.n}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{i.t}</div>
                  </div>
                  <Badge variant={i.s === "Connected" ? "outline" : "secondary"} className={"font-normal " + (i.s === "Connected" ? "border-success/30 text-success" : "")}>{i.s}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Assist */}
        <TabsContent value="ai" className="mt-4 space-y-3">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader
                title={`Copilot for ${module.title}`}
                desc="Generate, summarize, classify, predict — grounded on tenant data"
                right={<Badge variant="outline" className="font-normal"><Sparkles className="mr-1 h-3 w-3" />Beta</Badge>}
              />
              <div className="mt-3 relative">
                <Bot className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="h-10 pl-9" placeholder={`Ask anything about ${module.title.toLowerCase()}…`} />
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {["Summarize backlog", "Detect anomalies", "Forecast next 30d", "Draft response"].map((s) => (
                  <button key={s} className="rounded-lg border border-border/60 px-3 py-2 text-left hover:border-primary/40 hover:bg-accent/40 transition">
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {[
                  { i: AlertTriangle, t: "Anomaly", d: "Unusual spike in returns from EU region (+38%)" },
                  { i: Sparkles, t: "Insight", d: "Pipeline conversion improved 4.2% MoM" },
                  { i: CheckCircle2, t: "Recommendation", d: "Auto-archive 92 stale draft records" },
                ].map((c) => (
                  <div key={c.t} className="rounded-lg border border-border/60 p-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold"><c.i className="h-3.5 w-3.5 text-primary" /> {c.t}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.d}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import / Export */}
        <TabsContent value="data" className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="p-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold"><Upload className="h-4 w-4 text-primary" /> Import</div>
                <div className="mt-1 text-xs text-muted-foreground">CSV, XLSX, JSON · field mapping + dry-run validation</div>
                <div className="mt-3 rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
                  Drop a file here or click to browse
                </div>
                <div className="mt-2 flex gap-2">
                  <PermButton permission={perm("create")} size="sm" className="h-8">Start import</PermButton>
                  <PermButton permission={perm("view")} variant="ghost" size="sm" className="h-8">Download template</PermButton>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold"><Download className="h-4 w-4 text-primary" /> Export</div>
                <div className="mt-1 text-xs text-muted-foreground">Scheduled or one-off · filtered view export</div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  {["CSV", "XLSX", "PDF", "JSON", "Parquet", "API"].map((f) => (
                    <PermButton key={f} permission={perm("export")} variant="outline" size="sm" className="h-8">{f}</PermButton>
                  ))}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground inline-flex items-center gap-1"><ScrollText className="h-3 w-3" /> Last export: today, 4,210 rows</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access — role & tenant */}
        <TabsContent value="access" className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="p-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold"><Shield className="h-4 w-4 text-primary" /> Role access</div>
                <div className="mt-3 space-y-2 text-xs">
                  {[
                    { r: "Super admin", v: "Full" },
                    { r: "Admin", v: "Read / Write / Approve" },
                    { r: "Manager", v: "Read / Write" },
                    { r: "Accountant", v: "Read · Finance scope" },
                    { r: "Account manager", v: "Read · own accounts" },
                    { r: "User", v: "Read only" },
                  ].map((r) => (
                    <div key={r.r} className="flex items-center justify-between rounded-md border border-border/60 px-2.5 py-1.5">
                      <span className="font-medium">{r.r}</span>
                      <Badge variant="outline" className="font-normal">{r.v}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4 text-primary" /> Tenant & company scope</div>
                <div className="mt-3 relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input className="h-9 pl-9 text-xs" placeholder="Filter tenants / companies…" />
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  {[
                    { t: "Acme Holdings", c: 8, st: "Active" },
                    { t: "Globex EU", c: 4, st: "Active" },
                    { t: "Initech APAC", c: 6, st: "Trial" },
                    { t: "Umbrella Retail", c: 12, st: "Active" },
                  ].map((t) => (
                    <div key={t.t} className="flex items-center justify-between rounded-md border border-border/60 px-2.5 py-1.5">
                      <span className="font-medium truncate">{t.t}</span>
                      <span className="text-muted-foreground">{t.c} companies</span>
                      <Badge variant="outline" className="font-normal">{t.st}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {["General", "Permissions", "Notifications", "Integrations", "Workflows", "Danger zone"].map(
              (s) => (
                <Card key={s} className="border-border/60">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold">{s}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Configure {s.toLowerCase()} for {module.title}.
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 h-8 text-xs">
                      Open
                    </Button>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Back link */}
      <div className="pt-2">
        <Button asChild variant="ghost" size="sm">
          <Link to={"/" as any}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to workspace
          </Link>
        </Button>
      </div>
    </div>
  );
}
