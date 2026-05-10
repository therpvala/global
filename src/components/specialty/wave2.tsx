/**
 * Specialty wave 2 — premium per-module consoles, all using shared primitives.
 * Inspirations referenced for UX patterns only. No copyrighted assets.
 */
import { Link } from "@tanstack/react-router";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Award, BadgeCheck, BarChart3, Bell,
  Boxes, Box, Bug, Building2, Calendar, Check, ChevronRight, CircleDot, ClipboardList, Cloud,
  Code2, Cpu, CreditCard, Database, DollarSign, Download, ExternalLink, Eye, FileCheck, FileText,
  Filter, FlaskConical, Flag, Folder, GitBranch, GitCommit, GitMerge, GitPullRequest, Globe2,
  Headphones, Inbox, Key, Layers, LineChart, Lock, Mail, MapPin, Megaphone, MessageSquare,
  Network, Package, Plus, Repeat, Rocket, Search, Server, Settings, Shield, ShieldCheck,
  ShieldAlert, ShoppingBag, Sparkles, Star, Store, Tag, Target, TrendingDown, TrendingUp,
  UserCheck, Users, Webhook, Workflow, Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ActivityFeed, ApprovalsList, FilterBar, KpiStrip, MiniBarChart, QuickActions,
  RecordsTable, SectionHeader, Sparkline,
  type Kpi, type ActivityItem, type Approval, type RecordRow,
} from "../enterprise";

/* =========================================================
   Shared hero header
   ========================================================= */
