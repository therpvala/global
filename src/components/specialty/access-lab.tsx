/**
 * Access Lab — Role Simulator + Permission Audit consoles.
 * Inspiration: Okta Access Explorer + AWS IAM Policy Simulator + Datadog Audit Trail.
 */
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  BarChart3, Check, Download, FileText, FlaskConical, ScrollText, Search, ShieldAlert, ShieldCheck, Trash2, X,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { KpiStrip, SectionHeader, type Kpi } from "../enterprise";
import { PermButton } from "../permissions";
import { modules } from "@/lib/modules";
import type { AppRole } from "@/lib/auth";
import {
  PERM_ACTIONS, can, moduleKeyFromUrl, permissionId, type PermAction,
} from "@/lib/permissions";
import {
  clearPermEvents, downloadCsv, getPermEvents, getPermEventsServer, permEventsToCsv,
  recordPermEvent, subscribePermEvents, type PermEvent,
} from "@/lib/perm-audit";
import {
  SEVERITIES, TIME_RANGES, countByAction, countByModule, countByRole, countBySeverity,
  severityOf, severityToneClass, timelineSeries, withinRange, type PermSeverity, type TimeRange,
} from "@/lib/perm-severity";
import { printReportPdf } from "@/lib/perm-report";

export const ROLES: AppRole[] = ["super_admin", "admin", "manager", "accountant", "account_manager", "user"];

export const DIRECTORY: { email: string; name: string; roles: AppRole[] }[] = [
  { email: "admin@vala.app", name: "Ava Admin", roles: ["admin"] },
  { email: "root@vala.app", name: "Root Owner", roles: ["super_admin"] },
  { email: "nina@vala.app", name: "Nina Ops", roles: ["manager"] },
  { email: "omar@vala.app", name: "Omar Ledger", roles: ["accountant"] },
  { email: "lia@vala.app", name: "Lia Partner", roles: ["account_manager"] },
  { email: "sam@vala.app", name: "Sam Member", roles: ["user"] },
  { email: "dual@vala.app", name: "Dana Dual-hat", roles: ["accountant", "account_manager"] },
];

