import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bell,
  ClipboardList,
  Plus,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
  Zap,
  Workflow,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roleConfigs, modulesForGroups } from "@/lib/role-config";
import { useAuth, type AppRole } from "@/lib/auth";
import {
  ActivityFeed,
  ApprovalsList,
  MiniBarChart,
  QuickActions,
  Sparkline,
  type ActivityItem,
  type Approval,
} from "./enterprise";

const sampleActivity: ActivityItem[] = [
  { who: "Ava Chen", what: "closed deal", target: "Acme Industries · $84K", when: "12 min ago", kind: "approve" },
  { who: "Automation", what: "synced", target: "QuickBooks ledger", when: "28 min ago", kind: "update" },
  { who: "Marcus Hill", what: "created", target: "Quote Q-2041", when: "1 h ago", kind: "create" },
  { who: "Priya Shah", what: "rejected", target: "expense E-882", when: "2 h ago", kind: "reject" },
  { who: "System", what: "deployed", target: "API gateway v4.12", when: "4 h ago", kind: "update" },
];

const sampleApprovals: Approval[] = [
  { id: "1", title: "Discount waiver — Acme Industries", requester: "Sales · Marcus", amount: "$4,200", age: "18m", sla: "ok" },
  { id: "2", title: "PO #4421 over threshold", requester: "Ops · Priya", amount: "$12,800", age: "2h", sla: "warn" },
  { id: "3", title: "Leave request — 5 days", requester: "HR · Yui", age: "1d", sla: "ok" },
  { id: "4", title: "Refund INV-0918", requester: "Support · Diego", amount: "$240", age: "3d", sla: "breach" },
];

export function RoleDashboard({ role: forcedRole }: { role?: AppRole }) {
  const { primaryRole, user } = useAuth();
  const role = forcedRole ?? primaryRole;
  const cfg = roleConfigs[role] ?? roleConfigs.user;
  const grouped = modulesForGroups(cfg.groups);

  return (
    <div className="space-y-6">
      {/* Hero command bar */}
      <section
        className="relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 text-primary-foreground">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-3 capitalize">
                <Sparkles className="mr-1 h-3 w-3" />
                {role.replace("_", " ")} workspace
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{cfg.title}</h1>
              <p className="mt-2 text-sm md:text-base opacity-90">{cfg.subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs opacity-90">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems normal
                </span>
                <span className="opacity-50">·</span>
                <span>Welcome, {user?.name ?? "Operator"}</span>
                <span className="opacity-50">·</span>
                <ClientDate />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2 w-full sm:w-80">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <Input
                  placeholder="Jump to anything…  (⌘K)"
                  className="h-10 pl-9 bg-white/15 border-white/20 placeholder:text-white/70 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  New
                </Button>
                <Button size="sm" variant="secondary" className="flex-1">
                  <Bell className="mr-1.5 h-3.5 w-3.5" />
                  Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip with sparklines */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cfg.kpis.map((k, i) => {
          const spark = [4 + i, 5 + i, 5, 7, 6, 8, 9 + (i % 3)];
          return (
            <Card key={k.label} className="border-border/60">
              <CardContent className="p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <div className="text-2xl font-bold tabular-nums">{k.value}</div>
                  <Sparkline data={spark} tone={k.tone} />
                </div>
                {k.delta && (
                  <div
                    className={
                      "mt-1 inline-flex items-center gap-1 text-xs " +
                      (k.tone === "up"
                        ? "text-success"
                        : k.tone === "down"
                          ? "text-destructive"
                          : "text-muted-foreground")
                    }
                  >
                    {k.tone === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : k.tone === "down" ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {k.delta}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Main split: trend + activity */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-sm font-semibold">Operational pulse</div>
                <div className="text-xs text-muted-foreground">Last 7 days across all modules</div>
              </div>
              <Badge variant="outline" className="font-normal">
                <Sparkles className="mr-1 h-3 w-3" />
                AI summary
              </Badge>
            </div>
            <div className="mt-3">
              <MiniBarChart
                data={[18, 24, 22, 30, 28, 36, 42]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg border border-border/60 p-2.5">
                <div className="text-muted-foreground">Inflow</div>
                <div className="text-base font-semibold">+1,284</div>
              </div>
              <div className="rounded-lg border border-border/60 p-2.5">
                <div className="text-muted-foreground">Resolved</div>
                <div className="text-base font-semibold">1,162</div>
              </div>
              <div className="rounded-lg border border-border/60 p-2.5">
                <div className="text-muted-foreground">Backlog</div>
                <div className="text-base font-semibold text-warning">122</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <ApprovalsList items={sampleApprovals} />
          <ActivityFeed items={sampleActivity} />
        </div>
      </section>

      {/* Quick actions */}
      <QuickActions
        actions={[
          { label: "Create record", hint: "Any module", icon: Plus },
          { label: "Run automation", hint: "Workflow engine", icon: Zap },
          { label: "Approve queue", hint: `${sampleApprovals.length} pending`, icon: ClipboardList },
          { label: "Invite teammate", hint: "Send role-based access", icon: Users },
        ]}
      />

      {/* Module groups */}
      {grouped.map(({ group, items }) => (
        <section key={group} className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </h2>
              <div className="text-[11px] text-muted-foreground">
                {items.length} module{items.length === 1 ? "" : "s"} in this category
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to={"/" as any}>
                Browse all
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.url}
                  to={m.url as any}
                  className="group relative rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold truncate">{m.title}</h3>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{m.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Workflow className="h-3 w-3" />
                      Live
                    </span>
                    <span>Updated · today</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
