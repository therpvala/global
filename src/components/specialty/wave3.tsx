/**
 * Specialty wave 3 — premium consoles for high-traffic global routes.
 * Inspirations referenced for UX patterns only. No copyrighted assets.
 * Covers: Executive (SAP), Analytics (Tableau), Reports, Automation (n8n),
 * Support (Intercom), Messaging (Crisp), Notifications (Slack),
 * Profile (Linear), Settings (Stripe), Audit (Drata), Roles (Okta),
 * Knowledge (Notion), Resellers (WHMCS), Companies (Odoo Multi-Co),
 * AI Studio (Azure AI), Copilot (Perplexity), Invoices (Netsuite),
 * Licenses (Paddle), Documents (Dropbox), Welcome (Arc).
 */
import { Link } from "@tanstack/react-router";
import {
  Activity, AlertTriangle, Archive, ArrowRight, ArrowUpRight, Award, BadgeCheck, Bell,
  BookOpen, Bot, Building, Calendar, Check, ChevronRight, CircleDot, ClipboardList, Cloud,
  Command, CreditCard, Database, DollarSign, Download, ExternalLink, Eye, FileBarChart,
  FileCheck, FileText, Filter, Flag, Folder, Gauge, GitBranch, Globe2, Hash, Headphones,
  Inbox, Key, KeyRound, Languages, Layers, LineChart, Link2, Lock, Mail, MapPin, Megaphone,
  MessageSquare, Network, Phone, Plus, Repeat, Rocket, Search, Send, Settings, Shield,
  ShieldAlert, ShieldCheck, Sparkles, Star, Tag, Target, Terminal, TrendingDown, TrendingUp,
  UserCheck, Users, Video, Webhook, Workflow, Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ActivityFeed, FilterBar, KpiStrip, MiniBarChart, QuickActions, RecordsTable,
  SectionHeader, Sparkline, type Kpi, type ActivityItem, type RecordRow,
} from "../enterprise";

