/**
 * Specialty wave 4 — finishes coverage for remaining global routes.
 * Inspirations: Workday Org, Google Calendar, Linear Activity, Pinterest Favorites,
 * Raindrop Bookmarks, Lattice Goals, Datadog Live, Hotjar Heatmaps, Workbox Offline,
 * Okta Sessions, JAMF Devices, Cloudflare Threats, Wise Wallet, Strava Leaderboard,
 * Figma Theme, Forevest MLM, ServiceNow Branches, Greenhouse Recruitment,
 * Square POS, Odoo Sales/ERP, Cin7 Inventory, Katana Manufacturing.
 */
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Award, BarChart3, Boxes,
  Building, Calendar, Check, CircleDot, Clock, Crown, Download, Factory, Filter,
  GitBranch, Globe2, Heart, Layers, LineChart, Lock, MapPin, Network, Package,
  Palette, Plus, Repeat, Search, Settings, Shield, ShieldAlert, ShieldCheck,
  ShoppingCart, Smartphone, Sparkles, Star, Target, Trophy, Truck, User, UserCheck,
  Users, Wallet, Wifi, WifiOff, Workflow, Zap, Bookmark, FileText, ChevronRight,
  Briefcase,
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
  SectionHeader, Sparkline, type Kpi, type RecordRow,
} from "../enterprise";

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
              {eyebrow.map((e) => { const I = e.icon; return (
                <Badge key={e.text} variant="secondary" className="font-normal"><I className="mr-1 h-3 w-3" />{e.text}</Badge>
              ); })}
            </div>
            <h1 className="mt-1.5 text-2xl font-bold">{title}</h1>
            <p className="text-sm opacity-90 max-w-2xl">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-60">
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
const Shell = ({ children }: { children: any }) => <div className="space-y-4">{children}</div>;

/* 1. Org chart — Workday style */
export function OrgChartConsole() {
  const layer = (title: string, count: number, people: string[]) => (
    <div className="rounded-xl border border-border/60 bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {people.map((p) => (
          <div key={p} className="flex items-center gap-2 rounded-lg border border-border/60 px-2.5 py-1.5">
            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-primary/15 text-primary">{p.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
            <span className="text-sm">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Network, text: "Organization" }]} title="Org chart" subtitle="Reporting lines, span of control and open roles across every team."
        actions={[{ label: "Add role", icon: Plus }, { label: "Export", icon: Download }]} />
      <KpiStrip kpis={[
        { label: "Headcount", value: "384", delta: "+18 QoQ", tone: "up" },
        { label: "Avg span", value: "6.2", delta: "Healthy", tone: "up" },
        { label: "Open roles", value: "22", delta: "Hiring", tone: "neutral" },
        { label: "Manager ratio", value: "1:7", delta: "On target", tone: "up" },
      ]} />
      {layer("Executive", 1, ["CEO Ana Costa"])}
      {layer("C-suite", 5, ["CFO M. Rao","CTO J. Lin","CRO S. Mendez","COO P. Vega","CPO L. Park"])}
      {layer("VPs", 9, ["VP Eng","VP Sales","VP CS","VP Marketing","VP Finance","VP People","VP Product","VP Ops","VP Legal"])}
      {layer("Directors", 18, ["D. Singh","R. Yamato","H. Beck","C. Owens","T. Park","J. Mira","N. Holm","O. Bauer","M. Cole"])}
    </Shell>
  );
}

/* 2. Calendar — Google/Cron style */
export function CalendarConsole() {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const events = [
    { d: 0, t: "09:00", title: "Exec sync", tag: "Mtg" },
    { d: 1, t: "11:30", title: "Pipeline review", tag: "Rev" },
    { d: 2, t: "14:00", title: "Board prep", tag: "Brd" },
    { d: 3, t: "10:00", title: "QBR — Globex", tag: "QBR" },
    { d: 4, t: "16:30", title: "Release window", tag: "Eng" },
  ];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Calendar, text: "Calendar" }]} title="Schedule" subtitle="Meetings, reviews, releases and SLAs across teams."
        actions={[{ label: "New event", icon: Plus }, { label: "Today", icon: Calendar }]} />
      <Card><CardContent className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, i) => (
            <div key={d} className="rounded-lg border border-border/60 p-2 min-h-[120px]">
              <div className="text-[11px] font-semibold text-muted-foreground">{d}</div>
              <div className="text-lg font-bold">{10 + i}</div>
              {events.filter(e => e.d === i).map(e => (
                <div key={e.title} className="mt-1 rounded bg-primary/10 px-1.5 py-1 text-[10px] text-primary">
                  <div className="font-mono">{e.t}</div><div className="font-medium truncate">{e.title}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent></Card>
    </Shell>
  );
}

/* 3. Activity timeline */
export function ActivityConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Activity, text: "Activity" }]} title="Activity timeline" subtitle="Everything that happened across your workspace."
        actions={[{ label: "Filter", icon: Filter }, { label: "Export", icon: Download }]} />
      <FilterBar placeholder="Search events…" chips={["Module","User","Type","Date"]} />
      <ActivityFeed items={[
        { who: "Marina S.", what: "closed deal", target: "Globex — $84,000", when: "2 min ago", kind: "approve" },
        { who: "CI/CD", what: "deployed", target: "release v3.42.2", when: "8 min ago", kind: "create" },
        { who: "Aki R.", what: "resolved ticket", target: "T-9818", when: "20 min ago", kind: "approve" },
        { who: "Finance", what: "issued invoice", target: "INV-10923 ($12,400)", when: "1h ago", kind: "create" },
        { who: "Security", what: "blocked sign-in", target: "user@rival.com", when: "2h ago", kind: "reject" },
        { who: "Layla", what: "commented on", target: "OKR-Q4-02", when: "3h ago", kind: "comment" },
        { who: "Datadog", what: "alert resolved on", target: "api-gateway-eu", when: "4h ago", kind: "approve" },
      ]} />
    </Shell>
  );
}

