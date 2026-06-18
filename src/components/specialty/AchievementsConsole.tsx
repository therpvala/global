/**
 * Achievement Management System (AMS)
 * Universal Gamification Center for SaaS Vala Nexus.
 * UI-only. Built from existing enterprise primitives + shadcn components.
 */
import {
  Trophy, Medal, Star, Crown, Award, Sparkles, Target, Zap, Flame,
  TrendingUp, Users, ShieldCheck, Gift, Gamepad2, Map, History, Bot,
  Search, Plus, Filter, Download, Upload, Settings, Bell, Volume2, VolumeX,
  Play, Pause, ChevronRight, CheckCircle2, Clock, BarChart3, Layers,
  Rocket, Globe, Palette, BookOpen, FileSignature, Coins, Lock,
  Calendar, Mail, MessageSquare, Eye, Edit3, Copy, Trash2, RefreshCw,
  ArrowUpRight, ArrowDownRight, Hash, Heart, ThumbsUp, Share2, GitBranch,
  Webhook, Database, Key, AlertTriangle, Info, Smartphone, Monitor,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  KpiStrip, SectionHeader, MiniBarChart, FilterBar, QuickActions,
  ActivityFeed, type Kpi,
} from "../enterprise";

/* ---------- Hero ---------- */
function Hero() {
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden">
      <div
        className="px-5 py-5 text-primary-foreground"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                <Trophy className="mr-1 h-3 w-3" /> AMS · Central
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <Globe className="mr-1 h-3 w-3" /> 142 countries
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <Users className="mr-1 h-3 w-3" /> 18,402 active players
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <Sparkles className="mr-1 h-3 w-3" /> AI engine on
              </Badge>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold">
              Achievement Management System
            </h1>
            <p className="text-sm opacity-90 max-w-2xl">
              One central system for rewards, badges, levels, ranks, trophies,
              certificates and leaderboards across every module and role in the
              Nexus.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <Input
                placeholder="Search achievements, users, ranks…"
                className="h-9 pl-9 bg-white/15 border-white/20 placeholder:text-white/70 text-white"
              />
            </div>
            <Button size="sm" variant="secondary">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New achievement
            </Button>
            <Button size="sm" variant="secondary">
              <Bot className="mr-1.5 h-3.5 w-3.5" /> AI suggest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Data ---------- */
const KPIS: Kpi[] = [
  { label: "Total achievements", value: "1,284", delta: "+24", tone: "up", spark: [4, 5, 6, 7, 8, 9, 11] },
  { label: "Unlocked today", value: "612", delta: "+18%", tone: "up", spark: [3, 4, 5, 6, 7, 8, 9] },
  { label: "Pending rewards", value: "47", delta: "-6", tone: "up", spark: [9, 8, 7, 6, 5, 5, 4] },
  { label: "XP issued (30d)", value: "8.4M", delta: "+12%", tone: "up", spark: [4, 5, 6, 6, 7, 8, 10] },
  { label: "Global champions", value: "18", tone: "neutral", spark: [2, 2, 3, 3, 3, 4, 4] },
  { label: "Leaderboard battles", value: "94", delta: "+11", tone: "up", spark: [4, 5, 5, 6, 7, 8, 9] },
];

const RANKS = [
  { name: "Starter",  color: "bg-zinc-400",   xp: 0 },
  { name: "Bronze",   color: "bg-amber-700",  xp: 1_000 },
  { name: "Silver",   color: "bg-slate-300",  xp: 5_000 },
  { name: "Gold",     color: "bg-yellow-400", xp: 15_000 },
  { name: "Platinum", color: "bg-cyan-300",   xp: 35_000 },
  { name: "Diamond",  color: "bg-sky-400",    xp: 75_000 },
  { name: "Titan",    color: "bg-violet-500", xp: 150_000 },
  { name: "Legend",   color: "bg-fuchsia-500",xp: 300_000 },
  { name: "Champion", color: "bg-rose-500",   xp: 600_000 },
  { name: "Global Champion", color: "bg-gradient-to-br from-amber-400 to-rose-500", xp: 1_200_000 },
];

const TROPHIES = [
  { name: "First Login",    icon: Sparkles, holders: 18_402 },
  { name: "First Customer", icon: Users,    holders: 9_104 },
  { name: "First Sale",     icon: Coins,    holders: 6_872 },
  { name: "First Revenue",  icon: TrendingUp, holders: 5_910 },
  { name: "First Renewal",  icon: Award,    holders: 3_241 },
  { name: "Top Seller",     icon: Trophy,   holders: 412 },
  { name: "Top Developer",  icon: Rocket,   holders: 187 },
  { name: "Top Vendor",     icon: Crown,    holders: 96 },
  { name: "Top Reseller",   icon: Medal,    holders: 64 },
  { name: "Top Franchise",  icon: ShieldCheck, holders: 41 },
  { name: "Global Champion",icon: Globe,    holders: 18 },
];

const LEADERBOARD = [
  { rank: 1,  name: "Aarav Mehta",      role: "Reseller",  country: "IN", xp: 1_284_500, rankName: "Global Champion" },
  { rank: 2,  name: "Sofia Rossi",      role: "Vendor",    country: "IT", xp: 974_120,   rankName: "Champion" },
  { rank: 3,  name: "Liam O'Brien",     role: "Franchise", country: "IE", xp: 902_310,   rankName: "Champion" },
  { rank: 4,  name: "Wei Zhang",        role: "Developer", country: "CN", xp: 812_540,   rankName: "Legend" },
  { rank: 5,  name: "Noah Williams",    role: "Reseller",  country: "US", xp: 768_220,   rankName: "Legend" },
  { rank: 6,  name: "Amara Okafor",     role: "Vendor",    country: "NG", xp: 654_400,   rankName: "Legend" },
  { rank: 7,  name: "Hiroshi Tanaka",   role: "Developer", country: "JP", xp: 612_840,   rankName: "Titan" },
  { rank: 8,  name: "Isabella García",  role: "Marketing", country: "ES", xp: 540_120,   rankName: "Titan" },
  { rank: 9,  name: "Omar Haddad",      role: "Support",   country: "AE", xp: 489_300,   rankName: "Titan" },
  { rank: 10, name: "Chloé Laurent",    role: "Affiliate", country: "FR", xp: 412_900,   rankName: "Diamond" },
];

const ACHIEVEMENTS = [
  { code: "ACH-1042", title: "Revenue Rocket — $100K MTD", category: "Revenue",  xp: 5000, status: "Active",   role: "Reseller",  unlocks: 184 },
  { code: "ACH-1041", title: "Bug Slayer — 50 fixes",       category: "Quality",  xp: 1500, status: "Active",   role: "Developer", unlocks: 92 },
  { code: "ACH-1040", title: "Renewal Master — 25 renewals",category: "Retention",xp: 2000, status: "Active",   role: "Reseller",  unlocks: 311 },
  { code: "ACH-1039", title: "Customer Whisperer — 4.9★",   category: "Support",  xp: 1200, status: "Active",   role: "Support",   unlocks: 76 },
  { code: "ACH-1038", title: "Marketplace King — 100 SKUs", category: "Product",  xp: 2500, status: "Draft",    role: "Vendor",    unlocks: 0 },
  { code: "ACH-1037", title: "Territory Tycoon",            category: "Growth",   xp: 4000, status: "Active",   role: "Franchise", unlocks: 27 },
  { code: "ACH-1036", title: "First Sale Trophy",           category: "Onboarding",xp: 250, status: "Active",   role: "All",       unlocks: 6_872 },
  { code: "ACH-1035", title: "Champion of the Month",       category: "Recognition",xp: 10000,status: "Scheduled",role: "All",      unlocks: 0 },
];

/* ---------- Sub UI ---------- */
function TrophyCard({ name, Icon, holders }: { name: string; Icon: any; holders: number }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-300/30 to-rose-400/30 border border-amber-400/40">
            <Icon className="h-6 w-6 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{name}</div>
            <div className="text-[11px] text-muted-foreground">{holders.toLocaleString()} holders</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RankLadder() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {RANKS.map((r, i) => (
        <div key={r.name} className="rounded-xl border border-border/60 p-3 bg-card">
          <div className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full ${r.color}`} />
            <div>
              <div className="text-xs font-semibold">{r.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {r.xp >= 1000 ? `${(r.xp / 1000).toFixed(0)}K XP` : `${r.xp} XP`}
              </div>
            </div>
          </div>
          <Progress value={Math.min(100, (i + 1) * 10)} className="mt-2 h-1" />
        </div>
      ))}
    </div>
  );
}

function CountryFlag({ code }: { code: string }) {
  return (
    <span className="inline-flex h-5 w-7 items-center justify-center rounded bg-muted text-[10px] font-medium">
      {code}
    </span>
  );
}

/* ---------- Tabs ---------- */
function CommandTab() {
  return (
    <div className="space-y-4">
      <KpiStrip kpis={KPIS} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <SectionHeader title="XP issued across modules (30d)" desc="Revenue · Sales · Support · Dev · Training" />
            <MiniBarChart data={[18, 24, 22, 31, 28, 36, 42, 38, 44, 51, 47, 56]} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Rank distribution" />
            <RankLadder />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <SectionHeader
              title="Recent unlocks"
              right={<Button size="sm" variant="ghost">View all</Button>}
            />
            <ActivityFeed
              items={[
                { who: "Aarav Mehta",     what: "unlocked Revenue Rocket (+5000 XP)", when: "2m ago" },
                { who: "Wei Zhang",       what: "earned Top Developer trophy",       when: "11m ago" },
                { who: "Sofia Rossi",     what: "ranked up to Champion",             when: "27m ago" },
                { who: "Chloé Laurent",   what: "earned Renewal Master badge",       when: "1h ago",  kind: "approve" },
                { who: "Omar Haddad",     what: "completed Daily Challenge × 7",     when: "2h ago",  kind: "update" },
                { who: "Isabella García", what: "redeemed 2,400 pts in Reward Store",when: "3h ago",  kind: "comment" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Quick actions" />
            <QuickActions
              actions={[
                { label: "New achievement", icon: Plus },
                { label: "Issue reward",    icon: Gift },
                { label: "Create challenge",icon: Target },
                { label: "Issue certificate",icon: FileSignature },
                { label: "Run AI suggest",  icon: Bot },
                { label: "Open reward store",icon: Coins },
              ]}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Engagement DAU/MAU", value: "62%", delta: "+4 pts", I: Heart, color: "text-rose-500" },
          { label: "Retention 30d",      value: "84%", delta: "+2 pts", I: ShieldCheck, color: "text-emerald-500" },
          { label: "Champions this week",value: "9",   delta: "+3",     I: Crown, color: "text-amber-500" },
          { label: "Avg. session lift",  value: "+18%",delta: "vs ctrl",I: TrendingUp, color: "text-sky-500" },
        ].map((x) => (
          <Card key={x.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{x.label}</div>
                <div className="mt-1 text-2xl font-bold">{x.value}</div>
                <div className="text-[11px] text-emerald-500">{x.delta}</div>
              </div>
              <x.I className={`h-8 w-8 ${x.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Top countries · 7d" />
            <div className="mt-3 space-y-2">
              {[
                { c: "India",   pct: 92 },
                { c: "USA",     pct: 81 },
                { c: "Germany", pct: 67 },
                { c: "Japan",   pct: 58 },
                { c: "Brazil",  pct: 47 },
                { c: "UAE",     pct: 41 },
              ].map((r) => (
                <div key={r.c}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{r.c}</span>
                    <span className="tabular-nums text-muted-foreground">{r.pct}%</span>
                  </div>
                  <Progress value={r.pct} className="mt-1 h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Reward velocity" desc="Issued vs redeemed" />
            <MiniBarChart data={[12, 18, 22, 19, 28, 31, 26, 34, 38, 42, 40, 48]} />
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div><div className="font-semibold">412</div><div className="text-muted-foreground">Issued</div></div>
              <div><div className="font-semibold">289</div><div className="text-muted-foreground">Redeemed</div></div>
              <div><div className="font-semibold">14</div><div className="text-muted-foreground">Reverted</div></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="System health" />
            <div className="mt-3 space-y-2 text-sm">
              {[
                { l: "AI Engine",         s: "Running",  i: Bot,      ok: true },
                { l: "Webhook delivery",  s: "Healthy",  i: Webhook,  ok: true },
                { l: "Notification fan-out", s: "Healthy", i: Bell,   ok: true },
                { l: "DB replication",    s: "Lag 0.4s", i: Database, ok: true },
                { l: "Reward queue",      s: "12 pending", i: Clock,  ok: false },
              ].map((h) => (
                <div key={h.l} className="flex items-center justify-between rounded-lg border border-border/60 p-2.5">
                  <div className="flex items-center gap-2">
                    <h.i className="h-4 w-4 text-muted-foreground" />
                    <span>{h.l}</span>
                  </div>
                  <Badge variant={h.ok ? "default" : "outline"} className="text-[10px]">{h.s}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LibraryTab() {
  return (
    <div className="space-y-4">
      <FilterBar
        chips={["All", "Active", "Draft", "Scheduled", "Archived"]}
      />
      <div className="grid gap-3 md:grid-cols-6">
        {[
          { l: "Total", v: "1,284", I: Layers },
          { l: "Active", v: "912", I: CheckCircle2 },
          { l: "Draft", v: "186", I: Edit3 },
          { l: "Scheduled", v: "94", I: Calendar },
          { l: "Archived", v: "92", I: Trash2 },
          { l: "AI-generated", v: "42", I: Bot },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">{s.l}</div>
                <s.I className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-lg font-bold">{s.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-right">Unlocks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACHIEVEMENTS.map((a) => (
                <TableRow key={a.code}>
                  <TableCell className="font-mono text-xs">{a.code}</TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                  <TableCell>{a.role}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.xp.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.unlocks.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === "Active" ? "default" : "outline"}>{a.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Achievement builder" desc="Define trigger · condition · reward" right={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />Save draft</Button>} />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Title</div>
                <Input placeholder="e.g. Revenue Rocket — $100K MTD" className="h-8" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Category</div>
                <Input placeholder="Revenue" className="h-8" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Trigger event</div>
                <Input placeholder="revenue.month >= 100000" className="h-8 font-mono text-xs" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">XP reward</div>
                <Input placeholder="5000" className="h-8" />
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Description</div>
                <Input placeholder="Reach $100K monthly revenue to earn the rocket" className="h-8" />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-2">
                {["Auto-issue", "Notify", "Celebrate", "AI-detect", "Repeatable"].map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />{t}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Category mix" desc="Achievements by category" />
            <div className="mt-3 space-y-2">
              {[
                { c: "Revenue", n: 312, pct: 92 },
                { c: "Sales", n: 248, pct: 76 },
                { c: "Support", n: 184, pct: 58 },
                { c: "Quality", n: 162, pct: 51 },
                { c: "Retention", n: 144, pct: 46 },
                { c: "Onboarding", n: 96, pct: 31 },
                { c: "Recognition", n: 72, pct: 24 },
              ].map((r) => (
                <div key={r.c}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{r.c}</span>
                    <span className="tabular-nums text-muted-foreground">{r.n}</span>
                  </div>
                  <Progress value={r.pct} className="mt-1 h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function XPLevelsTab() {
  const sources = [
    { label: "Revenue XP",     value: "2.4M", icon: TrendingUp },
    { label: "Sales XP",       value: "1.8M", icon: Coins },
    { label: "Support XP",     value: "612K", icon: ShieldCheck },
    { label: "Development XP", value: "488K", icon: Rocket },
    { label: "Training XP",    value: "342K", icon: BookOpen },
    { label: "Customer XP",    value: "1.1M", icon: Users },
    { label: "Renewal XP",     value: "720K", icon: Award },
    { label: "Marketplace XP", value: "896K", icon: Layers },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {sources.map((s) => {
          const I = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-xl font-bold">{s.value}</div>
                  </div>
                  <I className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardContent className="p-4">
          <SectionHeader
            title="Level ladder · 1 → 1000+"
            desc="Custom XP curves, level rewards and benefits"
            right={<Button size="sm" variant="outline"><Settings className="mr-1.5 h-3.5 w-3.5" />Edit curve</Button>}
          />
          <div className="mt-3 grid gap-2 md:grid-cols-5">
            {[1, 10, 50, 100, 250, 500, 750, 900, 999, 1000].map((lvl) => (
              <div key={lvl} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Level</div>
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="text-lg font-bold">{lvl}{lvl === 1000 ? "+" : ""}</div>
                <div className="text-[10px] text-muted-foreground">
                  {(lvl * 1250).toLocaleString()} XP · +{lvl * 5} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Rank ladder" desc="Starter → Global Champion" />
          <RankLadder />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="XP curve preview" desc="XP required per level (logarithmic)" />
            <MiniBarChart data={[2, 3, 5, 8, 12, 18, 26, 38, 54, 72, 96, 128]} />
            <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[11px] text-muted-foreground">
              <div>L1 · 1,250</div><div>L10 · 12.5K</div><div>L100 · 125K</div><div>L1000+ · 1.25M</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Level rewards" desc="Auto-granted on level up" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { l: 5,   r: "Bronze badge + 250 pts", v: "250" },
                  { l: 25,  r: "Silver frame", v: "1,000" },
                  { l: 50,  r: "Wallet credit", v: "$25" },
                  { l: 100, r: "Gold trophy + theme pack", v: "5,000" },
                  { l: 250, r: "Diamond rank + commission +1%", v: "—" },
                  { l: 500, r: "Legend status + featured profile", v: "—" },
                  { l: 1000,r: "Global Champion induction", v: "—" },
                ].map((x) => (
                  <TableRow key={x.l}>
                    <TableCell className="font-bold tabular-nums">{x.l}</TableCell>
                    <TableCell>{x.r}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{x.v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="XP multipliers" desc="Boost events · campaigns · weekends" right={<Button size="sm" variant="outline"><Plus className="mr-1.5 h-3.5 w-3.5" />Add boost</Button>} />
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {[
              { n: "Weekend Boost", m: "x1.5", s: "Sat–Sun" },
              { n: "Quarter-end Sprint", m: "x2.0", s: "Last 7 days" },
              { n: "New Reseller", m: "x3.0", s: "First 30 days" },
              { n: "Festival Event", m: "x2.5", s: "Diwali week" },
            ].map((b) => (
              <div key={b.n} className="rounded-xl border border-border/60 p-3 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <Flame className="h-4 w-4 text-rose-500" />
                  <Switch defaultChecked />
                </div>
                <div className="mt-2 text-sm font-semibold">{b.n}</div>
                <div className="text-[11px] text-muted-foreground">{b.s}</div>
                <div className="mt-1 text-lg font-bold tabular-nums">{b.m}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrophiesBadgesTab() {
  const badges = [
    "Achievement", "Revenue", "Support", "Developer", "Customer", "Training", "Leadership",
  ];
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Trophy management" desc="Lifetime milestones across the Nexus" />
          <div className="mt-3 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
            {TROPHIES.map((t) => (
              <TrophyCard key={t.name} name={t.name} Icon={t.icon} holders={t.holders} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Badge categories" />
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b} variant="outline" className="text-xs">
                <Medal className="mr-1 h-3 w-3" /> {b} Badges
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Trophy Room · 3D gallery" desc="Glass showcase · animated rotation · timeline" />
          <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-300/20 via-rose-400/10 to-violet-500/20 grid place-items-center hover:scale-105 transition-transform"
              >
                <Trophy className="h-7 w-7 text-amber-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Badge designer" desc="Pick shape · color · icon" right={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />Save badge</Button>} />
            <div className="mt-3 grid grid-cols-6 gap-2">
              {[Trophy, Medal, Crown, Star, Award, Sparkles, Flame, Zap, Heart, Rocket, ShieldCheck, Target].map((I, i) => (
                <button key={i} className="aspect-square rounded-xl border border-border/60 grid place-items-center hover:bg-accent hover:border-primary transition-colors">
                  <I className="h-5 w-5 text-primary" />
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981", "#f43f5e", "#3b82f6"].map((c) => (
                <span key={c} className="h-7 w-7 rounded-full ring-2 ring-border" style={{ background: c }} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Trophy timeline" desc="Lifetime journey · most recent first" />
            <div className="mt-3 relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-border">
              {[
                { d: "Jun 2026", w: "Global Champion induction", I: Globe },
                { d: "May 2026", w: "Top Reseller · APAC", I: Crown },
                { d: "Mar 2026", w: "Legend rank achieved", I: Star },
                { d: "Jan 2026", w: "Renewal Master ×100", I: Award },
                { d: "Nov 2025", w: "First Million revenue", I: TrendingUp },
              ].map((t, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-5 top-1.5 grid h-3 w-3 place-items-center rounded-full bg-primary ring-2 ring-background" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <t.I className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">{t.w}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{t.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Rarity tiers" desc="Drop rates and supply caps" />
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            {[
              { n: "Common", c: "text-slate-400", pct: "62%" },
              { n: "Uncommon", c: "text-emerald-500", pct: "24%" },
              { n: "Rare", c: "text-sky-500", pct: "9%" },
              { n: "Epic", c: "text-violet-500", pct: "4%" },
              { n: "Legendary", c: "text-amber-500", pct: "1%" },
            ].map((t) => (
              <div key={t.n} className="rounded-xl border border-border/60 p-3 text-center">
                <Trophy className={`mx-auto h-6 w-6 ${t.c}`} />
                <div className="mt-1 text-sm font-semibold">{t.n}</div>
                <div className="text-[11px] text-muted-foreground">{t.pct}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RewardsTab() {
  const types = [
    { label: "Points",          icon: Coins },
    { label: "Wallet credit",   icon: Coins },
    { label: "Commission bonus",icon: TrendingUp },
    { label: "Discount coupon", icon: Gift },
    { label: "Premium access",  icon: Crown },
    { label: "Feature unlock",  icon: Lock },
    { label: "Priority leads",  icon: Target },
    { label: "Special perms",   icon: ShieldCheck },
  ];
  const store = [
    { name: "Champion Frame",   cost: "12,000 pts", icon: Crown },
    { name: "Diamond Frame",    cost: "8,000 pts",  icon: Sparkles },
    { name: "Legend Frame",     cost: "5,000 pts",  icon: Star },
    { name: "Country Frame",    cost: "2,000 pts",  icon: Globe },
    { name: "Animated Effect",  cost: "3,500 pts",  icon: Zap },
    { name: "Theme Pack — Noir",cost: "4,200 pts",  icon: Palette },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {types.map((t) => {
          const I = t.icon;
          return (
            <Card key={t.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <I className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.label}</div>
                  <div className="text-[11px] text-muted-foreground">Reward type</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardContent className="p-4">
          <SectionHeader
            title="Reward Store"
            desc="Redeem XP and points · unlock frames, themes and effects"
            right={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />Add item</Button>}
          />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {store.map((s) => {
              const I = s.icon;
              return (
                <div key={s.name} className="rounded-xl border border-border/60 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-amber-300/30 to-rose-400/30">
                      <I className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.cost}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Redeem</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <SectionHeader title="Redemption history" right={<Button size="sm" variant="outline"><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>} />
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { t: "2m ago", u: "Aarav Mehta",    i: "Champion Frame", c: "12,000 pts", s: "Delivered" },
                  { t: "14m ago",u: "Sofia Rossi",     i: "Wallet $50",     c: "9,500 pts",  s: "Delivered" },
                  { t: "31m ago",u: "Wei Zhang",       i: "Theme — Noir",   c: "4,200 pts",  s: "Delivered" },
                  { t: "1h ago", u: "Chloé Laurent",   i: "Animated Effect",c: "3,500 pts",  s: "Pending" },
                  { t: "2h ago", u: "Omar Haddad",     i: "Premium 30d",    c: "20,000 pts", s: "Delivered" },
                ].map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground">{r.t}</TableCell>
                    <TableCell className="font-medium">{r.u}</TableCell>
                    <TableCell>{r.i}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.c}</TableCell>
                    <TableCell><Badge variant={r.s === "Delivered" ? "default" : "outline"}>{r.s}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Wallet" desc="Player credit balance & payouts" />
            <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-4 text-primary-foreground">
              <div className="text-xs opacity-80">Total balance</div>
              <div className="text-3xl font-bold tabular-nums">$48,210</div>
              <div className="mt-1 text-[11px] opacity-80">across 18,402 wallets</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-border/60 p-2">
                <div className="text-[11px] text-muted-foreground">Pending</div>
                <div className="text-base font-bold">$2,140</div>
              </div>
              <div className="rounded-lg border border-border/60 p-2">
                <div className="text-[11px] text-muted-foreground">Paid 30d</div>
                <div className="text-base font-bold">$18.9K</div>
              </div>
            </div>
            <Button size="sm" className="mt-3 w-full"><Coins className="mr-1.5 h-3.5 w-3.5" />Process payouts</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LeaderboardTab() {
  const scopes = ["Global", "Country", "State", "City", "Territory", "Department", "Role"];
  return (
    <div className="space-y-4">
      <FilterBar
        chips={scopes}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead className="text-right">XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEADERBOARD.map((p) => (
                  <TableRow key={p.rank}>
                    <TableCell className="font-bold tabular-nums">
                      {p.rank <= 3 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950">
                          {p.rank}
                        </span>
                      ) : p.rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px]">
                            {p.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{p.role}</Badge></TableCell>
                    <TableCell><CountryFlag code={p.country} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        <Crown className="mr-1 h-3 w-3" /> {p.rankName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {p.xp.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Global leaderboard map" desc="Top countries · interactive" />
            <div className="mt-3 aspect-square rounded-xl border border-border/60 bg-gradient-to-br from-sky-400/10 via-violet-500/10 to-rose-500/10 grid place-items-center">
              <Map className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {[
                { c: "India",   v: "2.84M XP" },
                { c: "USA",     v: "2.41M XP" },
                { c: "Germany", v: "1.92M XP" },
                { c: "Japan",   v: "1.78M XP" },
                { c: "Brazil",  v: "1.42M XP" },
              ].map((r) => (
                <div key={r.c} className="flex items-center justify-between">
                  <span>{r.c}</span>
                  <span className="tabular-nums font-medium">{r.v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChallengesTab() {
  const challenges = [
    { period: "Daily",     name: "Login & complete 1 sale", xp: 200,  joined: 4_120 },
    { period: "Daily",     name: "Resolve 5 support tickets", xp: 350, joined: 612 },
    { period: "Weekly",    name: "Close $25K in revenue",   xp: 5_000, joined: 1_842 },
    { period: "Weekly",    name: "Onboard 10 customers",    xp: 3_500, joined: 920 },
    { period: "Monthly",   name: "$100K revenue mission",   xp: 25_000, joined: 410 },
    { period: "Quarterly", name: "Territory growth +20%",   xp: 80_000, joined: 142 },
    { period: "Yearly",    name: "Become Global Champion",  xp: 1_000_000, joined: 18 },
  ];
  const missions = [
    { name: "Sales Mission",       progress: 72, icon: Coins },
    { name: "Revenue Mission",     progress: 48, icon: TrendingUp },
    { name: "Training Mission",    progress: 91, icon: BookOpen },
    { name: "Support Mission",     progress: 64, icon: ShieldCheck },
    { name: "Development Mission", progress: 33, icon: Rocket },
    { name: "Growth Mission",      progress: 56, icon: Flame },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <SectionHeader
            title="Challenge Center"
            desc="Daily · weekly · monthly · quarterly · yearly"
            right={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />New challenge</Button>}
          />
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead className="text-right">Reward XP</TableHead>
                <TableHead className="text-right">Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((c) => (
                <TableRow key={c.name}>
                  <TableCell><Badge variant="outline">{c.period}</Badge></TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.xp.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.joined.toLocaleString()}</TableCell>
                  <TableCell><Button size="sm" variant="ghost"><ChevronRight className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Mission Center" />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {missions.map((m) => {
              const I = m.icon;
              return (
                <div key={m.name} className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <I className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{m.name}</span>
                    </div>
                    <span className="text-xs tabular-nums">{m.progress}%</span>
                  </div>
                  <Progress value={m.progress} className="mt-2 h-1.5" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CertificatesHallTab() {
  const certs = [
    "Training Certificate", "Developer Certificate", "Vendor Certificate",
    "Reseller Certificate", "Franchise Certificate", "Champion Certificate",
  ];
  const hall = [
    { name: "Top Developers", who: "Wei Zhang",     metric: "488K dev XP" },
    { name: "Top Vendors",    who: "Sofia Rossi",   metric: "$1.2M GMV"   },
    { name: "Top Resellers",  who: "Aarav Mehta",   metric: "$2.8M ARR"   },
    { name: "Top Franchises", who: "Liam O'Brien",  metric: "+42 outlets" },
    { name: "Top Customers",  who: "Acme Corp",     metric: "$680K spend" },
    { name: "Top Territory",  who: "Mumbai West",   metric: "+38% YoY"    },
    { name: "Top Revenue",    who: "EMEA Region",   metric: "$14.2M"      },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <SectionHeader
            title="Certificate management"
            right={<Button size="sm"><FileSignature className="mr-1.5 h-3.5 w-3.5" />Issue certificate</Button>}
          />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {certs.map((c) => (
              <div key={c} className="rounded-xl border border-border/60 p-4 flex items-center gap-3 bg-gradient-to-br from-amber-50/40 to-transparent dark:from-amber-500/5">
                <FileSignature className="h-6 w-6 text-amber-500" />
                <div>
                  <div className="text-sm font-semibold">{c}</div>
                  <div className="text-[11px] text-muted-foreground">Signed · verifiable</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Hall of Fame" desc="Recognition · employee, dev, reseller, vendor, franchise, customer of the month" />
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Highlight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hall.map((h) => (
                <TableRow key={h.name}>
                  <TableCell><Badge variant="secondary">{h.name}</Badge></TableCell>
                  <TableCell className="font-medium">{h.who}</TableCell>
                  <TableCell className="text-muted-foreground">{h.metric}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function EngineTab() {
  const role = [
    { role: "Developer", items: ["Code quality", "Features delivered", "Bugs fixed"] },
    { role: "Reseller",  items: ["Revenue", "Sales", "Renewals"] },
    { role: "Vendor",    items: ["Products", "Revenue", "Ratings"] },
    { role: "Franchise", items: ["Territory growth", "Revenue", "Network growth"] },
    { role: "Customer",  items: ["Purchases", "Referrals", "Reviews"] },
    { role: "Support",   items: ["Resolution time", "CSAT", "First-touch rate"] },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Celebration Engine" desc="Unlock · level up · rank up · champion" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                "Achievement Unlock", "Level Up", "Rank Up",
                "Revenue Milestone", "Champion Status", "Global Champion",
              ].map((c) => (
                <div key={c} className="rounded-lg border border-border/60 p-3 flex items-center justify-between">
                  <span className="text-sm">{c}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SectionHeader title="Animation & Sound" />
            <div className="space-y-2">
              {[
                { label: "Trophy animation",     icon: Trophy,    on: true },
                { label: "Badge animation",      icon: Medal,     on: true },
                { label: "Rank animation",       icon: Crown,     on: true },
                { label: "XP gain animation",    icon: Zap,       on: true },
                { label: "Reward animation",     icon: Gift,      on: true },
                { label: "Celebration animation",icon: Sparkles,  on: true },
              ].map((a) => {
                const I = a.icon;
                return (
                  <div key={a.label} className="flex items-center justify-between rounded-lg border border-border/60 p-2.5">
                    <div className="flex items-center gap-2">
                      <I className="h-4 w-4 text-primary" />
                      <span className="text-sm">{a.label}</span>
                    </div>
                    <Switch defaultChecked={a.on} />
                  </div>
                );
              })}
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-2.5 bg-muted/40">
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sounds (off by default)</span>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <SectionHeader title="Role reward rules" desc="What earns XP per role" />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {role.map((r) => (
              <div key={r.role} className="rounded-xl border border-border/60 p-3">
                <div className="text-sm font-semibold">{r.role}</div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {r.items.map((i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <SectionHeader
            title="AI Achievement Engine"
            desc="Suggest · detect · predict · recommend · generate"
            right={<Button size="sm" variant="outline"><Bot className="mr-1.5 h-3.5 w-3.5" />Run engine</Button>}
          />
          <div className="mt-3 grid gap-2 md:grid-cols-5">
            {[
              "Suggest achievements", "Detect milestones", "Predict champions",
              "Recommend rewards", "Generate challenges",
            ].map((s) => (
              <div key={s} className="rounded-lg border border-border/60 p-3 text-xs flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> {s}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditTab() {
  const rows = [
    { ts: "2026-06-07 14:22", who: "Aarav Mehta",     what: "Unlocked Revenue Rocket",       reward: "+5000 XP, $50 wallet", status: "Issued" },
    { ts: "2026-06-07 14:18", who: "Wei Zhang",       what: "Earned Top Developer trophy",   reward: "Trophy + frame",       status: "Issued" },
    { ts: "2026-06-07 14:05", who: "Sofia Rossi",     what: "Ranked up to Champion",         reward: "Rank upgrade",         status: "Issued" },
    { ts: "2026-06-07 13:48", who: "Chloé Laurent",   what: "Earned Renewal Master badge",   reward: "+2000 XP",             status: "Issued" },
    { ts: "2026-06-07 13:31", who: "Omar Haddad",     what: "Redeemed Diamond Frame",        reward: "-8000 pts",            status: "Redeemed" },
    { ts: "2026-06-07 13:10", who: "Isabella García", what: "Issued Champion Certificate",   reward: "Certificate",          status: "Issued" },
  ];
  return (
    <div className="space-y-4">
      <FilterBar
        chips={["All", "Issued", "Redeemed", "Reverted", "AI-suggested"]}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Who</TableHead>
                <TableHead>What</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.ts}</TableCell>
                  <TableCell className="font-medium">{r.who}</TableCell>
                  <TableCell>{r.what}</TableCell>
                  <TableCell className="text-muted-foreground">{r.reward}</TableCell>
                  <TableCell><Badge variant={r.status === "Issued" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Main ---------- */
export function AchievementsConsole() {
  return (
    <div className="space-y-4">
      <Hero />
      <Tabs defaultValue="command" className="space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex">
            <TabsTrigger value="command"><Gamepad2 className="mr-1.5 h-3.5 w-3.5" />Command</TabsTrigger>
            <TabsTrigger value="library"><Layers className="mr-1.5 h-3.5 w-3.5" />Library</TabsTrigger>
            <TabsTrigger value="xp"><Zap className="mr-1.5 h-3.5 w-3.5" />XP & Levels</TabsTrigger>
            <TabsTrigger value="trophies"><Trophy className="mr-1.5 h-3.5 w-3.5" />Trophies & Badges</TabsTrigger>
            <TabsTrigger value="rewards"><Gift className="mr-1.5 h-3.5 w-3.5" />Rewards & Store</TabsTrigger>
            <TabsTrigger value="leaderboard"><BarChart3 className="mr-1.5 h-3.5 w-3.5" />Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges"><Target className="mr-1.5 h-3.5 w-3.5" />Challenges & Missions</TabsTrigger>
            <TabsTrigger value="hall"><Crown className="mr-1.5 h-3.5 w-3.5" />Certificates & Hall</TabsTrigger>
            <TabsTrigger value="engine"><Bot className="mr-1.5 h-3.5 w-3.5" />Engine & AI</TabsTrigger>
            <TabsTrigger value="audit"><History className="mr-1.5 h-3.5 w-3.5" />Audit</TabsTrigger>
          </TabsList>
        </ScrollArea>
        <TabsContent value="command"><CommandTab /></TabsContent>
        <TabsContent value="library"><LibraryTab /></TabsContent>
        <TabsContent value="xp"><XPLevelsTab /></TabsContent>
        <TabsContent value="trophies"><TrophiesBadgesTab /></TabsContent>
        <TabsContent value="rewards"><RewardsTab /></TabsContent>
        <TabsContent value="leaderboard"><LeaderboardTab /></TabsContent>
        <TabsContent value="challenges"><ChallengesTab /></TabsContent>
        <TabsContent value="hall"><CertificatesHallTab /></TabsContent>
        <TabsContent value="engine"><EngineTab /></TabsContent>
        <TabsContent value="audit"><AuditTab /></TabsContent>
      </Tabs>
    </div>
  );
}