export function Hero({ icon: Icon, eyebrow, title, subtitle, right }: {
  icon: any; eyebrow: string; title: string; subtitle: string; right?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden">
      <div className="px-5 py-5 text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="secondary" className="font-normal"><Icon className="mr-1 h-3 w-3" />{eyebrow}</Badge>
            <h1 className="mt-1.5 text-2xl font-bold">{title}</h1>
            <p className="text-sm opacity-90 max-w-2xl">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">{right}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================ Role simulator ============================ */

export function RoleSimulatorConsole() {
  const [subject, setSubject] = useState<string>("nina@vala.app");
  const [customRoles, setCustomRoles] = useState<AppRole[]>([]);
  const [query, setQuery] = useState("");
  const [probe, setProbe] = useState("crm.edit");
  const [onlyDenied, setOnlyDenied] = useState(false);

  const person = DIRECTORY.find((d) => d.email === subject);
  const roles: AppRole[] = customRoles.length ? customRoles : (person?.roles ?? ["user"]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules
      .filter((m) => !q || m.title.toLowerCase().includes(q) || m.url.toLowerCase().includes(q) || m.group.toLowerCase().includes(q))
      .map((m) => {
        const key = moduleKeyFromUrl(m.url);
        const grid = PERM_ACTIONS.map((a) => ({ action: a, allowed: can(roles, permissionId(key, a)) }));
        return { module: m, key, grid, allowedCount: grid.filter((g) => g.allowed).length };
      })
      .filter((r) => (onlyDenied ? r.allowedCount < PERM_ACTIONS.length : true));
  }, [roles, query, onlyDenied]);

  const totals = useMemo(() => {
    let allowed = 0;
    let denied = 0;
    let visible = 0;
    for (const m of modules) {
      const key = moduleKeyFromUrl(m.url);
      for (const a of PERM_ACTIONS) (can(roles, permissionId(key, a)) ? allowed++ : denied++);
      if (can(roles, permissionId(key, "view"))) visible++;
    }
    return { allowed, denied, visible };
  }, [roles]);

  const kpis: Kpi[] = [
    { label: "Effective grants", value: String(totals.allowed), delta: `${modules.length * PERM_ACTIONS.length} checks`, tone: "up", spark: [4, 6, 5, 8, 9, 11, 12] },
    { label: "Denied checks", value: String(totals.denied), delta: "policy enforced", tone: "down", spark: [12, 10, 9, 8, 6, 5, 4] },
    { label: "Visible modules", value: `${totals.visible}/${modules.length}`, delta: "sidebar scope", tone: "up", spark: [3, 5, 6, 7, 7, 8, 9] },
    { label: "Active roles", value: String(roles.length), delta: roles.join(" + "), tone: "up", spark: [1, 1, 2, 2, 2, 2, 2] },
  ];

  const probeResult = can(roles, probe.trim() || "*.view");

  const toggleRole = (r: AppRole) =>
    setCustomRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const runProbe = () => {
    const perm = probe.trim();
    if (!perm) return;
    recordPermEvent({
      actor: `simulator:${subject}`,
      roles,
      permission: perm,
      decision: can(roles, perm) ? "granted" : "denied",
      source: "simulator",
      detail: `Simulated as ${roles.join(" + ")}`,
    });
    toast[can(roles, perm) ? "success" : "error"](
      can(roles, perm) ? "Allowed" : "Denied",
      { description: `${perm} for ${roles.join(" + ")}` },
    );
  };

  const exportMatrix = () => {
    const head = ["module", "key", "group", ...PERM_ACTIONS].join(",");
    const body = rows.map((r) =>
      [r.module.title, r.key, r.module.group, ...r.grid.map((g) => (g.allowed ? "allow" : "deny"))]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
    );
    downloadCsv(`role-simulation-${roles.join("-")}.csv`, [head, ...body].join("\n"));
    toast.success("Simulation exported", { description: `${rows.length} modules` });
  };

  const exportPdf = () => {
    printReportPdf({
      title: "Effective Access Report",
      subtitle: `Simulated identity: ${person ? `${person.name} (${person.email})` : subject}`,
      meta: [
        { label: "Roles evaluated", value: roles.join(" + ") },
        { label: "Modules", value: String(rows.length) },
        { label: "Actions", value: PERM_ACTIONS.join(", ") },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
      summary: [
        { label: "Effective grants", value: String(totals.allowed) },
        { label: "Denied checks", value: String(totals.denied) },
        { label: "Visible modules", value: `${totals.visible}/${modules.length}` },
        { label: "Coverage", value: `${Math.round((totals.allowed / (modules.length * PERM_ACTIONS.length)) * 100)}%` },
      ],
      tables: [
        {
          title: "Module × action matrix",
          note: "allow = permission granted by the effective role set; deny = blocked by policy.",
          head: ["Module", "Key", "Group", ...PERM_ACTIONS.map((a) => a[0].toUpperCase() + a.slice(1))],
          rows: rows.map((r) => [
            r.module.title, r.key, r.module.group, ...r.grid.map((g) => (g.allowed ? "allow" : "deny")),
          ]),
        },
      ],
    });
    toast.success("Report ready", { description: "Choose “Save as PDF” in the print dialog." });
  };

  return (
    <div className="space-y-4">
      <Hero
        icon={FlaskConical}
        eyebrow="Access Lab"
        title="Role Simulator"
        subtitle="Pick a user or compose a role set and see exactly which module actions resolve to allow or deny across the entire app."
        right={
          <>
            <Button size="sm" variant="secondary" onClick={exportMatrix}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
            </Button>
            <PermButton permission="role-simulator.export" size="sm" variant="secondary" onClick={exportPdf}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />Export PDF report
            </PermButton>
          </>
        }
      />

      <Card>
        <CardContent className="p-4 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Subject</Label>
              <Select value={subject} onValueChange={(v) => { setSubject(v); setCustomRoles([]); }}>
                <SelectTrigger className="h-9">
                  <SelectValue>{person ? `${person.name} · ${person.email}` : "Select subject"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DIRECTORY.map((d) => (
                    <SelectItem key={d.email} value={d.email}>{d.name} · {d.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Directory roles: {(person?.roles ?? []).join(", ") || "—"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Override role set</Label>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => (
                  <Badge
                    key={r}
                    onClick={() => toggleRole(r)}
                    variant={customRoles.includes(r) ? "default" : "outline"}
                    className="cursor-pointer font-normal"
                  >
                    {r}
                  </Badge>
                ))}
              </div>
              {customRoles.length > 0 && (
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setCustomRoles([])}>
                  Reset to directory roles
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <KpiStrip kpis={kpis} />
            <div className="rounded-xl border border-border/60 p-3 space-y-2">
              <Label className="text-xs">Probe a permission (module.action, wildcards allowed)</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input value={probe} onChange={(e) => setProbe(e.target.value)} placeholder="crm.edit" className="h-9 max-w-[240px]" />
                <Button size="sm" onClick={runProbe}>Evaluate</Button>
                <Badge
                  variant="outline"
                  className={probeResult
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-destructive/40 bg-destructive/10 text-destructive"}
                >
                  {probeResult ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                  {probeResult ? "ALLOW" : "DENY"}
                </Badge>
                <span className="text-xs text-muted-foreground">evaluated as {roles.join(" + ")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SectionHeader
        title="Effective access matrix"
        desc="Every registered module × action for the simulated identity."
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter modules…" className="h-8 w-52 pl-8" />
            </div>
            <Button size="sm" variant={onlyDenied ? "default" : "outline"} className="h-8 text-xs" onClick={() => setOnlyDenied((v) => !v)}>
              Only with denials
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Module</TableHead>
                <TableHead>Group</TableHead>
                {PERM_ACTIONS.map((a) => <TableHead key={a} className="text-center capitalize">{a}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.module.url}>
                  <TableCell className="font-medium">
                    {r.module.title}
                    <div className="text-[11px] text-muted-foreground">{r.module.url}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.module.group}</TableCell>
                  {r.grid.map((g) => (
                    <TableCell key={g.action} className="text-center">
                      {g.allowed ? (
                        <Check className="mx-auto h-4 w-4 text-success" aria-label={`${g.action} allowed`} />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-destructive/60" aria-label={`${g.action} denied`} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={2 + PERM_ACTIONS.length} className="py-10 text-center text-sm text-muted-foreground">No modules match this filter.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ========================== Permission audit log ========================= */

export function PermissionAuditConsole() {
  const events = useSyncExternalStore(subscribePermEvents, getPermEvents, getPermEventsServer);
  const [decision, setDecision] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [role, setRole] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const [range, setRange] = useState<TimeRange>("7d");
  const [q, setQ] = useState("");

  const inRange = useMemo(() => events.filter((e) => withinRange(e.ts, range)), [events, range]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return inRange.filter((e) =>
      (decision === "all" || e.decision === decision) &&
      (source === "all" || e.source === source) &&
      (role === "all" || e.roles.includes(role as AppRole)) &&
      (severity === "all" || severityOf(e) === severity) &&
      (!needle ||
        e.actor.toLowerCase().includes(needle) ||
        e.permission.toLowerCase().includes(needle) ||
        (e.detail ?? "").toLowerCase().includes(needle)),
    );
  }, [inRange, decision, source, role, severity, q]);

  const byModule = useMemo(() => countByModule(filtered).slice(0, 10), [filtered]);
  const byRole = useMemo(() => countByRole(filtered), [filtered]);
  const byAction = useMemo(() => countByAction(filtered), [filtered]);
  const bySeverity = useMemo(() => countBySeverity(filtered), [filtered]);
  const timeline = useMemo(() => timelineSeries(filtered, range), [filtered, range]);

  const denied = filtered.filter((e) => e.decision === "denied").length;
  const critical = filtered.filter((e) => severityOf(e) === "critical").length;
  const kpis: Kpi[] = [
    { label: "Events in range", value: String(filtered.length), delta: TIME_RANGES.find((t) => t.value === range)?.label ?? "", tone: "up", spark: timeline.slice(-7).map((t) => t.total || 0) },
    { label: "Denied", value: String(denied), delta: "blocked attempts", tone: "down", spark: timeline.slice(-7).map((t) => t.denied || 0) },
    { label: "Granted", value: String(filtered.length - denied), delta: "authorized actions", tone: "up", spark: timeline.slice(-7).map((t) => t.granted || 0) },
    { label: "Critical severity", value: String(critical), delta: "high blast radius", tone: critical ? "down" : "up", spark: [1, 2, 1, 3, 2, 4, critical] },
  ];

  const exportCsv = () => {
    const csv = permEventsToCsv(filtered)
      .split("\n")
      .map((line, i) => (i === 0 ? `${line},severity` : line))
      .join("\n");
    const withSeverity = csv
      .split("\n")
      .map((line, i) => (i === 0 ? line : `${line},"${severityOf(filtered[i - 1])}"`))
      .join("\n");
    downloadCsv(`permission-audit-${new Date().toISOString().slice(0, 10)}.csv`, withSeverity);
    toast.success("Audit log exported", { description: `${filtered.length} events` });
  };

  const exportPdf = () => {
    printReportPdf({
      title: "Permission Audit Report",
      subtitle: "Allow / deny decisions captured by page gates, console actions and simulator probes.",
      meta: [
        { label: "Time range", value: TIME_RANGES.find((t) => t.value === range)?.label ?? range },
        { label: "Filters", value: [decision, source, role, severity].map((v) => v || "all").join(" / ") },
        { label: "Events", value: String(filtered.length) },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
      summary: [
        { label: "Total", value: String(filtered.length) },
        { label: "Denied", value: String(denied) },
        { label: "Granted", value: String(filtered.length - denied) },
        { label: "Critical", value: String(critical) },
      ],
      tables: [
        {
          title: "Severity breakdown",
          head: ["Severity", "Granted", "Denied", "Total"],
          rows: bySeverity.map((r) => [r.key, r.granted, r.denied, r.total]),
        },
        {
          title: "Top modules",
          head: ["Module", "Granted", "Denied", "Total"],
          rows: byModule.map((r) => [r.key, r.granted, r.denied, r.total]),
        },
        {
          title: "By role",
          head: ["Role", "Granted", "Denied", "Total"],
          rows: byRole.map((r) => [r.key, r.granted, r.denied, r.total]),
        },
        {
          title: "By action",
          head: ["Action", "Granted", "Denied", "Total"],
          rows: byAction.map((r) => [r.key, r.granted, r.denied, r.total]),
        },
        {
          title: "Event trail",
          head: ["Time", "Actor", "Roles", "Permission", "Severity", "Source", "Decision", "Detail"],
          rows: filtered.slice(0, 400).map((e) => [
            new Date(e.ts).toLocaleString(), e.actor, e.roles.join(" "), e.permission,
            severityOf(e), e.source, e.decision, e.detail ?? "—",
          ]),
          note: filtered.length > 400 ? "Showing the 400 most recent events." : undefined,
        },
      ],
    });
    toast.success("Report ready", { description: "Choose “Save as PDF” in the print dialog." });
  };

  return (
    <div className="space-y-4">
      <Hero
        icon={ScrollText}
        eyebrow="Access Lab"
        title="Permission Audit Log"
        subtitle="Every permission-granted and permission-denied decision raised by page gates, console actions and simulator probes."
        right={
          <>
            <PermButton permission="permission-audit.export" size="sm" variant="secondary" onClick={exportCsv}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
            </PermButton>
            <PermButton permission="permission-audit.export" size="sm" variant="secondary" onClick={exportPdf}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />Export PDF report
            </PermButton>
            <PermButton
              permission="permission-audit.delete"
              size="sm"
              variant="secondary"
              onClick={() => { clearPermEvents(); toast.success("Audit log cleared"); }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />Clear
            </PermButton>
          </>
        }
      />

      <KpiStrip kpis={kpis} />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, permission, detail…" className="h-9 pl-8" />
          </div>
          <Select value={decision} onValueChange={setDecision}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Decision" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All decisions</SelectItem>
              <SelectItem value="granted">Granted</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="page">Page gate</SelectItem>
              <SelectItem value="action">Console action</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
              <SelectItem value="simulator">Simulator</SelectItem>
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-9 w-[170px]"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v) => setRange(v as TimeRange)}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Time range" /></SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="h-8 px-3 font-normal">{filtered.length} events</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary"><BarChart3 className="mr-1.5 h-3.5 w-3.5" />Summary</TabsTrigger>
          <TabsTrigger value="all">Trail</TabsTrigger>
          <TabsTrigger value="denied">Denials</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-3 space-y-4">
          <SectionHeader title="Decision analytics" desc="Granted vs denied volume by module, role, action, severity and time." />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Decisions over time" desc={TIME_RANGES.find((t) => t.value === range)?.label}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="key" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={28} />
                <RTooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="granted" stroke="var(--success)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="denied" stroke="var(--destructive)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartCard>
            <ChartCard title="Severity mix" desc="Risk-weighted by action, module group and outcome">
              <BarChart data={bySeverity} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="key" tick={{ fontSize: 10, textTransform: "capitalize" }} width={70} />
                <RTooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={22}>
                  {bySeverity.map((s) => (
                    <Cell key={s.key} fill={SEVERITY_FILL[s.key as PermSeverity] ?? "var(--muted-foreground)"} />
                  ))}
                </Bar>
              </BarChart>
            </ChartCard>
            <ChartCard title="Top modules" desc="Highest decision volume">
              <BarChart data={byModule} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="key" tick={{ fontSize: 10 }} width={90} />
                <RTooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="granted" stackId="a" fill="var(--success)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="denied" stackId="a" fill="var(--destructive)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartCard>
            <ChartCard title="By role" desc="Which role sets trigger denials">
              <BarChart data={byRole}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="key" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={28} />
                <RTooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="granted" stackId="a" fill="var(--success)" />
                <Bar dataKey="denied" stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartCard>
            <ChartCard title="By action" desc="Action-level allow/deny distribution" className="lg:col-span-2">
              <BarChart data={byAction}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="key" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={28} />
                <RTooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="granted" stackId="a" fill="var(--success)" />
                <Bar dataKey="denied" stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartCard>
          </div>
        </TabsContent>
        <TabsContent value="all" className="mt-3">
          <EventTable rows={filtered} />
        </TabsContent>
        <TabsContent value="denied" className="mt-3">
          <EventTable rows={filtered.filter((e) => e.decision === "denied")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const TOOLTIP_STYLE = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 11,
  color: "var(--popover-foreground)",
} as const;

const SEVERITY_FILL: Record<PermSeverity, string> = {
  critical: "var(--destructive)",
  high: "var(--warning)",
  medium: "var(--primary)",
  low: "var(--muted-foreground)",
};

export function ChartCard({ title, desc, className, children }: {
  title: string; desc?: string; className?: string; children: React.ReactElement;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="text-sm font-semibold">{title}</div>
          {desc && <div className="text-[11px] text-muted-foreground">{desc}</div>}
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function EventTable({ rows }: { rows: PermEvent[] }) {
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Decision</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(e.ts).toLocaleString()}
                </TableCell>
                <TableCell className="text-sm font-medium">{e.actor}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.roles.join(", ") || "—"}</TableCell>
                <TableCell><code className="rounded bg-muted px-1 py-0.5 text-xs">{e.permission}</code></TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize font-normal ${severityToneClass[severityOf(e)]}`}>
                    {severityOf(e)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize text-muted-foreground">{e.source}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={e.decision === "granted"
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-destructive/40 bg-destructive/10 text-destructive"}
                  >
                    {e.decision === "granted"
                      ? <ShieldCheck className="mr-1 h-3 w-3" />
                      : <ShieldAlert className="mr-1 h-3 w-3" />}
                    {e.decision}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.detail ?? "—"}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No permission events match these filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export type { PermAction };