/* 4. Favorites */
export function FavoritesConsole() {
  const items = [
    { i: "CRM · Pipeline", icon: Users },{ i: "Finance · P&L", icon: BarChart3 },
    { i: "Support · Inbox", icon: AlertTriangle },{ i: "Projects · Q4 Roadmap", icon: Target },
    { i: "Reports · Cohort retention", icon: LineChart },{ i: "HR · Org chart", icon: Network },
  ];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Star, text: "Favorites" }]} title="Favorite views" subtitle="Pinned dashboards, reports and records." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(({ i, icon: I }) => (
          <Card key={i}><CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-warning/15 text-warning"><I className="h-4 w-4" /></div>
              <div className="text-sm font-medium">{i}</div>
            </div>
            <Star className="h-4 w-4 fill-warning text-warning" />
          </CardContent></Card>
        ))}
      </div>
    </Shell>
  );
}

/* 5. Bookmarks */
export function BookmarksConsole() {
  const groups = [
    { g: "Saved searches", items: ["Open deals > $50k","Tickets older than 24h","Failed payments last 7d"] },
    { g: "Saved filters", items: ["EMEA enterprise renewals","Eng tasks blocked","Pending approvals > 48h"] },
    { g: "Saved reports", items: ["Q4 forecast snapshot","Top-10 churn risks","CAC payback by cohort"] },
  ];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Bookmark, text: "Bookmarks" }]} title="Saved views" subtitle="Saved searches, filters and reports across modules." />
      <div className="grid lg:grid-cols-3 gap-3">
        {groups.map(g => (
          <Card key={g.g}><CardContent className="p-4">
            <div className="text-sm font-semibold mb-2">{g.g}</div>
            <ul className="space-y-1">
              {g.items.map(i => (
                <li key={i} className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-muted/50 cursor-pointer">
                  <span className="truncate">{i}</span><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </CardContent></Card>
        ))}
      </div>
    </Shell>
  );
}

/* 6. Goals / OKRs — Lattice */
export function GoalsConsole() {
  const okrs = [
    { o: "Reach $50M ARR", p: 82, owner: "CEO Office", tag: "Company" },
    { o: "NPS > 60", p: 71, owner: "CS", tag: "Customer" },
    { o: "Reduce p95 latency to <300ms", p: 58, owner: "Platform Eng", tag: "Product" },
    { o: "Close 12 enterprise deals", p: 75, owner: "Sales EMEA", tag: "Revenue" },
    { o: "Ship 4 platform launches", p: 50, owner: "Product", tag: "Product" },
  ];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Target, text: "OKRs" }]} title="Goals" subtitle="Company, team and individual OKRs with weekly check-ins."
        actions={[{ label: "New OKR", icon: Plus }, { label: "Check-in", icon: Check }]} />
      <KpiStrip kpis={[
        { label: "Active OKRs", value: "47", delta: "Q4", tone: "neutral" },
        { label: "Avg progress", value: "68%", delta: "+6pp", tone: "up" },
        { label: "At risk", value: "7", delta: "Watch", tone: "down" },
        { label: "Check-in rate", value: "92%", delta: "+3pp", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        {okrs.map(o => (
          <div key={o.o} className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium">{o.o}</div>
                <div className="text-[11px] text-muted-foreground">{o.owner} · {o.tag}</div>
              </div>
              <Badge variant="outline" className={o.p > 70 ? "border-success/40 text-success" : o.p > 50 ? "border-warning/40 text-warning" : "border-destructive/40 text-destructive"}>{o.p}%</Badge>
            </div>
            <Progress value={o.p} className="h-1.5" />
          </div>
        ))}
      </CardContent></Card>
    </Shell>
  );
}

/* 7. Live analytics — Datadog Live */
export function LiveConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Activity, text: "Live" }, { icon: Wifi, text: "Realtime" }]} title="Live operations" subtitle="Streaming metrics across every service, region and tenant."
        actions={[{ label: "Pause", icon: Clock }]} />
      <KpiStrip kpis={[
        { label: "Active users", value: "12,482", delta: "Live", tone: "up", spark: [11,11.5,12,12.2,12.4,12.48] },
        { label: "Req/s", value: "8,142", delta: "+4%", tone: "up", spark: [7.5,7.8,7.9,8.0,8.1,8.14] },
        { label: "p95 latency", value: "284ms", delta: "Healthy", tone: "up" },
        { label: "Errors / min", value: "12", delta: "-6", tone: "up" },
      ]} />
      <div className="grid lg:grid-cols-2 gap-3">
        <Card><CardContent className="p-4 space-y-3">
          <SectionHeader title="Traffic by region" />
          <MiniBarChart data={[820,640,512,384,220,120]} labels={["NA","EU","APAC","LATAM","MEA","OCE"]} />
        </CardContent></Card>
        <Card><CardContent className="p-4 space-y-3">
          <SectionHeader title="Live events" />
          <ul className="text-sm space-y-1.5">
            {["signup · acme@globex.com","payment · $12,400","deploy · v3.42.2","alert · cache p99","signup · ops@stark.io","churn · trial expired"].map((e, i) => (
              <li key={i} className="flex items-center gap-2"><CircleDot className="h-2 w-2 text-success" /><span className="text-muted-foreground font-mono text-xs">12:42:{(10 - i).toString().padStart(2,'0')}</span><span>{e}</span></li>
            ))}
          </ul>
        </CardContent></Card>
      </div>
    </Shell>
  );
}

