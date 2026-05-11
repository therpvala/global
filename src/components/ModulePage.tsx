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
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" className="h-8">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Configure</DropdownMenuItem>
              <DropdownMenuItem>Permissions</DropdownMenuItem>
              <DropdownMenuItem>Audit log</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
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
            {[
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
            ].map(([v, l]) => (
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