/* ----------------------------- Hero ----------------------------- */
function Hero({ eyebrow, title, subtitle, actions }: {
  eyebrow: { icon: any; text: string }[]; title: string; subtitle: string;
  actions?: { label: string; icon?: any }[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden">
      <div className="px-5 py-5 text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {eyebrow.map((e) => {
                const Icon = e.icon;
                return (
                  <Badge key={e.text} variant="secondary" className="font-normal">
                    <Icon className="mr-1 h-3 w-3" />{e.text}
                  </Badge>
                );
              })}
            </div>
            <h1 className="mt-1.5 text-2xl font-bold">{title}</h1>
            <p className="text-sm opacity-90 max-w-2xl">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <Input placeholder="Search…" className="h-9 pl-9 bg-white/15 border-white/20 placeholder:text-white/70 text-white" />
            </div>
            {(actions ?? [{ label: "New", icon: Plus }]).map((a) => {
              const Icon = a.icon ?? Plus;
              return (
                <Button key={a.label} size="sm" variant="secondary">
                  <Icon className="mr-1.5 h-3.5 w-3.5" />{a.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: any }) {
  return <div className="space-y-4">{children}</div>;
}

/* =========================================================
   1. Executive Dashboard — SAP Analytics Cloud Executive Board
   ========================================================= */
export function ExecutiveConsole() {
  const kpis: Kpi[] = [
    { label: "ARR", value: "$48.2M", delta: "+12.4%", tone: "up", hint: "Trailing 12 months", spark: [30,32,35,34,38,40,42,44,46,48] },
    { label: "Gross Margin", value: "72.1%", delta: "+1.8 pp", tone: "up", hint: "Cloud + services blend", spark: [68,69,69,70,70,71,71,72,72,72] },
    { label: "Net Retention", value: "118%", delta: "+3 pts", tone: "up", hint: "NRR last quarter", spark: [110,112,113,114,115,115,116,117,118,118] },
    { label: "Burn Multiple", value: "0.72x", delta: "-0.08", tone: "up", hint: "Efficient growth", spark: [1.0,0.95,0.9,0.85,0.82,0.8,0.78,0.75,0.73,0.72] },
  ];
  const board: RecordRow[] = [
    { id: "OKR-Q4-01", name: "Cross $50M ARR by EOY", status: "active", owner: "CEO Office", updated: "2h", amount: "82%", tag: "On track" },
    { id: "OKR-Q4-02", name: "Launch EU data residency", status: "review", owner: "Eng Leadership", updated: "today", amount: "64%", tag: "At risk" },
    { id: "OKR-Q4-03", name: "Reduce CAC payback to <14 mo", status: "active", owner: "Revenue", updated: "1d", amount: "71%", tag: "On track" },
    { id: "OKR-Q4-04", name: "Expand APAC franchise to 12 cities", status: "pending", owner: "Operations", updated: "3d", amount: "48%", tag: "Behind" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Sparkles, text: "Executive Board" }, { icon: Globe2, text: "FY24" }]}
        title="Executive command center"
        subtitle="Real-time view of ARR, retention, profitability and strategic OKRs across the enterprise."
        actions={[{ label: "Export board pack", icon: Download }, { label: "Schedule review", icon: Calendar }]}
      />
      <KpiStrip kpis={kpis} />
      <div className="grid lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4 space-y-3">
            <SectionHeader title="Quarterly performance" desc="ARR by segment · TTM" right={<Badge variant="outline">Q4 FY24</Badge>} />
            <MiniBarChart data={[18,22,28,31,35,38,42,46,48]} labels={["Q1","Q2","Q3","Q4","Q1","Q2","Q3","Q4","Q1"]} />
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { l: "Enterprise", v: "$28.1M", s: "+14%" },
                { l: "Mid-market", v: "$13.4M", s: "+9%" },
                { l: "SMB", v: "$6.7M", s: "+22%" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-border/60 p-3">
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider">{s.l}</div>
                  <div className="mt-1 text-lg font-bold">{s.v}</div>
                  <div className="text-xs text-success">{s.s}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <ActivityFeed items={[
          { who: "CFO", what: "approved board pack for", target: "Audit Committee", when: "12 min ago", kind: "approve" },
          { who: "CRO", what: "flagged EMEA pipeline", target: "Q4 forecast", when: "1h ago", kind: "update" },
          { who: "CEO", what: "commented on", target: "OKR-Q4-02", when: "3h ago", kind: "comment" },
          { who: "COO", what: "escalated", target: "APAC expansion", when: "yesterday", kind: "update" },
        ]} />
      </div>
      <Card>
        <CardContent className="p-4 space-y-3">
          <SectionHeader title="Strategic objectives" desc="Quarterly OKRs with health" />
          <RecordsTable rows={board} />
        </CardContent>
      </Card>
    </Shell>
  );
}

/* =========================================================
   2. Analytics — Tableau Pulse Executive Analytics
   ========================================================= */
export function AnalyticsConsole() {
  const kpis: Kpi[] = [
    { label: "Active dashboards", value: "184", delta: "+12", tone: "up", spark: [150,156,162,168,172,178,180,184] },
    { label: "Daily viewers", value: "2,418", delta: "+8%", tone: "up", spark: [1900,2000,2100,2200,2300,2350,2400,2418] },
    { label: "Queries / min", value: "642", delta: "+3%", tone: "up", spark: [500,540,580,600,610,620,630,642] },
    { label: "Data freshness", value: "<2 min", delta: "stable", tone: "neutral", spark: [2,2,1.8,2,2,2,1.9,2] },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: LineChart, text: "Analytics" }, { icon: Gauge, text: "Pulse" }]}
        title="Analytics workspace"
        subtitle="Curated metrics, anomaly detection and shared dashboards across every business unit."
        actions={[{ label: "New metric", icon: Plus }, { label: "Browse library", icon: BookOpen }]}
      />
      <KpiStrip kpis={kpis} />
      <div className="grid lg:grid-cols-3 gap-3">
        {[
          { t: "Revenue", v: "$4.82M", d: "+12.1%", s: [12,15,18,17,22,25,28,30,33,36] as number[], tone: "up" as const },
          { t: "Active users", v: "184,302", d: "+5.4%", s: [120,130,140,150,160,168,175,180,182,184] as number[], tone: "up" as const },
          { t: "Churn risk", v: "2.1%", d: "-0.3pp", s: [3.0,2.8,2.6,2.5,2.4,2.3,2.2,2.1,2.1,2.1] as number[], tone: "up" as const },
        ].map((m) => (
          <Card key={m.t}><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{m.t}</div>
              <Badge variant="outline" className="text-xs">Auto-insight</Badge>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold tabular-nums">{m.v}</div>
                <div className="text-xs text-success">{m.d}</div>
              </div>
              <Sparkline data={m.s} tone={m.tone} width={120} height={40} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Detected uptrend with 96% confidence. No anomalies last 24h.</p>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Trending dashboards" right={<Button variant="outline" size="sm">Open library</Button>} />
        <div className="grid md:grid-cols-2 gap-2">
          {["Revenue ops", "Product engagement", "Support SLA", "Marketing attribution", "Finance close", "Headcount"].map((d) => (
            <Link key={d} to="/analytics" className="group flex items-center justify-between rounded-lg border border-border/60 p-3 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><LineChart className="h-4 w-4" /></div>
                <div>
                  <div className="text-sm font-medium">{d}</div>
                  <div className="text-[11px] text-muted-foreground">Updated 4m ago · 18 viewers today</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   3. Reports — BI Reports
   ========================================================= */
export function ReportsConsole() {
  const reports: RecordRow[] = [
    { id: "RPT-001", name: "Monthly P&L close pack", status: "active", owner: "Finance", updated: "1h", amount: "PDF · 28p", tag: "Scheduled" },
    { id: "RPT-002", name: "Pipeline waterfall", status: "active", owner: "Revenue Ops", updated: "today", amount: "Live", tag: "Live" },
    { id: "RPT-003", name: "Headcount & attrition", status: "review", owner: "People", updated: "2d", amount: "XLSX", tag: "Quarterly" },
    { id: "RPT-004", name: "Customer health scoring", status: "active", owner: "CS", updated: "3d", amount: "Live", tag: "Weekly" },
    { id: "RPT-005", name: "Cohort retention v3", status: "draft", owner: "Product", updated: "5d", amount: "Live", tag: "Draft" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: FileBarChart, text: "BI Reports" }]}
        title="Enterprise reporting"
        subtitle="Subscribed, scheduled and ad-hoc reports across every domain."
        actions={[{ label: "New report", icon: Plus }, { label: "Subscriptions", icon: Bell }]}
      />
      <FilterBar placeholder="Search reports…" chips={["Owner", "Frequency", "Department", "Format"]} />
      <RecordsTable rows={reports} />
    </Shell>
  );
}

/* =========================================================
   4. Automation — n8n Enterprise / Zapier Central
   ========================================================= */
export function AutomationConsole() {
  const kpis: Kpi[] = [
    { label: "Active workflows", value: "147", delta: "+8", tone: "up" },
    { label: "Runs / day", value: "24,182", delta: "+12%", tone: "up", spark: [18,19,20,21,22,23,23,24] },
    { label: "Success rate", value: "99.4%", delta: "+0.2 pp", tone: "up" },
    { label: "Avg duration", value: "1.8s", delta: "-0.2s", tone: "up" },
  ];
  const flows: RecordRow[] = [
    { id: "WF-101", name: "Lead → CRM → Slack handoff", status: "active", owner: "Sales Ops", updated: "2m", amount: "1,284 runs/d", tag: "Trigger" },
    { id: "WF-102", name: "Invoice paid → Accounting close", status: "active", owner: "Finance", updated: "12m", amount: "412 runs/d", tag: "Webhook" },
    { id: "WF-103", name: "Churn risk → CS playbook", status: "active", owner: "CS Ops", updated: "1h", amount: "89 runs/d", tag: "Cron" },
    { id: "WF-104", name: "PR merged → Release notes", status: "review", owner: "DevEx", updated: "1d", amount: "—", tag: "Beta" },
    { id: "WF-105", name: "Refund > $5k → Manager approval", status: "active", owner: "Finance", updated: "3d", amount: "8 runs/d", tag: "Approval" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Workflow, text: "Automation" }, { icon: Zap, text: "Live" }]}
        title="Automation studio"
        subtitle="Build, monitor and govern every cross-system workflow."
        actions={[{ label: "New workflow", icon: Plus }, { label: "Template gallery", icon: Layers }]}
      />
      <KpiStrip kpis={kpis} />
      <Tabs defaultValue="workflows">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="runs">Run history</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="workflows" className="space-y-3">
          <FilterBar chips={["Status", "Trigger", "Owner", "Tag"]} />
          <RecordsTable rows={flows} />
        </TabsContent>
        <TabsContent value="runs">
          <Card><CardContent className="p-4 space-y-2">
            {["00:42:18", "00:42:11", "00:41:58", "00:41:42", "00:41:29"].map((t, i) => (
              <div key={t} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <CircleDot className={`h-3 w-3 ${i === 2 ? "text-destructive" : "text-success"}`} />
                  <span className="font-mono text-xs">{t}</span>
                  <span className="font-medium">WF-{100 + i}</span>
                  <span className="text-muted-foreground">{i === 2 ? "failed at HTTP step" : "completed"}</span>
                </div>
                <span className="text-xs text-muted-foreground">{(1.2 + i * 0.3).toFixed(1)}s</span>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="triggers"><Card><CardContent className="p-6 text-sm text-muted-foreground">Webhook, cron and event triggers registry.</CardContent></Card></TabsContent>
        <TabsContent value="templates"><Card><CardContent className="p-6 text-sm text-muted-foreground">Pre-built enterprise workflow templates.</CardContent></Card></TabsContent>
      </Tabs>
    </Shell>
  );
}

/* =========================================================
   5. Support — Intercom Support Workspace
   ========================================================= */
export function SupportConsole() {
  const kpis: Kpi[] = [
    { label: "Open tickets", value: "187", delta: "-12", tone: "up" },
    { label: "First reply", value: "4m 12s", delta: "-18%", tone: "up" },
    { label: "CSAT", value: "94%", delta: "+1 pt", tone: "up" },
    { label: "Backlog SLA", value: "98.2%", delta: "+0.3pp", tone: "up" },
  ];
  const tickets = [
    { id: "T-9821", who: "Aisha N.", subj: "API key rotation failed on EU cluster", tag: "Bug", sla: "ok", t: "4m" },
    { id: "T-9820", who: "Marco V.", subj: "Cannot import contacts from CSV", tag: "Question", sla: "warn", t: "18m" },
    { id: "T-9819", who: "Lena K.", subj: "Charge disputed — refund question", tag: "Billing", sla: "ok", t: "32m" },
    { id: "T-9818", who: "Devon S.", subj: "Slack integration disconnected overnight", tag: "Bug", sla: "breach", t: "2h" },
    { id: "T-9817", who: "Priya R.", subj: "Need SAML SSO for new tenant", tag: "Feature", sla: "ok", t: "3h" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Headphones, text: "Support" }, { icon: Inbox, text: "Inbox" }]}
        title="Support workspace"
        subtitle="Unified inbox, knowledge and automations powering every customer conversation."
        actions={[{ label: "Compose", icon: Send }, { label: "Macros", icon: Zap }]}
      />
      <KpiStrip kpis={kpis} />
      <div className="grid lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2"><CardContent className="p-0">
          <div className="border-b border-border/60 px-4 py-2.5 flex items-center justify-between">
            <div className="text-sm font-semibold">Priority inbox</div>
            <Badge variant="secondary">{tickets.length} open</Badge>
          </div>
          <ul className="divide-y divide-border/60">
            {tickets.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer">
                <Avatar className="h-8 w-8"><AvatarFallback className="text-[11px]">{t.who.split(" ").map(p => p[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{t.who}</span>
                    <Badge variant="outline" className="text-[10px] h-4 font-normal">{t.tag}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{t.subj}</div>
                </div>
                <Badge variant="outline" className={t.sla === "breach" ? "border-destructive/40 text-destructive" : t.sla === "warn" ? "border-warning/40 text-warning" : "border-success/40 text-success"}>{t.t}</Badge>
              </li>
            ))}
          </ul>
        </CardContent></Card>
        <div className="space-y-3">
          <Card><CardContent className="p-4">
            <SectionHeader title="Team load" />
            <div className="mt-3 space-y-2">
              {[["Layla","32"],["Marco","28"],["Aki","21"],["Tomás","18"]].map(([n,c]) => (
                <div key={n} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{n[0]}</AvatarFallback></Avatar>{n}</span>
                  <span className="text-muted-foreground">{c} open</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <SectionHeader title="AI suggestions" />
            <ul className="mt-2 space-y-2 text-xs">
              <li className="flex gap-2"><Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /><span>Auto-close 14 resolved threads with no reply in 72h</span></li>
              <li className="flex gap-2"><Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /><span>Add macro for "API key rotation" — 8 tickets this week</span></li>
            </ul>
          </CardContent></Card>
        </div>
      </div>
    </Shell>
  );
}

/* =========================================================
   6. Messaging — Crisp Enterprise Inbox
   ========================================================= */
export function MessagingConsole() {
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: MessageSquare, text: "Live chat" }]}
        title="Live chat operations"
        subtitle="Real-time conversations across web, WhatsApp, SMS and email."
        actions={[{ label: "Compose", icon: Send }, { label: "Routing", icon: Workflow }]}
      />
      <KpiStrip kpis={[
        { label: "Live now", value: "42", delta: "+6", tone: "up" },
        { label: "Avg response", value: "38s", delta: "-12s", tone: "up" },
        { label: "Channels", value: "7", delta: "All up", tone: "up" },
        { label: "Bot resolve", value: "61%", delta: "+4pp", tone: "up" },
      ]} />
      <div className="grid lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-3">
          <div className="text-xs font-semibold mb-2">Channels</div>
          <ul className="space-y-1.5 text-sm">
            {[["Web chat",24],["WhatsApp",9],["SMS",4],["Email",18],["Messenger",3]].map(([n,c]) => (
              <li key={n} className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-muted/50 cursor-pointer">
                <span className="flex items-center gap-2"><Hash className="h-3 w-3 text-muted-foreground" />{n}</span>
                <Badge variant="secondary" className="h-4 text-[10px]">{c}</Badge>
              </li>
            ))}
          </ul>
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardContent className="p-0">
          <div className="border-b border-border/60 px-4 py-2.5 text-sm font-semibold">Active threads</div>
          <ul className="divide-y divide-border/60">
            {["Renewal question — Acme","Onboarding — Globex","Pricing — Initech","Bug report — Stark","Demo follow-up — Wayne"].map((s, i) => (
              <li key={s} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 cursor-pointer">
                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{s[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{s}</div>
                  <div className="text-[11px] text-muted-foreground">Typing… · {i + 1}m</div>
                </div>
                <CircleDot className="h-3 w-3 text-success" />
              </li>
            ))}
          </ul>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <SectionHeader title="Saved replies" />
          <ul className="mt-2 space-y-1.5 text-xs">
            {["Welcome new user","Refund policy","Trial extension","Schedule demo","Bug acknowledged"].map((r) => (
              <li key={r} className="rounded border border-border/60 px-2 py-1.5 hover:bg-accent cursor-pointer">{r}</li>
            ))}
          </ul>
        </CardContent></Card>
      </div>
    </Shell>
  );
}

/* =========================================================
   7. Notifications — Slack Activity Feed
   ========================================================= */
export function NotificationsConsole() {
  const items: ActivityItem[] = [
    { who: "Billing", what: "marked invoice", target: "INV-10921 paid ($12,400)", when: "2 min ago", kind: "approve" },
    { who: "Datadog", what: "p95 latency spike on", target: "api-gateway-eu", when: "8 min ago", kind: "update" },
    { who: "Marina S.", what: "mentioned you in", target: "Renewal — Globex deal", when: "12 min ago", kind: "comment" },
    { who: "CI/CD", what: "deployed", target: "release v3.42.1 to production", when: "1h ago", kind: "create" },
    { who: "Security", what: "blocked sign-in attempt for", target: "user@rival.com", when: "2h ago", kind: "reject" },
    { who: "Finance", what: "approved", target: "PO-2918 ($48,200)", when: "3h ago", kind: "approve" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Bell, text: "Notifications" }]}
        title="Activity feed"
        subtitle="Every mention, approval, alert and deployment across your workspace."
        actions={[{ label: "Mark all read", icon: Check }, { label: "Preferences", icon: Settings }]}
      />
      <div className="grid lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-3">
          <div className="text-xs font-semibold mb-2">Filters</div>
          <ul className="space-y-1 text-sm">
            {[["All",148],["Mentions",12],["Approvals",6],["Alerts",18],["Mentions only",4],["Threads",22]].map(([n,c]) => (
              <li key={n} className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-muted/50 cursor-pointer">
                <span>{n}</span><Badge variant="secondary" className="h-4 text-[10px]">{c}</Badge>
              </li>
            ))}
          </ul>
        </CardContent></Card>
        <div className="lg:col-span-3"><ActivityFeed items={items} /></div>
      </div>
    </Shell>
  );
}

/* =========================================================
   8. Profile — Linear Profile Workspace
   ========================================================= */
export function ProfileConsole() {
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: UserCheck, text: "Profile" }]}
        title="Your workspace"
        subtitle="Identity, preferences, sessions and personal automations."
        actions={[{ label: "Edit profile", icon: UserCheck }]}
      />
      <div className="grid lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-1"><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14"><AvatarFallback className="text-base bg-primary/20 text-primary">VA</AvatarFallback></Avatar>
            <div>
              <div className="font-semibold">Vala Admin</div>
              <div className="text-xs text-muted-foreground">admin@vala.io · Super Admin</div>
              <Badge variant="outline" className="mt-1 border-success/40 text-success">Active</Badge>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Timezone</span><span>Europe/Lisbon</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span>English (US)</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">2FA</span><span className="text-success">Enabled</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span>Jan 2023</span></div>
          </div>
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardContent className="p-4 space-y-3">
          <SectionHeader title="Activity" desc="What you've been doing" />
          <ActivityFeed items={[
            { who: "You", what: "approved", target: "PO-2918", when: "today", kind: "approve" },
            { who: "You", what: "commented on", target: "OKR-Q4-02", when: "yesterday", kind: "comment" },
            { who: "You", what: "deployed", target: "release v3.42.0", when: "2d ago", kind: "create" },
            { who: "You", what: "rejected", target: "expense-1129", when: "3d ago", kind: "reject" },
          ]} />
        </CardContent></Card>
      </div>
      <Card><CardContent className="p-4">
        <SectionHeader title="Active sessions" right={<Button variant="outline" size="sm">Sign out all</Button>} />
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Device</TableHead><TableHead>Location</TableHead><TableHead>Last active</TableHead><TableHead>IP</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {[["MacBook Pro 16","Lisbon, PT","now","91.108.4.21"],["iPhone 15","Lisbon, PT","2h","91.108.4.21"],["Chrome — Windows","Berlin, DE","2d","203.0.113.5"]].map(([d,l,t,ip]) => (
              <TableRow key={d}><TableCell className="text-sm">{d}</TableCell><TableCell className="text-sm">{l}</TableCell><TableCell className="text-sm text-muted-foreground">{t}</TableCell><TableCell className="font-mono text-xs">{ip}</TableCell><TableCell><Button size="sm" variant="ghost">Revoke</Button></TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   9. Settings — Stripe Settings Architecture
   ========================================================= */
export function SettingsConsole() {
  const groups = [
    { title: "Account", icon: UserCheck, items: ["Profile","Personal API keys","Email preferences","Localization"] },
    { title: "Workspace", icon: Building, items: ["Branding","Domains","Members","Roles & permissions","Billing plan"] },
    { title: "Developer", icon: Terminal, items: ["API keys","Webhooks","Events","Sandboxes","CLI tokens"] },
    { title: "Security", icon: Shield, items: ["2FA","SSO / SAML","IP allowlist","Audit logs","Session policy"] },
    { title: "Integrations", icon: Layers, items: ["Slack","Salesforce","HubSpot","Stripe","Google Workspace"] },
    { title: "Compliance", icon: ShieldCheck, items: ["Data residency","DPA","Retention policy","Privacy requests"] },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Settings, text: "Settings" }]}
        title="Workspace settings"
        subtitle="Account, workspace, developer, security, integrations and compliance — all in one place."
        actions={[{ label: "Save changes", icon: Check }]}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <Card key={g.title}><CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                <div className="font-semibold">{g.title}</div>
              </div>
              <ul className="space-y-1">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-muted/50 cursor-pointer">
                    <span>{it}</span><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </CardContent></Card>
          );
        })}
      </div>
    </Shell>
  );
}