/* 8. Heatmaps */
export function HeatmapsConsole() {
  const grid = Array.from({ length: 7 * 24 }, (_, i) => Math.round(Math.random() * 100));
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Activity, text: "Heatmaps" }]} title="Activity density" subtitle="Hour-of-day × day-of-week intensity across user actions."
        actions={[{ label: "Export", icon: Download }]} />
      <Card><CardContent className="p-4">
        <div className="grid grid-cols-24 gap-0.5" style={{ gridTemplateColumns: "60px repeat(24, 1fr)" }}>
          <div />
          {Array.from({ length: 24 }).map((_, h) => <div key={h} className="text-[9px] text-center text-muted-foreground">{h}</div>)}
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, di) => (
            <>
              <div key={d} className="text-[11px] text-muted-foreground self-center">{d}</div>
              {Array.from({ length: 24 }).map((_, h) => {
                const v = grid[di * 24 + h];
                return <div key={`${d}-${h}`} className="aspect-square rounded-sm" style={{ background: `color-mix(in oklab, var(--primary) ${v}%, var(--muted))` }} />;
              })}
            </>
          ))}
        </div>
      </CardContent></Card>
    </Shell>
  );
}

/* 9. Offline sync */
export function OfflineConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: WifiOff, text: "Offline" }]} title="Offline-first sync" subtitle="Local-first queue with conflict resolution and resumable uploads."
        actions={[{ label: "Force sync", icon: Repeat }]} />
      <KpiStrip kpis={[
        { label: "Devices offline", value: "18", delta: "Queued", tone: "neutral" },
        { label: "Pending mutations", value: "412", delta: "Will replay", tone: "neutral" },
        { label: "Conflicts (24h)", value: "3", delta: "Resolved 2", tone: "down" },
        { label: "Last full sync", value: "2 min", delta: "Healthy", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-2">
        <SectionHeader title="Pending operations" />
        {["POS sale · branch SP-12","Inventory adjustment · WH-04","Lead capture · trade-show","Document upload · NDA-018"].map((p, i) => (
          <div key={p} className="flex items-center justify-between rounded border border-border/60 px-3 py-2 text-sm">
            <span>{p}</span>
            <div className="flex items-center gap-2"><Progress value={[60,30,80,15][i]} className="h-1.5 w-32" /><span className="text-xs text-muted-foreground">{[60,30,80,15][i]}%</span></div>
          </div>
        ))}
      </CardContent></Card>
    </Shell>
  );
}

/* 10. Sessions */
export function SessionsConsole() {
  const rows = [["Layla T.","MacBook Pro","Lisbon, PT","now","Chrome 129"],["Marco V.","iPhone 15","Madrid, ES","12m","Safari iOS"],["Aki R.","Windows PC","Tokyo, JP","1h","Edge 128"],["Devon S.","iPad","NYC, US","3h","Safari"],["Ana C.","Linux","Berlin, DE","2d","Firefox 130"]];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Smartphone, text: "Sessions" }]} title="Active sessions" subtitle="All authenticated sessions across the org."
        actions={[{ label: "Revoke all", icon: Lock }]} />
      <KpiStrip kpis={[
        { label: "Active", value: "248", delta: "Live", tone: "up" },
        { label: "MFA enforced", value: "100%", delta: "Policy", tone: "up" },
        { label: "Stale > 30d", value: "12", delta: "Cleanup", tone: "down" },
        { label: "Unusual logins", value: "0", delta: "All clear", tone: "up" },
      ]} />
      <Card><CardContent className="p-4"><Table>
        <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>User</TableHead><TableHead>Device</TableHead><TableHead>Location</TableHead><TableHead>Last active</TableHead><TableHead>Browser</TableHead><TableHead /></TableRow></TableHeader>
        <TableBody>{rows.map(r => (
          <TableRow key={r.join("-")}><TableCell className="font-medium">{r[0]}</TableCell><TableCell>{r[1]}</TableCell><TableCell>{r[2]}</TableCell><TableCell className="text-muted-foreground">{r[3]}</TableCell><TableCell className="font-mono text-xs">{r[4]}</TableCell><TableCell><Button size="sm" variant="ghost">Revoke</Button></TableCell></TableRow>
        ))}</TableBody>
      </Table></CardContent></Card>
    </Shell>
  );
}

