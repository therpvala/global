import {
  Building2,
  MapPin,
  TrendingUp,
  Star,
  ChevronRight,
  Plus,
  Search,
  Award,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  KpiStrip,
  MiniBarChart,
  SectionHeader,
  Sparkline,
  ActivityFeed,
  type Kpi,
  type ActivityItem,
} from "../enterprise";

const kpis: Kpi[] = [
  { label: "Active franchises", value: "142", delta: "+5", tone: "up", spark: [4, 5, 6, 7, 7, 8, 9], hint: "across 28 countries" },
  { label: "Network revenue (MTD)", value: "$2.41M", delta: "+12.4%", tone: "up", spark: [3, 4, 5, 6, 7, 8, 9] },
  { label: "Avg. royalty", value: "$18.2K", delta: "+3.1%", tone: "up", spark: [4, 4, 5, 5, 6, 7, 7] },
  { label: "Compliance at risk", value: "6", delta: "+2", tone: "down", spark: [2, 2, 3, 3, 4, 4, 5], hint: "renewals or audits" },
];

const branches = [
  { name: "Bengaluru — Indiranagar", region: "APAC · India", revenue: "$184K", target: 84, score: 92, status: "leader" },
  { name: "Singapore — Orchard", region: "APAC · SG", revenue: "$162K", target: 78, score: 88, status: "leader" },
  { name: "Dubai — Marina", region: "MENA · UAE", revenue: "$148K", target: 71, score: 84, status: "ok" },
  { name: "London — Soho", region: "EMEA · UK", revenue: "$142K", target: 68, score: 81, status: "ok" },
  { name: "Toronto — Yonge", region: "NA · CA", revenue: "$118K", target: 56, score: 74, status: "watch" },
  { name: "Mexico City — Roma", region: "LATAM · MX", revenue: "$92K", target: 42, score: 64, status: "underperforming" },
];

const statusTone: Record<string, string> = {
  leader: "border-success/40 text-success bg-success/10",
  ok: "border-primary/30 text-primary bg-primary/10",
  watch: "border-warning/40 text-warning bg-warning/10",
  underperforming: "border-destructive/40 text-destructive bg-destructive/10",
};

const activity: ActivityItem[] = [
  { who: "Bengaluru", what: "hit", target: "monthly target 110%", when: "1h", kind: "approve" },
  { who: "Compliance bot", what: "flagged audit overdue at", target: "London — Soho", when: "3h", kind: "reject" },
  { who: "Operations", what: "onboarded new franchisee", target: "Lagos — Lekki", when: "Yesterday", kind: "create" },
  { who: "Finance", what: "released royalties for", target: "Q1 payouts", when: "2d", kind: "update" },
];

export function FranchisesDashboard() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div
          className="px-5 py-5 text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  <Building2 className="mr-1 h-3 w-3" />
                  Franchise network
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  <MapPin className="mr-1 h-3 w-3" />
                  28 countries
                </Badge>
              </div>
              <h1 className="mt-1.5 text-2xl font-bold">Franchise Operations</h1>
              <p className="text-sm opacity-90">
                Multi-branch performance, royalty pipelines, compliance, and growth — one console.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-96">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <Input
                  placeholder="Search franchisees, regions, owners…"
                  className="h-10 pl-9 bg-white/15 border-white/20 placeholder:text-white/70 text-white"
                />
              </div>
              <Button size="sm" variant="secondary">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Franchise
              </Button>
            </div>
          </div>
        </div>
      </div>

      <KpiStrip kpis={kpis} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Branch leaderboard */}
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader
              title="Branch leaderboard"
              desc="Target attainment & operational score"
              right={
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View all
                  <ChevronRight className="ml-0.5 h-3 w-3" />
                </Button>
              }
            />
            <div className="mt-3 space-y-2">
              {branches.map((b, i) => (
                <div
                  key={b.name}
                  className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5 hover:border-primary/40 transition"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[11px] font-bold text-accent-foreground">
                    #{i + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-primary/15 text-primary">
                      {b.name
                        .replace(/—.*/, "")
                        .trim()
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium truncate">{b.name}</div>
                      <div className="text-sm font-semibold tabular-nums">{b.revenue}</div>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                      <span>{b.region}</span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning" />
                        Score {b.score}
                      </span>
                    </div>
                    <Progress
                      value={b.target}
                      className={`mt-1.5 h-1.5 ${
                        b.status === "underperforming"
                          ? "[&>div]:bg-destructive"
                          : b.status === "watch"
                            ? "[&>div]:bg-warning"
                            : ""
                      }`}
                    />
                  </div>
                  <Badge variant="outline" className={`capitalize font-normal ${statusTone[b.status]}`}>
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Royalty & compliance */}
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader title="Royalty pipeline" desc="Next 30 days" />
              <div className="mt-3 space-y-2.5">
                {[
                  { label: "Invoiced", value: "$184K", tone: "text-foreground" },
                  { label: "Collected", value: "$142K", tone: "text-success" },
                  { label: "Overdue", value: "$24K", tone: "text-warning" },
                  { label: "Disputed", value: "$3.2K", tone: "text-destructive" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className={`tabular-nums font-semibold ${r.tone}`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Sparkline data={[5, 6, 7, 8, 9, 10, 12]} tone="up" width={240} height={36} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4">
              <SectionHeader
                title="Compliance"
                right={
                  <Badge variant="outline" className="border-warning/40 text-warning">
                    6 attention
                  </Badge>
                }
              />
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { t: "London — audit overdue", icon: AlertTriangle, tone: "text-destructive" },
                  { t: "Mexico City — license renewal in 12d", icon: Wallet, tone: "text-warning" },
                  { t: "Lagos — onboarding docs pending", icon: Award, tone: "text-warning" },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <li key={c.t} className="flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 ${c.tone}`} />
                      <span className="truncate">{c.t}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trend & activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardContent className="p-4">
            <SectionHeader
              title="Network revenue"
              desc="Rolling 7 days · all branches"
              right={
                <Badge variant="outline" className="font-normal">
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                  +12.4%
                </Badge>
              }
            />
            <div className="mt-3">
              <MiniBarChart
                data={[182, 196, 174, 224, 248, 268, 312]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              />
            </div>
          </CardContent>
        </Card>
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