function Hero({
  eyebrow, title, subtitle, actions,
}: {
  eyebrow: { icon: any; text: string }[];
  title: string;
  subtitle: string;
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
                    <Icon className="mr-1 h-3 w-3" />
                    {e.text}
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
                  <Icon className="mr-1.5 h-3.5 w-3.5" /> {a.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CRM  — Attio premium style
   ========================================================= */
const crmKpis: Kpi[] = [
  { label: "Pipeline", value: "$1.24M", delta: "+8.2%", tone: "up", spark: [4, 5, 6, 5, 7, 8, 9] },
  { label: "Won MTD", value: "$184K", delta: "+12%", tone: "up", spark: [3, 4, 5, 6, 7, 7, 8] },
  { label: "Win rate", value: "31%", delta: "+2.1%", tone: "up", spark: [5, 5, 6, 6, 7, 7, 8] },
  { label: "Avg deal", value: "$11.4K", delta: "-2%", tone: "down", spark: [7, 7, 6, 6, 6, 5, 5] },
];

const crmStages = [
  { name: "New", count: 24, value: "$184K", tone: "bg-muted-foreground" },
  { name: "Qualified", count: 18, value: "$262K", tone: "bg-primary" },
  { name: "Proposal", count: 12, value: "$324K", tone: "bg-warning" },
  { name: "Negotiation", count: 6, value: "$298K", tone: "bg-success" },
  { name: "Closed Won", count: 9, value: "$184K", tone: "bg-success" },
];

const crmDeals = [
  { co: "Acme Industries", dm: "Sara Lin", stage: "Negotiation", value: "$84K", close: "Mar 28", health: "warm", owner: "Ava Chen" },
  { co: "Northwind Co.", dm: "Tom Reed", stage: "Proposal", value: "$48K", close: "Apr 02", health: "hot", owner: "Marcus Hill" },
  { co: "Globex Logistics", dm: "Maya Park", stage: "Qualified", value: "$32K", close: "Apr 09", health: "warm", owner: "Priya Shah" },
  { co: "Initech", dm: "Bill Davis", stage: "New", value: "$18K", close: "Apr 14", health: "cold", owner: "Diego Romero" },
  { co: "Umbrella SaaS", dm: "Lena Kim", stage: "Negotiation", value: "$124K", close: "Mar 30", health: "hot", owner: "Ava Chen" },
];

const healthTone: Record<string, string> = {
  hot: "border-destructive/40 text-destructive bg-destructive/10",
  warm: "border-warning/40 text-warning bg-warning/10",
  cold: "border-muted-foreground/30 text-muted-foreground bg-muted",
};

export function CRMConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Users, text: "Revenue desk" }, { icon: Target, text: "Q1 attainment 78%" }]}
        title="CRM Workspace"
        subtitle="Pipeline, accounts, contacts and revenue intelligence — one collaborative spreadsheet."
        actions={[{ label: "New deal", icon: Plus }, { label: "Import", icon: Download }]}
      />
      <KpiStrip kpis={crmKpis} />

      {/* Stage funnel */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader title="Pipeline by stage" desc="Drag deals between stages" right={
            <Badge variant="outline" className="font-normal">{crmDeals.length * 12} open</Badge>
          }/>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
            {crmStages.map((s) => (
              <div key={s.name} className="rounded-lg border border-border/60 bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{s.name}</span>
                  <span className={`h-2 w-2 rounded-full ${s.tone}`} />
                </div>
                <div className="mt-1 text-lg font-bold tabular-nums">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.count} deals</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spreadsheet table */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader
            title="Open opportunities"
            right={
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="font-normal border-dashed cursor-pointer"><Filter className="mr-1 h-3 w-3" />Stage</Badge>
                <Badge variant="outline" className="font-normal border-dashed cursor-pointer"><Filter className="mr-1 h-3 w-3" />Owner</Badge>
                <Badge variant="outline" className="font-normal border-dashed cursor-pointer"><Filter className="mr-1 h-3 w-3" />Close date</Badge>
              </div>
            }
          />
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Account</TableHead>
                  <TableHead>Decision maker</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Close</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crmDeals.map((d) => (
                  <TableRow key={d.co} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[10px] font-bold text-accent-foreground">
                          {d.co.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{d.co}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{d.dm}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-normal">{d.stage}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`capitalize font-normal ${healthTone[d.health]}`}>{d.health}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px] bg-primary/15 text-primary">{d.owner.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                        <span className="text-xs">{d.owner.split(" ")[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{d.close}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{d.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Forecast vs target" />
            <div className="mt-3"><MiniBarChart data={[42, 56, 64, 78, 92, 112, 138]} labels={["W1","W2","W3","W4","W5","W6","W7"]}/></div>
          </CardContent>
        </Card>
        <ActivityFeed items={[
          { who: "Ava Chen", what: "moved", target: "Umbrella SaaS to Negotiation", when: "8m", kind: "update" },
          { who: "AI", what: "summarized last call with", target: "Acme Industries", when: "22m", kind: "comment" },
          { who: "Marcus Hill", what: "won", target: "deal Globex-2031", when: "1h", kind: "approve" },
          { who: "Priya Shah", what: "created task", target: "Follow up Initech", when: "3h", kind: "create" },
        ]}/>
      </div>
    </div>
  );
}

/* =========================================================
   Accounting  — Netsuite / Chargebee hybrid
   ========================================================= */
const acctKpis: Kpi[] = [
  { label: "Revenue MTD", value: "$94,210", delta: "+11%", tone: "up", spark: [3, 4, 5, 6, 7, 8, 9] },
  { label: "AR outstanding", value: "$28,400", delta: "-4%", tone: "up", spark: [9, 8, 8, 7, 7, 6, 6] },
  { label: "AP due (7d)", value: "$9,840", tone: "neutral", spark: [4, 4, 5, 5, 5, 4, 4] },
  { label: "Cash position", value: "$412K", delta: "+3.2%", tone: "up", spark: [5, 6, 6, 7, 7, 8, 9] },
];

const acctInvoices: RecordRow[] = [
  { id: "INV-0921", name: "Acme Industries · monthly", status: "active", owner: "Finance", updated: "Mar 24", amount: "$8,400", tag: "Net 30" },
  { id: "INV-0918", name: "Northwind Co. · setup", status: "pending", owner: "Finance", updated: "Mar 22", amount: "$2,200", tag: "Net 15" },
  { id: "INV-0911", name: "Globex · usage", status: "review", owner: "Finance", updated: "Mar 21", amount: "$1,640", tag: "Disputed" },
  { id: "INV-0902", name: "Umbrella SaaS · annual", status: "active", owner: "Finance", updated: "Mar 18", amount: "$24,000", tag: "Auto-pay" },
];

export function AccountingConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: DollarSign, text: "Finance command" }, { icon: BadgeCheck, text: "Books reconciled 96%" }]}
        title="Accounting & Billing"
        subtitle="Ledger, invoicing, receivables, payables, recurring revenue and tax — closed-loop."
        actions={[{ label: "New invoice", icon: Plus }, { label: "Run report", icon: FileText }]}
      />
      <KpiStrip kpis={acctKpis} />

      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent border-b border-border/60 rounded-none w-full justify-start h-auto p-0">
          {[["overview","Overview"],["invoices","Invoices"],["billing","Subscriptions"],["payables","Payables"],["reports","Reports"]].map(([v,l]) => (
            <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/60">
              <CardContent className="p-4">
                <SectionHeader title="Revenue · last 7d" />
                <div className="mt-3"><MiniBarChart data={[12,16,14,22,28,26,34]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}/></div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { l: "Recognized", v: "$184K", t: "text-success" },
                    { l: "Deferred", v: "$62K", t: "text-warning" },
                    { l: "Refunds", v: "$1.2K", t: "text-destructive" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border border-border/60 p-2.5">
                      <div className="text-[11px] text-muted-foreground">{s.l}</div>
                      <div className={`text-base font-semibold ${s.t}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-4">
                <SectionHeader title="Aging buckets" />
                <ul className="mt-3 space-y-2 text-sm">
                  {[["Current","$14,200","success"],["1-30d","$6,400","primary"],["31-60d","$4,800","warning"],["60d+","$3,000","destructive"]].map(([l,v,t]) => (
                    <li key={l} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span className={`font-semibold tabular-nums text-${t}`}>{v}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <ApprovalsList items={[
            { id: "1", title: "Refund INV-0918", requester: "Support", amount: "$240", age: "3d", sla: "breach" },
            { id: "2", title: "Vendor PO #4421", requester: "Operations", amount: "$12,800", age: "2h", sla: "warn" },
            { id: "3", title: "Expense — travel", requester: "Marcus Hill", amount: "$840", age: "18m", sla: "ok" },
          ]}/>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4 space-y-3">
          <FilterBar placeholder="Search invoices…" chips={["Status","Customer","Date","Tax region"]}/>
          <RecordsTable rows={acctInvoices}/>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
            Recurring billing plans, dunning, proration and revenue recognition appear here.
          </div>
        </TabsContent>
        <TabsContent value="payables" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
            Bills, vendor credits and payment runs.
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {["P&L statement","Balance sheet","Cash flow","AR aging","AP aging","Tax summary","MRR / ARR","Cohort retention","Revenue waterfall"].map((r) => (
              <Card key={r} className="border-border/60 hover:border-primary/40 transition cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground"><FileText className="h-4 w-4"/></div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                  </div>
                  <div className="mt-2 text-sm font-semibold">{r}</div>
                  <div className="text-[11px] text-muted-foreground">Updated 1h ago</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* =========================================================
   API Manager — Postman Enterprise / GitLab DevOps blend
   ========================================================= */
const apiKpis: Kpi[] = [
  { label: "Endpoints", value: "1,842", delta: "+24", tone: "up", spark: [4, 5, 6, 7, 8, 9, 10] },
  { label: "Requests / min", value: "12.4K", delta: "+6%", tone: "up", spark: [5, 6, 7, 7, 8, 9, 10] },
  { label: "Error rate", value: "0.04%", delta: "-0.01%", tone: "up", spark: [4, 4, 3, 3, 3, 2, 2] },
  { label: "p95 latency", value: "184ms", delta: "-12ms", tone: "up", spark: [8, 7, 7, 6, 6, 6, 5] },
];

const apiEndpoints = [
  { m: "GET", path: "/v1/customers", env: "prod", rpm: "2,142", p95: "112ms", err: "0.01%" },
  { m: "POST", path: "/v1/invoices", env: "prod", rpm: "486", p95: "246ms", err: "0.08%" },
  { m: "POST", path: "/v1/webhooks/stripe", env: "prod", rpm: "184", p95: "92ms", err: "0.0%" },
  { m: "GET", path: "/v1/reports/mrr", env: "staging", rpm: "12", p95: "412ms", err: "0.3%" },
  { m: "PATCH", path: "/v1/tenants/:id", env: "prod", rpm: "94", p95: "168ms", err: "0.02%" },
];

const methodTone: Record<string, string> = {
  GET: "border-success/40 text-success bg-success/10",
  POST: "border-primary/40 text-primary bg-primary/10",
  PATCH: "border-warning/40 text-warning bg-warning/10",
  DELETE: "border-destructive/40 text-destructive bg-destructive/10",
};

export function ApiManagerConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Webhook, text: "API workspace" }, { icon: ShieldCheck, text: "OAuth · HMAC · mTLS" }]}
        title="API & Webhook Manager"
        subtitle="Endpoints, keys, webhooks, environments and observability across services."
        actions={[{ label: "New endpoint", icon: Plus }, { label: "New key", icon: Key }]}
      />
      <KpiStrip kpis={apiKpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Top endpoints" desc="Live RPM · p95 · error rate"/>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[80px]">Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Env</TableHead>
                    <TableHead className="text-right">RPM</TableHead>
                    <TableHead className="text-right">p95</TableHead>
                    <TableHead className="text-right">Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiEndpoints.map((e) => (
                    <TableRow key={e.path} className="cursor-pointer">
                      <TableCell><Badge variant="outline" className={`font-mono text-[10px] ${methodTone[e.m]}`}>{e.m}</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{e.path}</TableCell>
                      <TableCell><Badge variant="secondary" className="font-normal">{e.env}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">{e.rpm}</TableCell>
                      <TableCell className="text-right tabular-nums">{e.p95}</TableCell>
                      <TableCell className="text-right tabular-nums">{e.err}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader title="API keys" right={<Button size="sm" variant="outline" className="h-7 text-xs">Rotate</Button>}/>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { n: "prod-server", k: "sk_live_••••8412", u: "in use" },
                  { n: "ci-pipeline", k: "sk_live_••••6629", u: "in use" },
                  { n: "legacy", k: "sk_live_••••1102", u: "rotate" },
                ].map((k) => (
                  <li key={k.n} className="flex items-center justify-between rounded-lg border border-border/60 p-2.5">
                    <div>
                      <div className="font-medium">{k.n}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{k.k}</div>
                    </div>
                    <Badge variant="outline" className={k.u === "rotate" ? "border-warning/40 text-warning" : "border-success/40 text-success"}>{k.u}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader title="Webhook deliveries"/>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { t: "invoice.paid → stripe", s: "200", c: "text-success" },
                  { t: "user.signup → segment", s: "200", c: "text-success" },
                  { t: "order.created → erp", s: "503", c: "text-destructive" },
                  { t: "ticket.opened → slack", s: "200", c: "text-success" },
                ].map((w) => (
                  <li key={w.t} className="flex items-center justify-between">
                    <span className="font-mono text-xs truncate">{w.t}</span>
                    <span className={`text-xs font-semibold ${w.c}`}>{w.s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader title="Request volume" desc="Last 24h"/>
          <div className="mt-3"><MiniBarChart data={[80,124,168,142,196,220,248,284,212,196,168,142,124]} /></div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   SEO Manager — Ahrefs / SEMrush
   ========================================================= */
const seoKpis: Kpi[] = [
  { label: "Organic traffic", value: "184K", delta: "+12%", tone: "up", spark: [3,4,5,6,7,8,9] },
  { label: "Ranking keywords", value: "8,412", delta: "+184", tone: "up", spark: [4,5,5,6,7,8,9] },
  { label: "Backlinks", value: "42.6K", delta: "+612", tone: "up", spark: [3,4,4,5,5,6,7] },
  { label: "Avg position", value: "12.4", delta: "-0.8", tone: "up", spark: [9,8,8,7,7,6,6] },
];

const seoKeywords = [
  { k: "saas billing platform", pos: 3, change: 2, vol: "8.4K", diff: 38, ctr: "12%" },
  { k: "enterprise crm", pos: 6, change: -1, vol: "12.2K", diff: 62, ctr: "7%" },
  { k: "white label erp", pos: 4, change: 1, vol: "3.4K", diff: 42, ctr: "9%" },
  { k: "multi tenant saas", pos: 9, change: 3, vol: "6.1K", diff: 54, ctr: "5%" },
  { k: "franchise software", pos: 2, change: 0, vol: "2.2K", diff: 28, ctr: "18%" },
];

export function SEOConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: BarChart3, text: "Growth lab" }, { icon: Globe2, text: "vala.app" }]}
        title="SEO Workspace"
        subtitle="Keyword universe, backlinks, content gaps and rank tracking — daily operations."
        actions={[{ label: "Run audit", icon: FlaskConical }, { label: "New project", icon: Plus }]}
      />
      <KpiStrip kpis={seoKpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Rank tracker" desc="Top keywords · vs. 7d ago"/>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                  <TableHead className="text-right">Δ</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seoKeywords.map((k) => (
                  <TableRow key={k.k} className="cursor-pointer">
                    <TableCell className="font-medium text-sm">{k.k}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">#{k.pos}</TableCell>
                    <TableCell className={`text-right tabular-nums text-xs ${k.change>0?"text-success":k.change<0?"text-destructive":"text-muted-foreground"}`}>
                      {k.change>0?`▲ ${k.change}`:k.change<0?`▼ ${Math.abs(k.change)}`:"—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{k.vol}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Progress value={k.diff} className="w-14 h-1.5"/>
                        <span className="text-xs tabular-nums">{k.diff}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{k.ctr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Site health" />
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { t: "Crawled pages", v: "12,402", c: "text-foreground" },
                { t: "Indexed", v: "11,884", c: "text-success" },
                { t: "Broken links", v: "42", c: "text-warning" },
                { t: "404s", v: "8", c: "text-destructive" },
                { t: "Core Web Vitals", v: "Pass", c: "text-success" },
              ].map((s) => (
                <li key={s.t} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{s.t}</span>
                  <span className={`tabular-nums font-semibold ${s.c}`}>{s.v}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader title="Organic traffic" desc="Sessions · 30d"/>
          <div className="mt-3"><MiniBarChart data={[44,52,48,62,68,74,82,78,84,92,98,108,116,124]} /></div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   Projects — Linear style
   ========================================================= */
const linearStatuses: Record<string, { dot: string; label: string }> = {
  backlog:  { dot: "bg-muted-foreground", label: "Backlog" },
  todo:     { dot: "bg-primary",          label: "Todo" },
  progress: { dot: "bg-warning",          label: "In progress" },
  review:   { dot: "bg-chart-4",          label: "In review" },
  done:     { dot: "bg-success",          label: "Done" },
  canceled: { dot: "bg-destructive",      label: "Canceled" },
};

const linearIssues = [
  { id: "VAL-184", t: "Streaming search results for global ⌘K", s: "progress", a: "Ava", p: "Urgent", proj: "Search" },
  { id: "VAL-176", t: "Webhook retry policy + dead-letter UI", s: "review",   a: "Marcus", p: "High",   proj: "Platform" },
  { id: "VAL-162", t: "Multi-currency conversion engine", s: "todo",     a: "Priya",  p: "Medium", proj: "Billing" },
  { id: "VAL-158", t: "Bulk import wizard", s: "progress", a: "Diego",  p: "Medium", proj: "CRM" },
  { id: "VAL-141", t: "Audit log export to S3", s: "backlog",  a: "Noor",   p: "Low",    proj: "Security" },
  { id: "VAL-138", t: "Role switcher accessibility", s: "done",     a: "Yui",    p: "Medium", proj: "Shell" },
];

const prioTone: Record<string, string> = {
  Urgent: "border-destructive/40 text-destructive",
  High:   "border-warning/40 text-warning",
  Medium: "border-primary/40 text-primary",
  Low:    "border-muted-foreground/30 text-muted-foreground",
};

export function ProjectsConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Workflow, text: "Engineering workspace" }, { icon: GitBranch, text: "Sprint 24 · day 3" }]}
        title="Projects"
        subtitle="Issues, cycles, projects and roadmap — keyboard-first execution."
        actions={[{ label: "New issue", icon: Plus }, { label: "Cycle", icon: Calendar }]}
      />
      <KpiStrip kpis={[
        { label: "Open issues", value: "184", delta: "+12", tone: "down", spark: [4,5,6,7,7,8,9] },
        { label: "In progress", value: "27", tone: "neutral", spark: [4,4,5,5,5,5,6] },
        { label: "Velocity", value: "84 pts", delta: "+6", tone: "up", spark: [4,5,6,6,7,8,8] },
        { label: "Cycle health", value: "72%", delta: "-3%", tone: "down", spark: [7,7,7,6,6,6,5] },
      ]}/>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">All issues</span>
              <Badge variant="secondary" className="font-normal">{linearIssues.length}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="font-normal border-dashed cursor-pointer"><Filter className="mr-1 h-3 w-3"/>Status</Badge>
              <Badge variant="outline" className="font-normal border-dashed cursor-pointer"><Filter className="mr-1 h-3 w-3"/>Priority</Badge>
              <Badge variant="outline" className="font-normal border-dashed cursor-pointer"><Filter className="mr-1 h-3 w-3"/>Project</Badge>
            </div>
          </div>
          <ul>
            {linearIssues.map((i) => {
              const st = linearStatuses[i.s];
              return (
                <li key={i.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60 last:border-b-0 hover:bg-muted/40 cursor-pointer">
                  <span className={`h-2 w-2 rounded-full ${st.dot}`}/>
                  <Badge variant="outline" className={`font-mono text-[10px] ${prioTone[i.p]}`}>{i.p}</Badge>
                  <span className="font-mono text-[11px] text-muted-foreground w-16">{i.id}</span>
                  <span className="text-sm font-medium flex-1 truncate">{i.t}</span>
                  <Badge variant="secondary" className="font-normal">{i.proj}</Badge>
                  <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px] bg-primary/15 text-primary">{i.a.slice(0,2)}</AvatarFallback></Avatar>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Cycle burndown"/>
            <div className="mt-3"><MiniBarChart data={[84,80,76,68,62,52,46,38,32,28,22,18]} /></div>
          </CardContent>
        </Card>
        <ActivityFeed items={[
          { who: "Ava", what: "moved", target: "VAL-184 to In progress", when: "12m", kind: "update" },
          { who: "Marcus", what: "merged", target: "PR #1284", when: "44m", kind: "approve" },
          { who: "Diego", what: "created", target: "VAL-186", when: "1h", kind: "create" },
          { who: "Yui", what: "closed", target: "VAL-138", when: "2h", kind: "approve" },
        ]}/>
      </div>
    </div>
  );
}

/* =========================================================
   HRM — Rippling
   ========================================================= */
const hrKpis: Kpi[] = [
  { label: "Headcount", value: "312", delta: "+6", tone: "up", spark: [4,5,5,6,7,8,9] },
  { label: "Open roles", value: "14", tone: "neutral", spark: [3,4,4,5,5,6,6] },
  { label: "Attrition (TTM)", value: "3.2%", delta: "-0.4%", tone: "up", spark: [6,6,5,5,5,4,4] },
  { label: "eNPS", value: "+48", delta: "+5", tone: "up", spark: [5,6,6,7,7,8,9] },
];

const hrTasks = [
  { t: "Approve PTO — Marcus Hill (5d)", d: "Today", tag: "Leave" },
  { t: "Sign offer letter — Senior Designer", d: "Today", tag: "Hiring" },
  { t: "Review payroll cycle Mar 28", d: "Tomorrow", tag: "Payroll" },
  { t: "1:1 with Ava Chen", d: "Wed", tag: "1:1" },
];

const hrPeople = [
  { n: "Ava Chen", r: "Head of Revenue", d: "Sales", st: "active" },
  { n: "Marcus Hill", r: "AE, EMEA", d: "Sales", st: "active" },
  { n: "Priya Shah", r: "Finance Manager", d: "Finance", st: "leave" },
  { n: "Diego Romero", r: "Senior Engineer", d: "Engineering", st: "active" },
  { n: "Noor Idris", r: "Security Analyst", d: "Security", st: "active" },
  { n: "Yui Tanaka", r: "Product Designer", d: "Design", st: "onboarding" },
];

const hrStTone: Record<string, string> = {
  active: "border-success/40 text-success",
  leave: "border-warning/40 text-warning",
  onboarding: "border-primary/40 text-primary",
};

export function HRMConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Users, text: "People platform" }, { icon: BadgeCheck, text: "Compliant in 38 jurisdictions" }]}
        title="HR & Employee Management"
        subtitle="People, payroll, benefits, devices, time-off and hiring — one workforce graph."
        actions={[{ label: "Hire", icon: Plus }, { label: "Run payroll", icon: DollarSign }]}
      />
      <KpiStrip kpis={hrKpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Directory" desc="Active people across departments"/>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hrPeople.map((p) => (
                  <TableRow key={p.n} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-primary/15 text-primary">{p.n.split(" ").map((x)=>x[0]).join("")}</AvatarFallback></Avatar>
                        <span className="text-sm font-medium">{p.n}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.r}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-normal">{p.d}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`capitalize font-normal ${hrStTone[p.st]}`}>{p.st}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Your inbox" desc="HR approvals & tasks"/>
            <ul className="mt-3 space-y-2 text-sm">
              {hrTasks.map((t) => (
                <li key={t.t} className="flex items-start gap-2 rounded-lg border border-border/60 p-2.5">
                  <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5"/>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{t.t}</div>
                    <div className="text-[11px] text-muted-foreground">{t.d} · {t.tag}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   Marketplace — Envato / Mirakl
   ========================================================= */
const mkpKpis: Kpi[] = [
  { label: "GMV (MTD)", value: "$842K", delta: "+18%", tone: "up", spark: [4,5,6,7,8,9,10] },
  { label: "Active vendors", value: "1,284", delta: "+24", tone: "up", spark: [4,5,5,6,7,7,8] },
  { label: "Listings", value: "12,402", delta: "+184", tone: "up", spark: [4,5,5,6,6,7,8] },
  { label: "Refund rate", value: "1.2%", delta: "-0.2%", tone: "up", spark: [5,5,4,4,3,3,3] },
];

const mkpVendors = [
  { n: "PixelForge Studio", c: "Templates", rev: "$24K", rat: 4.9, st: "verified" },
  { n: "AudioVault", c: "Sound", rev: "$18K", rat: 4.8, st: "verified" },
  { n: "ThemeMakers", c: "Themes", rev: "$14K", rat: 4.6, st: "review" },
  { n: "CodeBox", c: "Plugins", rev: "$11K", rat: 4.7, st: "verified" },
  { n: "VectorLab", c: "Graphics", rev: "$8K", rat: 4.3, st: "watch" },
];

const mkpStTone: Record<string, string> = {
  verified: "border-success/40 text-success bg-success/10",
  review: "border-warning/40 text-warning bg-warning/10",
  watch: "border-destructive/40 text-destructive bg-destructive/10",
};

export function MarketplaceConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Store, text: "Marketplace ops" }, { icon: ShoppingBag, text: "Multi-vendor" }]}
        title="Marketplace Manager"
        subtitle="Vendors, catalog, payouts, disputes and category curation — operator console."
        actions={[{ label: "Approve vendor", icon: BadgeCheck }, { label: "New category", icon: Plus }]}
      />
      <KpiStrip kpis={mkpKpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Top vendors" desc="Last 30 days"/>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mkpVendors.map((v) => (
                  <TableRow key={v.n} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[10px] font-bold text-accent-foreground">{v.n.slice(0,2).toUpperCase()}</div>
                        <span className="text-sm font-medium">{v.n}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="font-normal">{v.c}</Badge></TableCell>
                    <TableCell className="text-sm"><Star className="inline h-3 w-3 text-warning mr-0.5"/>{v.rat}</TableCell>
                    <TableCell><Badge variant="outline" className={`capitalize font-normal ${mkpStTone[v.st]}`}>{v.st}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{v.rev}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Moderation queue"/>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { t: "Listing — Studio Theme v3", r: "AI flag · copyright" },
                { t: "Vendor — ImageHub", r: "KYC pending" },
                { t: "Dispute — Order #12842", r: "Chargeback" },
                { t: "Review — VectorLab", r: "Spam pattern" },
              ].map((m) => (
                <li key={m.t} className="rounded-lg border border-border/60 p-2.5">
                  <div className="font-medium truncate">{m.t}</div>
                  <div className="text-[11px] text-muted-foreground">{m.r}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader title="GMV trend" desc="Last 14 days"/>
          <div className="mt-3"><MiniBarChart data={[42,48,52,56,60,68,72,76,82,88,92,98,104,112]}/></div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   Subscriptions — Paddle / Chargebee
   ========================================================= */
const subKpis: Kpi[] = [
  { label: "MRR", value: "$184K", delta: "+9.1%", tone: "up", spark: [4,5,6,7,7,8,9] },
  { label: "ARR", value: "$2.21M", delta: "+11%", tone: "up", spark: [4,5,5,6,7,8,9] },
  { label: "Churn", value: "1.8%", delta: "-0.3%", tone: "up", spark: [5,5,4,4,3,3,3] },
  { label: "LTV / CAC", value: "4.6×", delta: "+0.2×", tone: "up", spark: [5,5,6,6,7,7,8] },
];

const subPlans = [
  { p: "Starter",      mrr: "$22K", subs: 1842, c: "+62" },
  { p: "Growth",       mrr: "$68K", subs: 942,  c: "+24" },
  { p: "Business",     mrr: "$54K", subs: 312,  c: "+12" },
  { p: "Enterprise",   mrr: "$40K", subs: 84,   c: "+3"  },
];

export function SubscriptionsConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Repeat, text: "Subscription engine" }, { icon: CreditCard, text: "Tax & dunning ready" }]}
        title="Subscriptions & Billing"
        subtitle="MRR, plans, dunning, proration and revenue recognition across regions."
        actions={[{ label: "New plan", icon: Plus }, { label: "Run dunning", icon: Bell }]}
      />
      <KpiStrip kpis={subKpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="MRR by plan"/>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Subscribers</TableHead>
                  <TableHead className="text-right">Net new</TableHead>
                  <TableHead className="text-right">MRR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subPlans.map((p) => (
                  <TableRow key={p.p} className="cursor-pointer">
                    <TableCell className="font-medium">{p.p}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.subs.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-success">{p.c}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{p.mrr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Dunning"/>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { l: "Failed payments", v: "42", t: "text-destructive" },
                { l: "Retry scheduled", v: "28", t: "text-warning" },
                { l: "Recovered (7d)", v: "$8,420", t: "text-success" },
                { l: "Cancellations", v: "12", t: "text-muted-foreground" },
              ].map((d) => (
                <li key={d.l} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{d.l}</span>
                  <span className={`font-semibold tabular-nums ${d.t}`}>{d.v}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader title="MRR movement" desc="Last 12 weeks"/>
          <div className="mt-3"><MiniBarChart data={[108,112,118,124,132,140,148,156,164,172,178,184]}/></div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   Security & RBAC — Okta / Cloudflare Zero Trust
   ========================================================= */
const secKpis: Kpi[] = [
  { label: "Identities", value: "8,412", delta: "+184", tone: "up", spark: [4,5,5,6,7,8,9] },
  { label: "MFA enrolled", value: "94%", delta: "+1.2%", tone: "up", spark: [7,7,8,8,9,9,9] },
  { label: "Risky sessions", value: "12", delta: "+3", tone: "down", spark: [3,3,4,4,5,5,5] },
  { label: "Policy violations", value: "4", delta: "-1", tone: "up", spark: [5,5,4,4,3,3,3] },
];

const secPolicies = [
  { n: "Block legacy auth", t: "Enforced", c: "text-success" },
  { n: "Require MFA for admins", t: "Enforced", c: "text-success" },
  { n: "Geofence — production console", t: "Enforced", c: "text-success" },
  { n: "Session lifetime 8h", t: "Warn", c: "text-warning" },
  { n: "Device posture (managed)", t: "Audit", c: "text-muted-foreground" },
];

export function SecurityConsole() {
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: ShieldCheck, text: "Zero Trust" }, { icon: Lock, text: "SOC 2 · ISO 27001" }]}
        title="Security & RBAC"
        subtitle="Identities, policies, devices and audit — least-privilege everywhere."
        actions={[{ label: "New policy", icon: Plus }, { label: "Investigate", icon: ShieldAlert }]}
      />
      <KpiStrip kpis={secKpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Access policies"/>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Policy</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Hits (24h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secPolicies.map((p, i) => (
                  <TableRow key={p.n}>
                    <TableCell className="font-medium">{p.n}</TableCell>
                    <TableCell><Badge variant="outline" className={`font-normal ${p.c}`}>{p.t}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">{(8421 - i*214).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <SectionHeader title="Recent risk events"/>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { sev: "high", t: "Impossible travel — user@vala.app", w: "12m" },
                { sev: "med",  t: "New device from EU-West", w: "38m" },
                { sev: "low",  t: "Failed login burst (3)", w: "1h" },
                { sev: "med",  t: "Token reused from new IP", w: "2h" },
              ].map((r) => (
                <li key={r.t} className="flex items-start gap-2 rounded-lg border border-border/60 p-2.5">
                  <Badge variant="outline" className={
                    r.sev==="high"?"border-destructive/40 text-destructive":r.sev==="med"?"border-warning/40 text-warning":"border-muted-foreground/30 text-muted-foreground"
                  }>{r.sev}</Badge>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{r.t}</div>
                    <div className="text-[11px] text-muted-foreground">{r.w} ago</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <SectionHeader title="Login volume" desc="Last 14 days · success vs failed"/>
          <div className="mt-3"><MiniBarChart data={[120,138,142,156,164,172,184,196,208,212,220,228,236,244]}/></div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   Home — Odoo Apps grid
   ========================================================= */
import { modules } from "@/lib/modules";
export function HomeApps() {
  const groups = Array.from(new Set(modules.map((m) => m.group)));
  return (
    <div className="space-y-5">
      <Hero
        eyebrow={[{ icon: Sparkles, text: "Workspace home" }, { icon: Layers, text: `${modules.length} apps` }]}
        title="Apps"
        subtitle="Launch any module instantly. Pin favorites and jump back into recent work."
        actions={[{ label: "Customize", icon: Settings }]}
      />
      <FilterBar placeholder="Search apps…" chips={["All","Favorites","Recent","Installed"]}/>
      {groups.map((g) => {
        const items = modules.filter((m) => m.group === g);
        return (
          <section key={g} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g}</h2>
              <span className="text-[11px] text-muted-foreground">{items.length} apps</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {items.map((m) => {
                const Icon = m.icon;
                return (
                  <Link key={m.url} to={m.url as any}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center hover:border-primary/40 hover:shadow-[var(--shadow-elegant)] transition">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition">
                      <Icon className="h-6 w-6"/>
                    </div>
                    <div className="text-xs font-semibold leading-tight line-clamp-1">{m.title}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-2">{m.desc}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