/* 11. Devices */
export function DevicesConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Smartphone, text: "Devices" }]} title="Device inventory" subtitle="Managed devices, posture and compliance status."
        actions={[{ label: "Enroll", icon: Plus }]} />
      <KpiStrip kpis={[
        { label: "Enrolled", value: "412", delta: "+12", tone: "up" },
        { label: "Compliant", value: "97%", delta: "+1pp", tone: "up" },
        { label: "Encrypted", value: "100%", delta: "Policy", tone: "up" },
        { label: "Quarantined", value: "4", delta: "Action", tone: "down" },
      ]} />
      <FilterBar placeholder="Search devices…" chips={["OS","Posture","Owner","Last seen"]} />
      <RecordsTable rows={[
        { id: "DEV-001", name: "Layla — MacBook Pro 16", status: "active", owner: "Layla T.", updated: "now", amount: "macOS 14.6", tag: "Compliant" },
        { id: "DEV-002", name: "Marco — iPhone 15", status: "active", owner: "Marco V.", updated: "12m", amount: "iOS 18.1", tag: "Compliant" },
        { id: "DEV-003", name: "Aki — ThinkPad", status: "review", owner: "Aki R.", updated: "1h", amount: "Win 11", tag: "Patch due" },
        { id: "DEV-004", name: "Devon — iPad Pro", status: "pending", owner: "Devon S.", updated: "3h", amount: "iPadOS 18", tag: "Pending MDM" },
      ]} />
    </Shell>
  );
}