/* =========================================================
   10. Audit & Compliance — Drata Enterprise Compliance
   ========================================================= */
export function AuditConsole() {
  const frameworks = [
    { name: "SOC 2 Type II", controls: 78, ready: 96 },
    { name: "ISO 27001:2022", controls: 114, ready: 92 },
    { name: "GDPR", controls: 46, ready: 100 },
    { name: "HIPAA", controls: 54, ready: 88 },
    { name: "PCI DSS 4.0", controls: 132, ready: 79 },
  ];
  const evidence: RecordRow[] = [
    { id: "EV-401", name: "Quarterly access review — Production", status: "active", owner: "Security", updated: "today", amount: "Auto", tag: "Q4" },
    { id: "EV-402", name: "Vendor security questionnaire — AWS", status: "review", owner: "GRC", updated: "1d", amount: "Manual", tag: "Annual" },
    { id: "EV-403", name: "Incident postmortem — INC-2024-08", status: "active", owner: "SRE", updated: "3d", amount: "Auto", tag: "P2" },
    { id: "EV-404", name: "Background checks evidence", status: "pending", owner: "People Ops", updated: "5d", amount: "Manual", tag: "HR" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: ShieldCheck, text: "Compliance" }, { icon: BadgeCheck, text: "Audit-ready" }]}
        title="Compliance & audit"
        subtitle="Continuous evidence collection across every framework you operate under."
        actions={[{ label: "Export evidence", icon: Download }, { label: "Schedule audit", icon: Calendar }]}
      />
      <KpiStrip kpis={[
        { label: "Frameworks", value: "5", delta: "Active", tone: "up" },
        { label: "Controls passing", value: "92%", delta: "+3pp", tone: "up" },
        { label: "Open findings", value: "11", delta: "-4", tone: "up" },
        { label: "Next audit", value: "28 days", delta: "SOC 2", tone: "neutral" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Frameworks" desc="Audit readiness by framework" />
        <div className="space-y-2">
          {frameworks.map((f) => (
            <div key={f.name} className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-sm font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.controls} controls · {f.ready}% ready</div>
              </div>
              <Progress value={f.ready} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Evidence library" right={<Button variant="outline" size="sm">Upload</Button>} />
        <RecordsTable rows={evidence} />
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   11. Roles — Okta Identity Governance
   ========================================================= */
export function RolesConsole() {
  const roles = [
    { r: "Super Admin", users: 3, perms: 184, scope: "Global", type: "System", risk: "Critical", updated: "2d" },
    { r: "Admin", users: 12, perms: 142, scope: "Workspace", type: "System", risk: "High", updated: "5d" },
    { r: "Manager", users: 48, perms: 84, scope: "Team", type: "Custom", risk: "Medium", updated: "1w" },
    { r: "Account Manager", users: 22, perms: 56, scope: "Customer", type: "Custom", risk: "Medium", updated: "2w" },
    { r: "Accountant", users: 8, perms: 38, scope: "Finance", type: "Custom", risk: "High", updated: "3d" },
    { r: "Support Agent", users: 31, perms: 24, scope: "Support", type: "Custom", risk: "Low", updated: "1d" },
    { r: "Read-only", users: 64, perms: 12, scope: "Reports", type: "System", risk: "Low", updated: "1mo" },
  ];
  const permCatalog = [
    { cat: "Billing", perms: ["invoices.read","invoices.write","refunds.issue","payouts.manage"], sensitive: 2 },
    { cat: "CRM", perms: ["leads.read","leads.write","deals.close","contacts.export"], sensitive: 1 },
    { cat: "HR", perms: ["employees.read","payroll.run","offers.send","terminate"], sensitive: 3 },
    { cat: "Platform", perms: ["users.invite","roles.assign","api-keys.create","audit.read"], sensitive: 4 },
    { cat: "Data", perms: ["reports.read","reports.export","warehouse.query","pii.unmask"], sensitive: 2 },
  ];
  const assignments: RecordRow[] = [
    { id: "U-8821", name: "Ava Chen", status: "active", owner: "Admin · Manager", updated: "just now", tag: "SSO" },
    { id: "U-8809", name: "Marcus Hill", status: "active", owner: "Account Manager", updated: "12m", tag: "SSO+MFA" },
    { id: "U-8790", name: "Priya Shah", status: "review", owner: "Accountant", updated: "1h", tag: "MFA" },
    { id: "U-8712", name: "Diego Alvarez", status: "active", owner: "Support Agent", updated: "3h", tag: "SSO" },
    { id: "U-8688", name: "Yui Nakamura", status: "pending", owner: "Manager", updated: "1d", tag: "Pending MFA" },
  ];
  const requests: RecordRow[] = [
    { id: "REQ-4421", name: "Elevate to Finance Admin", status: "pending", owner: "Priya Shah", updated: "18m", tag: "Justified" },
    { id: "REQ-4420", name: "Grant warehouse.query", status: "pending", owner: "Ravi Kumar", updated: "42m", tag: "SoD check" },
    { id: "REQ-4418", name: "Add to Support Agent", status: "active", owner: "Nia Adeyemi", updated: "2h", tag: "Auto-approved" },
    { id: "REQ-4415", name: "Emergency break-glass", status: "review", owner: "Ops · On-call", updated: "5h", tag: "Time-bound 4h" },
  ];
  const reviews = [
    { name: "Q4 Finance access review", scope: "Accountant + Admin", progress: 72, due: "in 6 days", reviewer: "CFO office" },
    { name: "Contractor quarterly", scope: "External · 42 users", progress: 34, due: "in 12 days", reviewer: "People ops" },
    { name: "Privileged access", scope: "Super Admin + break-glass", progress: 100, due: "closed", reviewer: "Security" },
    { name: "PII unmask certification", scope: "Data · 18 users", progress: 58, due: "in 3 days", reviewer: "DPO" },
  ];
  const policies = [
    { p: "MFA required for elevated roles", type: "Condition", roles: "Admin, Super Admin, Finance", state: "Enforced" },
    { p: "IP allowlist · corporate + VPN", type: "Network", roles: "All roles", state: "Enforced" },
    { p: "Device posture · managed only", type: "Device", roles: "Super Admin", state: "Enforced" },
    { p: "Just-in-time · 4h max", type: "JIT", roles: "Break-glass", state: "Enforced" },
    { p: "Approval chain · 2-person rule", type: "Workflow", roles: "Refunds > $5k", state: "Enforced" },
    { p: "Session lifetime · 8h", type: "Session", roles: "All roles", state: "Enforced" },
  ];
  const sod = [
    { pair: "Vendor create ↔ Payment approve", users: 2, severity: "High" },
    { pair: "Journal post ↔ Journal approve", users: 1, severity: "Critical" },
    { pair: "User invite ↔ Role assign", users: 4, severity: "Medium" },
    { pair: "Refund issue ↔ Refund approve", users: 0, severity: "Low" },
  ];
  const audit: ActivityItem[] = [
    { who: "Ava Chen", what: "assigned", target: "Manager → Marcus Hill", when: "3m", kind: "approve" },
    { who: "System", what: "expired JIT", target: "Break-glass · Ops", when: "22m", kind: "update" },
    { who: "Priya Shah", what: "requested", target: "Finance Admin", when: "1h", kind: "create" },
    { who: "CFO office", what: "certified", target: "Q3 access review", when: "yesterday", kind: "approve" },
    { who: "Security", what: "revoked", target: "warehouse.query · U-8503", when: "2d", kind: "reject" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: ShieldCheck, text: "Identity governance" }]}
        title="Roles & permissions"
        subtitle="Define, assign and audit every role across the platform with least-privilege defaults."
        actions={[{ label: "New role", icon: Plus }, { label: "Access review", icon: ClipboardList }, { label: "Import from IdP", icon: Download }]}
      />
      <KpiStrip kpis={[
        { label: "Roles", value: "18", delta: "+2", tone: "up" },
        { label: "Users with elevated access", value: "27", delta: "-3", tone: "up" },
        { label: "Pending access requests", value: "9", delta: "SLA ok", tone: "neutral" },
        { label: "Last access review", value: "12 days", delta: "On schedule", tone: "up" },
      ]} />
      <Tabs defaultValue="roles" className="space-y-3">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="requests">Access requests</TabsTrigger>
          <TabsTrigger value="reviews">Certifications</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="sod">SoD conflicts</TabsTrigger>
          <TabsTrigger value="delegation">Delegation</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="api">API & SCIM</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Roles matrix" right={<FilterBar />} />
            <Table>
              <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Role</TableHead><TableHead>Type</TableHead><TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead><TableHead>Scope</TableHead><TableHead>Risk</TableHead>
                <TableHead>Updated</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {roles.map((r) => (
                  <TableRow key={r.r}>
                    <TableCell className="font-medium">{r.r}</TableCell>
                    <TableCell><Badge variant="outline" className="font-normal">{r.type}</Badge></TableCell>
                    <TableCell>{r.users}</TableCell>
                    <TableCell><Progress value={(r.perms / 184) * 100} className="h-1.5 w-32" /><span className="text-[11px] text-muted-foreground">{r.perms} granted</span></TableCell>
                    <TableCell><Badge variant="outline" className="font-normal">{r.scope}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        "font-normal " + (r.risk === "Critical" ? "text-destructive border-destructive/40"
                          : r.risk === "High" ? "text-warning border-warning/40"
                          : r.risk === "Medium" ? "text-primary border-primary/40"
                          : "text-muted-foreground")
                      }>{r.risk}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.updated}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost">Clone</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
          <div className="grid md:grid-cols-3 gap-3">
            <Card><CardContent className="p-4">
              <SectionHeader title="Role hierarchy" />
              <ul className="mt-2 text-sm space-y-1.5">
                <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Super Admin</li>
                <li className="pl-5 flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Admin</li>
                <li className="pl-10 flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Manager</li>
                <li className="pl-14 flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Support Agent</li>
                <li className="pl-10 flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Accountant</li>
                <li className="pl-10 flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Account Manager</li>
              </ul>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <SectionHeader title="New role" />
              <div className="mt-2 space-y-2 text-sm">
                <Input placeholder="Role name" className="h-9" />
                <Input placeholder="Description" className="h-9" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Scope" defaultValue="Workspace" className="h-9" />
                  <Input placeholder="Base role" defaultValue="Read-only" className="h-9" />
                </div>
                <Button className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Create role</Button>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <SectionHeader title="Coverage" />
              <MiniBarChart data={[12,18,24,22,30,28,34]} labels={["W1","W2","W3","W4","W5","W6","W7"]} />
              <div className="mt-2 text-xs text-muted-foreground">Role assignments per week · trending up</div>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Permission catalog" right={<Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" />New permission</Button>} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {permCatalog.map((c) => (
                <div key={c.cat} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold flex items-center gap-2"><Key className="h-3.5 w-3.5" />{c.cat}</div>
                    <Badge variant="outline" className="font-normal text-warning border-warning/40">{c.sensitive} sensitive</Badge>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs">
                    {c.perms.map((p) => (
                      <li key={p} className="flex items-center justify-between rounded border border-border/60 px-2 py-1">
                        <span className="font-mono">{p}</span>
                        <BadgeCheck className="h-3 w-3 text-success" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Role × Permission matrix" />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Permission</TableHead>
                  {roles.slice(0,5).map((r) => <TableHead key={r.r} className="text-center">{r.r}</TableHead>)}
                </TableRow></TableHeader>
                <TableBody>
                  {["invoices.write","refunds.issue","payroll.run","api-keys.create","pii.unmask","reports.export"].map((p, i) => (
                    <TableRow key={p}>
                      <TableCell className="font-mono text-xs">{p}</TableCell>
                      {roles.slice(0,5).map((r, j) => (
                        <TableCell key={r.r} className="text-center">
                          {(i + j) % 3 === 0 ? <Check className="h-3.5 w-3.5 text-success inline" /> : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="User assignments" right={<div className="flex gap-2"><FilterBar /><Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" />Assign</Button></div>} />
            <RecordsTable rows={assignments} />
          </CardContent></Card>
          <div className="grid md:grid-cols-2 gap-3">
            <Card><CardContent className="p-4">
              <SectionHeader title="Groups → roles mapping" />
              <ul className="mt-2 divide-y divide-border/60 text-sm">
                {[
                  { g: "eng-platform", r: "Admin", n: 12 },
                  { g: "finance-core", r: "Accountant", n: 8 },
                  { g: "sales-emea", r: "Account Manager", n: 14 },
                  { g: "support-t1", r: "Support Agent", n: 22 },
                ].map((x) => (
                  <li key={x.g} className="flex items-center justify-between py-2">
                    <span className="font-mono text-xs">{x.g}</span>
                    <span className="text-xs text-muted-foreground">→ {x.r} · {x.n} users</span>
                  </li>
                ))}
              </ul>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <SectionHeader title="Bulk actions" />
              <div className="mt-2 space-y-2">
                <Button variant="outline" className="w-full justify-start"><Users className="h-3.5 w-3.5 mr-2" />Bulk assign role</Button>
                <Button variant="outline" className="w-full justify-start"><UserCheck className="h-3.5 w-3.5 mr-2" />Bulk revoke role</Button>
                <Button variant="outline" className="w-full justify-start"><Download className="h-3.5 w-3.5 mr-2" />Export assignments (CSV)</Button>
                <Button variant="outline" className="w-full justify-start"><Repeat className="h-3.5 w-3.5 mr-2" />Sync from IdP now</Button>
              </div>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Pending access requests" right={<Button size="sm" variant="outline"><ClipboardList className="h-3.5 w-3.5 mr-1" />My queue</Button>} />
            <RecordsTable rows={requests} />
          </CardContent></Card>
          <div className="grid md:grid-cols-3 gap-3">
            <Card><CardContent className="p-4"><SectionHeader title="SLA" />
              <div className="mt-2 text-2xl font-bold">4h 12m</div>
              <div className="text-xs text-muted-foreground">Avg time to approve · target 8h</div>
              <Progress value={72} className="mt-2 h-1.5" />
            </CardContent></Card>
            <Card><CardContent className="p-4"><SectionHeader title="Auto-approval rules" />
              <ul className="mt-2 text-xs space-y-1">
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-warning" />Same team + Read-only → auto</li>
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-warning" />Support role during on-call → auto</li>
                <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-warning" />Time-bound &lt; 2h → auto with MFA</li>
              </ul>
            </CardContent></Card>
            <Card><CardContent className="p-4"><SectionHeader title="Break-glass" />
              <div className="mt-2 text-xs text-muted-foreground">Emergency elevation with mandatory review.</div>
              <Button className="mt-2 w-full" variant="outline"><ShieldAlert className="h-3.5 w-3.5 mr-1" />Request break-glass</Button>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Access certifications" right={<Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" />New campaign</Button>} />
            <div className="grid md:grid-cols-2 gap-3">
              {reviews.map((r) => (
                <div key={r.name} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{r.name}</div>
                    <Badge variant="outline" className="font-normal">{r.due}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.scope} · reviewer {r.reviewer}</div>
                  <Progress value={r.progress} className="mt-2 h-1.5" />
                  <div className="mt-1 text-[11px] text-muted-foreground">{r.progress}% complete</div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Conditional access policies" right={<Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5 mr-1" />New policy</Button>} />
            <Table>
              <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Policy</TableHead><TableHead>Type</TableHead><TableHead>Applies to</TableHead><TableHead>State</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {policies.map((p) => (
                  <TableRow key={p.p}>
                    <TableCell className="font-medium">{p.p}</TableCell>
                    <TableCell><Badge variant="outline" className="font-normal">{p.type}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.roles}</TableCell>
                    <TableCell><Badge variant="outline" className="font-normal text-success border-success/40">{p.state}</Badge></TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="ghost">Edit</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="sod" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Segregation of Duties (SoD) conflicts" right={<Button size="sm" variant="outline"><Shield className="h-3.5 w-3.5 mr-1" />Run analysis</Button>} />
            <Table>
              <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Conflict pair</TableHead><TableHead>Users affected</TableHead><TableHead>Severity</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {sod.map((s) => (
                  <TableRow key={s.pair}>
                    <TableCell className="font-medium">{s.pair}</TableCell>
                    <TableCell>{s.users}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        "font-normal " + (s.severity === "Critical" ? "text-destructive border-destructive/40"
                          : s.severity === "High" ? "text-warning border-warning/40"
                          : s.severity === "Medium" ? "text-primary border-primary/40"
                          : "text-muted-foreground")
                      }>{s.severity}</Badge>
                    </TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="ghost">Resolve</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="delegation" className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Card><CardContent className="p-4">
              <SectionHeader title="Delegated administration" />
              <ul className="mt-2 divide-y divide-border/60 text-sm">
                {[
                  { d: "EMEA sales admins", scope: "Region · EMEA", roles: "Manager, Account Manager" },
                  { d: "Finance controllers", scope: "Company · all", roles: "Accountant" },
                  { d: "Support leads", scope: "Support tier 1-2", roles: "Support Agent" },
                ].map((x) => (
                  <li key={x.d} className="py-2">
                    <div className="font-medium">{x.d}</div>
                    <div className="text-xs text-muted-foreground">{x.scope} · {x.roles}</div>
                  </li>
                ))}
              </ul>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <SectionHeader title="Time-bound elevation (JIT)" />
              <ul className="mt-2 divide-y divide-border/60 text-sm">
                {[
                  { u: "Ops · On-call", role: "Super Admin", left: "3h 12m" },
                  { u: "Priya Shah", role: "Finance Admin", left: "1h 40m" },
                ].map((x) => (
                  <li key={x.u} className="flex items-center justify-between py-2">
                    <div><div className="font-medium">{x.u}</div><div className="text-xs text-muted-foreground">→ {x.role}</div></div>
                    <Badge variant="outline" className="font-normal">{x.left} left</Badge>
                  </li>
                ))}
              </ul>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-3">
          <Card><CardContent className="p-4 space-y-3">
            <SectionHeader title="Governance audit trail" right={<Button size="sm" variant="outline"><Download className="h-3.5 w-3.5 mr-1" />Export</Button>} />
            <ActivityFeed items={audit} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Card><CardContent className="p-4">
              <SectionHeader title="SCIM provisioning" />
              <div className="mt-2 text-xs text-muted-foreground">Endpoint</div>
              <div className="mt-1 rounded-md border border-border/60 bg-muted/40 p-2 font-mono text-xs">https://api.saas-vala.app/scim/v2</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded border border-border/60 p-2"><div className="text-muted-foreground">Last sync</div><div className="font-semibold">2m ago</div></div>
                <div className="rounded border border-border/60 p-2"><div className="text-muted-foreground">Users provisioned</div><div className="font-semibold">312</div></div>
              </div>
              <Button className="mt-3 w-full" variant="outline"><KeyRound className="h-3.5 w-3.5 mr-1" />Rotate SCIM token</Button>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <SectionHeader title="Identity providers" />
              <ul className="mt-2 divide-y divide-border/60 text-sm">
                {[
                  { p: "Okta", proto: "SAML 2.0", status: "Connected" },
                  { p: "Azure AD", proto: "OIDC", status: "Connected" },
                  { p: "Google Workspace", proto: "OIDC", status: "Connected" },
                ].map((x) => (
                  <li key={x.p} className="flex items-center justify-between py-2">
                    <div><div className="font-medium">{x.p}</div><div className="text-xs text-muted-foreground">{x.proto}</div></div>
                    <Badge variant="outline" className="font-normal text-success border-success/40">{x.status}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

/* =========================================================
   12. Knowledge — Notion Enterprise Content Hub
   ========================================================= */
export function KnowledgeConsole() {
  const spaces = [
    { s: "Engineering", pages: 412, updated: "2h" },
    { s: "Customer Success", pages: 184, updated: "today" },
    { s: "Sales playbooks", pages: 96, updated: "1d" },
    { s: "People ops", pages: 74, updated: "2d" },
    { s: "Security & compliance", pages: 58, updated: "3d" },
    { s: "Product specs", pages: 322, updated: "12m" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: BookOpen, text: "Knowledge" }]}
        title="Content & knowledge hub"
        subtitle="Wikis, runbooks, playbooks and onboarding — searchable and AI-assisted."
        actions={[{ label: "New page", icon: Plus }, { label: "Templates", icon: Layers }]}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {spaces.map((s) => (
          <Card key={s.s}><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{s.s}</div>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{s.pages} pages · updated {s.updated}</div>
            <Progress value={Math.min(s.pages / 5, 100)} className="mt-3 h-1" />
            <Button variant="outline" size="sm" className="mt-3 w-full">Open space</Button>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Recently edited" right={<Button variant="ghost" size="sm">View all</Button>} />
        <ul className="divide-y divide-border/60">
          {["Incident response runbook","Customer escalation playbook","Onboarding 30/60/90","Q4 release notes","DPA template"].map((p, i) => (
            <li key={p} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{p}</span></div>
              <span className="text-xs text-muted-foreground">{["12m","1h","3h","yesterday","2d"][i]}</span>
            </li>
          ))}
        </ul>
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   13. Resellers — WHMCS Reseller Center / Cloudways Partner
   ========================================================= */
export function ResellersConsole() {
  const tiers = [
    { t: "Platinum", count: 8, gmv: "$1.84M", margin: "30%" },
    { t: "Gold", count: 24, gmv: "$2.62M", margin: "22%" },
    { t: "Silver", count: 78, gmv: "$1.18M", margin: "15%" },
    { t: "Bronze", count: 142, gmv: "$0.41M", margin: "10%" },
  ];
  const partners: RecordRow[] = [
    { id: "RES-001", name: "CloudNova Reseller", status: "active", owner: "EU · DACH", updated: "2h", amount: "$284k", tag: "Platinum" },
    { id: "RES-002", name: "AtlasHost Partner", status: "active", owner: "NA · US-East", updated: "1d", amount: "$172k", tag: "Gold" },
    { id: "RES-003", name: "Pacific MSP", status: "review", owner: "APAC · SG", updated: "2d", amount: "$98k", tag: "Gold" },
    { id: "RES-004", name: "ValleyTech Group", status: "pending", owner: "NA · US-West", updated: "5d", amount: "$54k", tag: "Silver" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Network, text: "Reseller program" }]}
        title="Reseller operations"
        subtitle="Tiered partner program with provisioning, margin and renewals."
        actions={[{ label: "Invite reseller", icon: Plus }, { label: "Commission run", icon: DollarSign }]}
      />
      <KpiStrip kpis={[
        { label: "Active resellers", value: "252", delta: "+18", tone: "up" },
        { label: "GMV (90d)", value: "$6.05M", delta: "+14%", tone: "up", spark: [3,3.5,4,4.4,4.8,5.2,5.6,6.05] },
        { label: "Avg margin", value: "21.4%", delta: "+0.6pp", tone: "up" },
        { label: "Pending payouts", value: "$148k", delta: "Cycle Nov", tone: "neutral" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Tier performance" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((t) => (
            <div key={t.t} className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between"><div className="font-semibold">{t.t}</div><Award className="h-4 w-4 text-warning" /></div>
              <div className="mt-2 text-2xl font-bold">{t.count}</div>
              <div className="text-xs text-muted-foreground">GMV {t.gmv} · margin {t.margin}</div>
            </div>
          ))}
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Top partners" right={<Button variant="outline" size="sm">Open directory</Button>} />
        <RecordsTable rows={partners} />
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   14. Multi-Company — Odoo Multi-Company Enterprise
   ========================================================= */
export function CompaniesConsole() {
  const companies = [
    { c: "Vala Holdings", reg: "PT", emp: 184, rev: "$28.4M", status: "active" },
    { c: "Vala USA Inc.", reg: "US-DE", emp: 96, rev: "$18.2M", status: "active" },
    { c: "Vala GmbH", reg: "DE", emp: 42, rev: "$6.8M", status: "active" },
    { c: "Vala APAC Pte.", reg: "SG", emp: 28, rev: "$3.1M", status: "active" },
    { c: "Vala UK Ltd.", reg: "UK", emp: 18, rev: "$1.9M", status: "pending" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Building, text: "Group" }, { icon: Globe2, text: "Multi-company" }]}
        title="Multi-company governance"
        subtitle="Legal entities, intercompany ledgers and consolidated reporting."
        actions={[{ label: "New entity", icon: Plus }, { label: "Consolidate", icon: Layers }]}
      />
      <KpiStrip kpis={[
        { label: "Entities", value: "5", delta: "+1", tone: "up" },
        { label: "Group revenue", value: "$58.4M", delta: "+11%", tone: "up" },
        { label: "Intercompany open", value: "$1.24M", delta: "Net", tone: "neutral" },
        { label: "Tax jurisdictions", value: "12", delta: "Active", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Group entities" />
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Entity</TableHead><TableHead>Region</TableHead><TableHead>Headcount</TableHead><TableHead>Revenue (TTM)</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {companies.map((c) => (
              <TableRow key={c.c}>
                <TableCell className="font-medium">{c.c}</TableCell>
                <TableCell><Badge variant="outline">{c.reg}</Badge></TableCell>
                <TableCell>{c.emp}</TableCell>
                <TableCell className="tabular-nums">{c.rev}</TableCell>
                <TableCell><Badge variant="outline" className={c.status === "active" ? "border-success/40 text-success" : "border-warning/40 text-warning"}>{c.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   15. AI Studio — Azure AI Studio Enterprise
   ========================================================= */
export function AIStudioConsole() {
  const models = [
    { m: "Vala-GPT-Pro", v: "v4.2", usage: "82%", lat: "412ms", status: "production" },
    { m: "Vala-Embed", v: "v2.1", usage: "64%", lat: "38ms", status: "production" },
    { m: "Vala-Vision", v: "v1.4", usage: "21%", lat: "1.2s", status: "production" },
    { m: "Vala-Reasoner", v: "v0.9", usage: "8%", lat: "2.8s", status: "preview" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Sparkles, text: "AI Studio" }, { icon: Cloud, text: "Multi-region" }]}
        title="AI model operations"
        subtitle="Deploy, evaluate and govern every model in production."
        actions={[{ label: "Deploy model", icon: Rocket }, { label: "Eval suite", icon: ClipboardList }]}
      />
      <KpiStrip kpis={[
        { label: "Models", value: "14", delta: "+2", tone: "up" },
        { label: "Tokens / day", value: "184M", delta: "+12%", tone: "up", spark: [120,135,150,162,170,178,184] },
        { label: "Avg latency", value: "412ms", delta: "-28ms", tone: "up" },
        { label: "Cost / 1k", value: "$0.0042", delta: "-8%", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Deployed models" right={<Button size="sm" variant="outline">Compare</Button>} />
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Model</TableHead><TableHead>Version</TableHead><TableHead>Usage</TableHead><TableHead>P95 latency</TableHead><TableHead>Stage</TableHead></TableRow></TableHeader>
          <TableBody>
            {models.map((m) => (
              <TableRow key={m.m}>
                <TableCell className="font-medium">{m.m}</TableCell>
                <TableCell className="font-mono text-xs">{m.v}</TableCell>
                <TableCell><Progress value={parseInt(m.usage)} className="h-1.5 w-32" /><span className="text-[11px] text-muted-foreground">{m.usage}</span></TableCell>
                <TableCell>{m.lat}</TableCell>
                <TableCell><Badge variant="outline" className={m.status === "production" ? "border-success/40 text-success" : "border-warning/40 text-warning"}>{m.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   16. Copilot — Perplexity Enterprise AI Workspace
   ========================================================= */
export function CopilotConsole() {
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Bot, text: "AI Copilot" }]}
        title="Vala AI workspace"
        subtitle="Ask anything across your data — grounded answers with citations and actions."
        actions={[{ label: "New thread", icon: Plus }, { label: "Skills", icon: Sparkles }]}
      />
      <div className="grid lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-3">
          <div className="text-xs font-semibold mb-2">Threads</div>
          <ul className="space-y-1 text-sm">
            {["Q4 forecast notes","Refund policy summary","Top-10 churn risks","API rate-limit review","Hiring pipeline EU"].map((s) => (
              <li key={s} className="rounded px-2 py-1.5 hover:bg-muted/50 cursor-pointer truncate">{s}</li>
            ))}
          </ul>
        </CardContent></Card>
        <Card className="lg:col-span-3"><CardContent className="p-4 space-y-3">
          <div className="rounded-xl border border-border/60 p-3">
            <div className="text-xs font-semibold text-muted-foreground">You</div>
            <div className="mt-1 text-sm">Which 5 enterprise accounts are at highest churn risk this quarter and why?</div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="h-3 w-3" /> Vala AI</div>
            <div className="mt-1 text-sm space-y-2">
              <p>Based on usage trends, support sentiment and renewal proximity:</p>
              <ol className="list-decimal ml-5 space-y-1 text-sm">
                <li>Globex Corp — 38% usage drop, 4 P1 tickets (90d)</li>
                <li>Initech — flat seat growth, NPS dropped 22→8</li>
                <li>Stark Industries — exec sponsor departed Oct 14</li>
                <li>Wayne Enterprises — renewal in 38 days, no exec QBR</li>
                <li>Hooli — competitor evaluation flagged in CRM</li>
              </ol>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline"><FileText className="mr-1 h-3 w-3" />Open playbook</Button>
                <Button size="sm" variant="outline"><Send className="mr-1 h-3 w-3" />Notify CS lead</Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <Input placeholder="Ask anything…" className="h-11 pr-24" />
            <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2"><Send className="mr-1 h-3 w-3" />Ask</Button>
          </div>
        </CardContent></Card>
      </div>
    </Shell>
  );
}

/* =========================================================
   17. Invoices — Netsuite + Stripe billing
   ========================================================= */
export function InvoicesConsole() {
  const rows: RecordRow[] = [
    { id: "INV-10921", name: "Globex Corp — Q4 Enterprise", status: "active", owner: "Billing", updated: "2h", amount: "$48,200", tag: "Paid" },
    { id: "INV-10920", name: "Initech — Annual subscription", status: "pending", owner: "Billing", updated: "today", amount: "$24,800", tag: "Due 12d" },
    { id: "INV-10919", name: "Stark Industries — Pro plan", status: "review", owner: "Billing", updated: "1d", amount: "$8,400", tag: "Disputed" },
    { id: "INV-10918", name: "Wayne Enterprises — Renewal", status: "active", owner: "Billing", updated: "2d", amount: "$112,000", tag: "Paid" },
    { id: "INV-10917", name: "Hooli — Add-on seats", status: "draft", owner: "Billing", updated: "3d", amount: "$3,200", tag: "Draft" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: FileText, text: "Invoices" }]}
        title="Invoice operations"
        subtitle="Issue, collect and reconcile every invoice across entities and currencies."
        actions={[{ label: "New invoice", icon: Plus }, { label: "Bulk send", icon: Send }]}
      />
      <KpiStrip kpis={[
        { label: "Outstanding", value: "$284,200", delta: "AR", tone: "neutral" },
        { label: "Paid (30d)", value: "$1.84M", delta: "+8%", tone: "up", spark: [1.2,1.4,1.5,1.6,1.7,1.8,1.84] },
        { label: "Overdue", value: "$48,400", delta: "-12%", tone: "up" },
        { label: "Avg DSO", value: "21 days", delta: "-2d", tone: "up" },
      ]} />
      <FilterBar placeholder="Search invoices…" chips={["Status","Customer","Entity","Currency","Period"]} />
      <RecordsTable rows={rows} />
    </Shell>
  );
}

/* =========================================================
   18. Licenses — Paddle Billing Enterprise
   ========================================================= */
export function LicensesConsole() {
  const products = [
    { p: "Vala Enterprise", active: 142, trial: 24, exp30: 8 },
    { p: "Vala Pro", active: 1284, trial: 96, exp30: 48 },
    { p: "Vala Team", active: 3812, trial: 184, exp30: 142 },
    { p: "Vala API add-on", active: 412, trial: 18, exp30: 22 },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: KeyRound, text: "Licenses" }]}
        title="License management"
        subtitle="Issue, rotate, suspend and audit every product license."
        actions={[{ label: "Issue license", icon: Plus }, { label: "Bulk rotate", icon: Repeat }]}
      />
      <KpiStrip kpis={[
        { label: "Active licenses", value: "5,650", delta: "+184", tone: "up" },
        { label: "Trials", value: "322", delta: "+12%", tone: "up" },
        { label: "Expiring (30d)", value: "220", delta: "Action needed", tone: "down" },
        { label: "Renewal rate", value: "92.4%", delta: "+1.1pp", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Per-product breakdown" />
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Product</TableHead><TableHead>Active</TableHead><TableHead>Trial</TableHead><TableHead>Expiring 30d</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.p}>
                <TableCell className="font-medium">{p.p}</TableCell>
                <TableCell className="tabular-nums">{p.active.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums">{p.trial}</TableCell>
                <TableCell className="tabular-nums text-warning">{p.exp30}</TableCell>
                <TableCell className="text-right"><Button size="sm" variant="ghost">Manage</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </Shell>
  );
}

/* =========================================================
   19. Documents — Dropbox Business Admin
   ========================================================= */
export function DocumentsConsole() {
  const folders = [
    { f: "Contracts", count: 184, size: "2.4 GB", sec: "Restricted" },
    { f: "Legal", count: 96, size: "1.1 GB", sec: "Confidential" },
    { f: "HR onboarding", count: 412, size: "8.2 GB", sec: "Internal" },
    { f: "Marketing assets", count: 1284, size: "48 GB", sec: "Public" },
    { f: "Engineering specs", count: 622, size: "12 GB", sec: "Internal" },
    { f: "Finance close", count: 318, size: "3.8 GB", sec: "Restricted" },
  ];
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Folder, text: "Documents" }]}
        title="Document & media library"
        subtitle="Versioned files, e-signatures and access policies across the org."
        actions={[{ label: "Upload", icon: Plus }, { label: "Request e-sign", icon: FileCheck }]}
      />
      <FilterBar placeholder="Search files…" chips={["Owner","Type","Shared","Updated"]} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {folders.map((f) => (
          <Card key={f.f}><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Folder className="h-4 w-4 text-primary" /><div className="font-semibold">{f.f}</div></div>
              <Badge variant="outline" className="text-[10px]">{f.sec}</Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{f.count.toLocaleString()} files · {f.size}</div>
            <Button variant="outline" size="sm" className="mt-3 w-full">Open</Button>
          </CardContent></Card>
        ))}
      </div>
    </Shell>
  );
}

/* =========================================================
   20. Welcome — Arc Browser Landing
   ========================================================= */
export function WelcomeConsole() {
  return (
    <Shell>
      <Hero
        eyebrow={[{ icon: Sparkles, text: "Welcome" }]}
        title="Welcome to Vala"
        subtitle="One unified enterprise platform. Pick up where you left off, or explore a workspace."
        actions={[{ label: "Get started", icon: Rocket }, { label: "Watch tour", icon: Video }]}
      />
      <QuickActions actions={[
        { label: "Open dashboard", hint: "Live KPIs", icon: Gauge },
        { label: "Browse apps", hint: "55+ modules", icon: Layers },
        { label: "Invite team", hint: "Members", icon: Users },
        { label: "Configure", hint: "Settings", icon: Settings },
      ]} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { t: "Connect your data", d: "Wire up CRM, accounting and your data warehouse.", i: Database },
          { t: "Invite teammates", d: "Bring in managers, accountants and partners with scoped roles.", i: Users },
          { t: "Set up automations", d: "Trigger workflows when revenue, support or ops events happen.", i: Workflow },
          { t: "Configure compliance", d: "SOC 2, ISO 27001, GDPR — continuous evidence collection.", i: ShieldCheck },
          { t: "Launch AI copilot", d: "Ground answers in your data with one click.", i: Sparkles },
          { t: "Brand your workspace", d: "Logo, colors, domains and per-tenant theming.", i: Globe2 },
        ].map((c) => {
          const Icon = c.i;
          return (
            <Card key={c.t}><CardContent className="p-4">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
              <div className="mt-3 font-semibold">{c.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
              <Button variant="outline" size="sm" className="mt-3">Start <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </CardContent></Card>
          );
        })}
      </div>
    </Shell>
  );
}