/* 12. Threats — Cloudflare Zero Trust */
export function ThreatsConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: ShieldAlert, text: "Threats" }]} title="Threat intelligence" subtitle="Blocked attacks, abuse signals and posture changes."
        actions={[{ label: "Run scan", icon: Shield }]} />
      <KpiStrip kpis={[
        { label: "Blocked (24h)", value: "18,412", delta: "+8%", tone: "up", spark: [12,13,14,15,16,17,18] },
        { label: "Critical", value: "2", delta: "Investigating", tone: "down" },
        { label: "Bot traffic", value: "32%", delta: "Filtered", tone: "neutral" },
        { label: "WAF rules", value: "184", delta: "Active", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Top blocked sources (24h)" />
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>IP / ASN</TableHead><TableHead>Country</TableHead><TableHead>Reason</TableHead><TableHead>Count</TableHead><TableHead>Severity</TableHead></TableRow></TableHeader>
          <TableBody>
            {[["203.0.113.42 · AS12389","RU","Credential stuffing","4,212","High"],["198.51.100.7 · AS9009","CN","Bot scrape","2,184","Medium"],["192.0.2.18 · AS6939","BR","SQLi attempt","918","Critical"],["203.0.113.99 · AS3216","IR","Rate-limit abuse","612","Medium"]].map(r => (
              <TableRow key={r[0]}><TableCell className="font-mono text-xs">{r[0]}</TableCell><TableCell>{r[1]}</TableCell><TableCell>{r[2]}</TableCell><TableCell className="tabular-nums">{r[3]}</TableCell><TableCell><Badge variant="outline" className={r[4] === "Critical" ? "border-destructive/40 text-destructive" : r[4] === "High" ? "border-warning/40 text-warning" : "border-muted"}>{r[4]}</Badge></TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </Shell>
  );
}

/* 13. Wallet */
export function WalletConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Wallet, text: "Wallet" }]} title="Wallet & payouts" subtitle="Balances, payouts and rewards across the platform."
        actions={[{ label: "Withdraw", icon: ArrowUpRight }, { label: "Top up", icon: Plus }]} />
      <div className="grid lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2"><CardContent className="p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Available balance</div>
          <div className="mt-1 text-4xl font-bold tabular-nums">$48,242.18</div>
          <div className="mt-1 flex gap-3 text-xs">
            <span className="text-muted-foreground">Pending: <span className="text-foreground font-medium">$2,184.00</span></span>
            <span className="text-muted-foreground">Reserved: <span className="text-foreground font-medium">$420.00</span></span>
          </div>
          <Sparkline data={[20,24,28,32,38,42,46,48]} tone="up" width={300} height={50} />
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <SectionHeader title="Quick" />
          <QuickActions actions={[
            { label: "Send", icon: ArrowUpRight }, { label: "Request", icon: ArrowDownRight },
            { label: "Convert", icon: Repeat }, { label: "Cards", icon: ShoppingCart },
          ]} />
        </CardContent></Card>
      </div>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Recent transactions" right={<Button size="sm" variant="outline">Export</Button>} />
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>
            {[["Today","Payout — Stripe","Out","-$12,400.00"],["Today","Invoice INV-10921","In","+$48,200.00"],["Yesterday","Refund — Globex","Out","-$420.00"],["2d","Conversion EUR→USD","FX","$0.00"],["3d","Subscription — Vala Pro","In","+$84.00"]].map(r => (
              <TableRow key={r.join("-")}><TableCell className="text-muted-foreground">{r[0]}</TableCell><TableCell>{r[1]}</TableCell><TableCell><Badge variant="outline" className="font-normal">{r[2]}</Badge></TableCell><TableCell className={`text-right tabular-nums font-medium ${r[3].startsWith("-") ? "text-destructive" : "text-success"}`}>{r[3]}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </Shell>
  );
}

/* 14. Leaderboard */
export function LeaderboardConsole() {
  const top = [
    { r: 1, n: "Marina Silva", t: "Sales · EMEA", v: "$1.84M", c: 32 },
    { r: 2, n: "Kenji Aoki", t: "Sales · APAC", v: "$1.62M", c: 28 },
    { r: 3, n: "Hannah Beck", t: "Sales · NA-East", v: "$1.41M", c: 24 },
    { r: 4, n: "Luis Mendez", t: "Sales · LATAM", v: "$1.18M", c: 21 },
    { r: 5, n: "Priya Rao", t: "Sales · MEA", v: "$0.94M", c: 19 },
  ];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Trophy, text: "Leaderboard" }]} title="Top performers" subtitle="Quota attainment and deal velocity across regions."
        actions={[{ label: "Period", icon: Calendar }]} />
      <Card><CardContent className="p-4 space-y-2">
        {top.map(p => (
          <div key={p.r} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${p.r === 1 ? "bg-warning text-warning-foreground" : p.r === 2 ? "bg-muted" : p.r === 3 ? "bg-accent" : "bg-muted/50"}`}>{p.r}</div>
            <Avatar><AvatarFallback className="text-xs">{p.n.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{p.n}</div>
              <div className="text-xs text-muted-foreground">{p.t} · {p.c} deals</div>
            </div>
            <div className="text-right">
              <div className="font-bold tabular-nums">{p.v}</div>
              <div className="text-[11px] text-success">+ on quota</div>
            </div>
            {p.r <= 3 && <Award className="h-5 w-5 text-warning" />}
          </div>
        ))}
      </CardContent></Card>
    </Shell>
  );
}

/* 15. Theme */
export function ThemeConsole() {
  const swatches = ["primary","secondary","accent","success","warning","destructive","muted","foreground"];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Palette, text: "Theme" }]} title="Branding & theme" subtitle="Workspace colors, typography and logo."
        actions={[{ label: "Save", icon: Check }]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Color tokens" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {swatches.map(s => (
            <div key={s} className="rounded-lg border border-border/60 p-3">
              <div className="aspect-video rounded-md" style={{ backgroundColor: `var(--${s})` }} />
              <div className="mt-2 text-xs font-mono">--{s}</div>
            </div>
          ))}
        </div>
      </CardContent></Card>
      <div className="grid md:grid-cols-2 gap-3">
        <Card><CardContent className="p-4">
          <SectionHeader title="Typography" />
          <div className="mt-3 space-y-2">
            <div className="text-3xl font-bold">Display 32 / Bold</div>
            <div className="text-xl font-semibold">Heading 20 / Semibold</div>
            <div className="text-sm">Body 14 / Regular</div>
            <div className="text-xs text-muted-foreground">Caption 12 / Muted</div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <SectionHeader title="Logo & favicon" />
          <div className="mt-3 grid place-items-center rounded-lg border border-dashed border-border/60 py-10 text-sm text-muted-foreground">Drop SVG / PNG</div>
        </CardContent></Card>
      </div>
    </Shell>
  );
}

/* 16. MLM tree */
export function MlmConsole() {
  const tier = (level: string, count: number, vol: string, comm: string) => (
    <div className="rounded-lg border border-border/60 p-3">
      <div className="flex items-center justify-between"><div className="text-sm font-semibold">{level}</div><Crown className="h-4 w-4 text-warning" /></div>
      <div className="mt-2 text-2xl font-bold">{count}</div>
      <div className="text-xs text-muted-foreground">Vol {vol} · Commission {comm}</div>
    </div>
  );
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Network, text: "MLM" }]} title="Referral tree" subtitle="Network depth, volume and commission attribution."
        actions={[{ label: "Commission run", icon: Repeat }]} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tier("Diamond", 18, "$1.2M", "12%")}
        {tier("Platinum", 64, "$0.84M", "10%")}
        {tier("Gold", 184, "$0.42M", "8%")}
        {tier("Silver", 642, "$0.18M", "6%")}
      </div>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Top sponsors" />
        <RecordsTable rows={[
          { id: "MLM-001", name: "Network leader · M. Silva", status: "active", owner: "Tier Diamond", updated: "2h", amount: "$184k vol", tag: "L7" },
          { id: "MLM-002", name: "Network leader · K. Aoki", status: "active", owner: "Tier Diamond", updated: "1d", amount: "$142k vol", tag: "L6" },
          { id: "MLM-003", name: "Network leader · L. Mendez", status: "review", owner: "Tier Platinum", updated: "3d", amount: "$98k vol", tag: "L5" },
        ]} />
      </CardContent></Card>
    </Shell>
  );
}

/* 17. Branches */
export function BranchesConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: GitBranch, text: "Branches" }]} title="Multi-branch operations" subtitle="Per-region branches, P&L and headcount."
        actions={[{ label: "New branch", icon: Plus }]} />
      <KpiStrip kpis={[
        { label: "Branches", value: "42", delta: "+3", tone: "up" },
        { label: "Avg revenue / branch", value: "$1.18M", delta: "+6%", tone: "up" },
        { label: "Underperforming", value: "5", delta: "Watch", tone: "down" },
        { label: "Top region", value: "EMEA-N", delta: "Champion", tone: "up" },
      ]} />
      <FilterBar placeholder="Search branches…" chips={["Region","Status","Manager","Revenue"]} />
      <RecordsTable rows={[
        { id: "BR-001", name: "Lisbon HQ", status: "active", owner: "A. Costa", updated: "today", amount: "$2.84M", tag: "Flagship" },
        { id: "BR-002", name: "Madrid", status: "active", owner: "L. Mendez", updated: "1d", amount: "$1.42M", tag: "EMEA-S" },
        { id: "BR-003", name: "Berlin", status: "active", owner: "H. Beck", updated: "2d", amount: "$1.18M", tag: "EMEA-N" },
        { id: "BR-004", name: "Tokyo", status: "active", owner: "K. Aoki", updated: "3d", amount: "$0.94M", tag: "APAC" },
        { id: "BR-005", name: "São Paulo", status: "review", owner: "L. Mendez", updated: "5d", amount: "$0.62M", tag: "LATAM" },
      ]} />
    </Shell>
  );
}

/* 18. Recruitment — Greenhouse */
export function RecruitmentConsole() {
  const stages = [
    { s: "Applied", c: 412 }, { s: "Phone screen", c: 84 }, { s: "Take-home", c: 42 },
    { s: "Onsite", c: 21 }, { s: "Offer", c: 8 }, { s: "Hired", c: 5 },
  ];
  return (
    <Shell>
      <Hero eyebrow={[{ icon: UserCheck, text: "Recruitment" }]} title="Hiring pipeline" subtitle="Candidates, interviews and offers across every open role."
        actions={[{ label: "Post role", icon: Plus }]} />
      <KpiStrip kpis={[
        { label: "Open roles", value: "22", delta: "+4", tone: "up" },
        { label: "Time to hire", value: "32 d", delta: "-4d", tone: "up" },
        { label: "Offer accept rate", value: "84%", delta: "+2pp", tone: "up" },
        { label: "Pipeline value", value: "418", delta: "Healthy", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Funnel" />
        <div className="space-y-2">
          {stages.map(s => (
            <div key={s.s} className="flex items-center gap-3">
              <div className="w-32 text-sm">{s.s}</div>
              <Progress value={(s.c / 412) * 100} className="h-2 flex-1" />
              <div className="w-12 text-right tabular-nums text-sm">{s.c}</div>
            </div>
          ))}
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Open roles" />
        <RecordsTable rows={[
          { id: "ROL-101", name: "Staff Platform Engineer", status: "active", owner: "Eng · D. Singh", updated: "today", amount: "8 candidates", tag: "Remote" },
          { id: "ROL-102", name: "Enterprise AE — DACH", status: "active", owner: "Sales · S. Mendez", updated: "1d", amount: "12 candidates", tag: "Berlin" },
          { id: "ROL-103", name: "Senior Product Designer", status: "review", owner: "Product · L. Park", updated: "2d", amount: "6 candidates", tag: "Hybrid" },
          { id: "ROL-104", name: "GRC Analyst", status: "pending", owner: "Security · J. Lin", updated: "4d", amount: "3 candidates", tag: "Remote EU" },
        ]} />
      </CardContent></Card>
    </Shell>
  );
}

/* 19. POS — Square style */
export function PosConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: ShoppingCart, text: "POS" }]} title="Point of sale" subtitle="In-store, mobile and counter sales operations."
        actions={[{ label: "Open till", icon: ShoppingCart }, { label: "Z-report", icon: FileText }]} />
      <KpiStrip kpis={[
        { label: "Sales today", value: "$28,412", delta: "+12%", tone: "up", spark: [20,22,24,26,27,28] },
        { label: "Tickets", value: "1,284", delta: "+8%", tone: "up" },
        { label: "Avg ticket", value: "$22.12", delta: "+3%", tone: "up" },
        { label: "Refunds", value: "$184", delta: "-22%", tone: "up" },
      ]} />
      <div className="grid lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2"><CardContent className="p-4 space-y-3">
          <SectionHeader title="Live terminals" />
          <div className="grid sm:grid-cols-2 gap-2">
            {["Counter A","Counter B","Mobile 1","Mobile 2","Kiosk","Drive-thru"].map((t, i) => (
              <div key={t} className="flex items-center justify-between rounded border border-border/60 p-3">
                <div className="flex items-center gap-2"><CircleDot className={`h-3 w-3 ${i % 4 === 3 ? "text-muted-foreground" : "text-success"}`} /><span className="text-sm font-medium">{t}</span></div>
                <div className="text-xs text-muted-foreground">$ {(2.4 + i * 0.4).toFixed(1)}k · {12 + i * 5} sales</div>
              </div>
            ))}
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <SectionHeader title="Top products" />
          <ul className="mt-3 space-y-2 text-sm">
            {[["Espresso · double","$842"],["Bagel · everything","$612"],["Latte · oat","$584"],["Salad · house","$418"],["Pastry · almond","$284"]].map(p => (
              <li key={p[0]} className="flex items-center justify-between"><span>{p[0]}</span><span className="text-muted-foreground tabular-nums">{p[1]}</span></li>
            ))}
          </ul>
        </CardContent></Card>
      </div>
    </Shell>
  );
}

/* 20. ERP / Sales */
export function ErpConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Briefcase, text: "Sales / ERP" }]} title="Sales & ERP" subtitle="Quotes, orders and invoicing across companies."
        actions={[{ label: "New quote", icon: Plus }, { label: "New order", icon: ShoppingCart }]} />
      <KpiStrip kpis={[
        { label: "Open quotes", value: "84", delta: "$1.42M", tone: "up" },
        { label: "Confirmed orders", value: "212", delta: "+12%", tone: "up", spark: [180,190,200,205,210,212] },
        { label: "To deliver", value: "48", delta: "On time 96%", tone: "up" },
        { label: "To invoice", value: "32", delta: "$284k", tone: "neutral" },
      ]} />
      <Tabs defaultValue="quotes">
        <TabsList><TabsTrigger value="quotes">Quotes</TabsTrigger><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="deliveries">Deliveries</TabsTrigger><TabsTrigger value="customers">Customers</TabsTrigger></TabsList>
        <TabsContent value="quotes"><RecordsTable rows={[
          { id: "SQ-1042", name: "Globex Corp — annual renewal", status: "review", owner: "M. Silva", updated: "today", amount: "$48,200", tag: "Quote" },
          { id: "SQ-1041", name: "Initech — additional seats", status: "active", owner: "K. Aoki", updated: "1d", amount: "$12,800", tag: "Quote" },
          { id: "SQ-1040", name: "Stark Industries — pro upgrade", status: "pending", owner: "H. Beck", updated: "2d", amount: "$8,400", tag: "Draft" },
        ]} /></TabsContent>
        <TabsContent value="orders"><RecordsTable rows={[
          { id: "SO-2218", name: "Wayne Enterprises — Q4 renewal", status: "active", owner: "L. Mendez", updated: "today", amount: "$112,000", tag: "Order" },
          { id: "SO-2217", name: "Hooli — onboarding kit", status: "active", owner: "P. Rao", updated: "1d", amount: "$24,800", tag: "Order" },
        ]} /></TabsContent>
        <TabsContent value="deliveries"><Card><CardContent className="p-6 text-sm text-muted-foreground">Shipments & fulfilment tracking.</CardContent></Card></TabsContent>
        <TabsContent value="customers"><Card><CardContent className="p-6 text-sm text-muted-foreground">Customer master records.</CardContent></Card></TabsContent>
      </Tabs>
    </Shell>
  );
}

/* 21. Inventory */
export function InventoryConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Boxes, text: "Inventory" }]} title="Stock & warehouses" subtitle="Multi-warehouse stock, transfers and reorder points."
        actions={[{ label: "Adjust stock", icon: Plus }, { label: "Transfer", icon: Repeat }]} />
      <KpiStrip kpis={[
        { label: "SKUs", value: "4,128", delta: "+42", tone: "up" },
        { label: "Stock value", value: "$2.84M", delta: "+3%", tone: "up" },
        { label: "Low stock", value: "38", delta: "Reorder", tone: "down" },
        { label: "Backorders", value: "12", delta: "ETA 5d", tone: "down" },
      ]} />
      <div className="grid lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2"><CardContent className="p-4 space-y-3">
          <SectionHeader title="Warehouses" />
          <Table>
            <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Code</TableHead><TableHead>Location</TableHead><TableHead>Capacity</TableHead><TableHead>Stock value</TableHead></TableRow></TableHeader>
            <TableBody>
              {[["WH-LIS","Lisbon · PT","82%","$1.12M"],["WH-MAD","Madrid · ES","68%","$0.84M"],["WH-BER","Berlin · DE","74%","$0.62M"],["WH-TKY","Tokyo · JP","58%","$0.26M"]].map(r => (
                <TableRow key={r[0]}><TableCell className="font-mono text-xs">{r[0]}</TableCell><TableCell>{r[1]}</TableCell><TableCell><Progress value={parseInt(r[2])} className="h-1.5 w-32 inline-block align-middle" /> <span className="text-xs text-muted-foreground ml-2">{r[2]}</span></TableCell><TableCell className="tabular-nums">{r[3]}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <SectionHeader title="Low stock alerts" />
          <ul className="mt-3 space-y-2 text-sm">
            {["SKU-4128 · 12 left","SKU-3921 · 8 left","SKU-2814 · 4 left","SKU-1842 · 2 left"].map(s => (
              <li key={s} className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-warning" /><span>{s}</span></li>
            ))}
          </ul>
        </CardContent></Card>
      </div>
    </Shell>
  );
}

/* 22. Manufacturing */
export function ManufacturingConsole() {
  return (
    <Shell>
      <Hero eyebrow={[{ icon: Factory, text: "Manufacturing" }]} title="Production operations" subtitle="BoMs, MOs, work centers and quality."
        actions={[{ label: "New MO", icon: Plus }, { label: "BoM library", icon: Layers }]} />
      <KpiStrip kpis={[
        { label: "Open MOs", value: "84", delta: "+6", tone: "up" },
        { label: "On-time", value: "94%", delta: "+1pp", tone: "up" },
        { label: "Scrap rate", value: "1.8%", delta: "-0.3pp", tone: "up" },
        { label: "OEE", value: "82%", delta: "Healthy", tone: "up" },
      ]} />
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Work centers" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[["Assembly A",92,"Running"],["Assembly B",68,"Running"],["Packaging",84,"Running"],["QC Bench",42,"Setup"]].map(w => (
            <div key={w[0] as string} className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between"><div className="font-semibold text-sm">{w[0]}</div><Badge variant="outline" className={w[2] === "Running" ? "border-success/40 text-success" : "border-warning/40 text-warning"}>{w[2]}</Badge></div>
              <Progress value={w[1] as number} className="mt-2 h-1.5" />
              <div className="mt-1 text-[11px] text-muted-foreground">Utilization {w[1]}%</div>
            </div>
          ))}
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-4 space-y-3">
        <SectionHeader title="Manufacturing orders" />
        <RecordsTable rows={[
          { id: "MO-3214", name: "Batch · Vala Hub v2 — 1,200 units", status: "active", owner: "Assembly A", updated: "1h", amount: "ETA 2d", tag: "In progress" },
          { id: "MO-3213", name: "Batch · Sensor kit — 400 units", status: "active", owner: "Assembly B", updated: "today", amount: "ETA 4d", tag: "In progress" },
          { id: "MO-3212", name: "Batch · Cable set — 2,800 units", status: "review", owner: "Packaging", updated: "2d", amount: "QC pending", tag: "Quality" },
          { id: "MO-3211", name: "Batch · Charger — 1,800 units", status: "active", owner: "Assembly A", updated: "3d", amount: "Done", tag: "Closed" },
        ]} />
      </CardContent></Card>
    </Shell>
  );
}
