/**
 * Role Comparison — diff effective grants/denials between two roles or users.
 * Inspiration: Okta access diff + GitHub compare view.
 */
import { useMemo, useState } from "react";
import { ArrowRight, Check, Download, FileText, GitCompare, Minus, Plus, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { KpiStrip, SectionHeader, type Kpi } from "../enterprise";
import { PermButton } from "../permissions";
import { Hero, ROLES, DIRECTORY } from "./access-lab";
import { modules } from "@/lib/modules";
import type { AppRole } from "@/lib/auth";
import { PERM_ACTIONS, can, moduleKeyFromUrl, permissionId, type PermAction } from "@/lib/permissions";
import { downloadCsv } from "@/lib/perm-audit";
import { printReportPdf } from "@/lib/perm-report";

type SubjectKind = "role" | "user";

interface Subject {
  kind: SubjectKind;
  id: string;
  label: string;
  roles: AppRole[];
}

function resolveSubject(kind: SubjectKind, id: string): Subject {
  if (kind === "user") {
    const p = DIRECTORY.find((d) => d.email === id) ?? DIRECTORY[0];
    return { kind, id: p.email, label: `${p.name} · ${p.email}`, roles: p.roles };
  }
  const role = (ROLES.includes(id as AppRole) ? id : "user") as AppRole;
  return { kind, id: role, label: role, roles: [role] };
}

type DiffKind = "same-allow" | "same-deny" | "only-a" | "only-b";

interface DiffCell {
  action: PermAction;
  a: boolean;
  b: boolean;
  kind: DiffKind;
}

const KIND_LABEL: Record<DiffKind, string> = {
  "same-allow": "Both allow",
  "same-deny": "Both deny",
  "only-a": "Only A",
  "only-b": "Only B",
};

export function RoleComparisonConsole() {
  const [kindA, setKindA] = useState<SubjectKind>("role");
  const [idA, setIdA] = useState("manager");
  const [kindB, setKindB] = useState<SubjectKind>("role");
  const [idB, setIdB] = useState("accountant");
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(true);

  const a = resolveSubject(kindA, idA);
  const b = resolveSubject(kindB, idB);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules
      .filter((m) => !q || m.title.toLowerCase().includes(q) || m.url.toLowerCase().includes(q) || m.group.toLowerCase().includes(q))
      .map((m) => {
        const key = moduleKeyFromUrl(m.url);
        const cells: DiffCell[] = PERM_ACTIONS.map((action) => {
          const av = can(a.roles, permissionId(key, action));
          const bv = can(b.roles, permissionId(key, action));
          const kind: DiffKind = av && bv ? "same-allow" : !av && !bv ? "same-deny" : av ? "only-a" : "only-b";
          return { action, a: av, b: bv, kind };
        });
        const changed = cells.filter((c) => c.kind === "only-a" || c.kind === "only-b").length;
        return { module: m, key, cells, changed };
      })
      .filter((r) => (onlyChanged ? r.changed > 0 : true));
  }, [a.roles, b.roles, query, onlyChanged]);

  const totals = useMemo(() => {
    let onlyA = 0, onlyB = 0, bothAllow = 0, bothDeny = 0, modulesChanged = 0;
    for (const m of modules) {
      const key = moduleKeyFromUrl(m.url);
      let changed = 0;
      for (const action of PERM_ACTIONS) {
        const av = can(a.roles, permissionId(key, action));
        const bv = can(b.roles, permissionId(key, action));
        if (av && bv) bothAllow++;
        else if (!av && !bv) bothDeny++;
        else if (av) { onlyA++; changed++; }
        else { onlyB++; changed++; }
      }
      if (changed) modulesChanged++;
    }
    return { onlyA, onlyB, bothAllow, bothDeny, modulesChanged };
  }, [a.roles, b.roles]);

  const kpis: Kpi[] = [
    { label: "Changed module actions", value: String(totals.onlyA + totals.onlyB), delta: `${totals.modulesChanged} modules differ`, tone: "down", spark: [3, 5, 4, 7, 6, 8, 9] },
    { label: `Only ${a.label.split(" ·")[0]}`, value: String(totals.onlyA), delta: "extra grants on A", tone: "up", spark: [2, 3, 4, 4, 5, 6, 6] },
    { label: `Only ${b.label.split(" ·")[0]}`, value: String(totals.onlyB), delta: "extra grants on B", tone: "up", spark: [1, 2, 3, 3, 4, 5, 5] },
    { label: "Identical checks", value: String(totals.bothAllow + totals.bothDeny), delta: `${totals.bothAllow} allow · ${totals.bothDeny} deny`, tone: "up", spark: [8, 8, 9, 9, 10, 10, 11] },
  ];

  const diffRows = () =>
    rows.flatMap((r) =>
      r.cells
        .filter((c) => !onlyChanged || c.kind === "only-a" || c.kind === "only-b")
        .map((c) => [r.module.title, r.key, r.module.group, c.action, c.a ? "allow" : "deny", c.b ? "allow" : "deny", KIND_LABEL[c.kind]]),
    );

  const exportCsv = () => {
    const head = ["module", "key", "group", "action", `A:${a.label}`, `B:${b.label}`, "diff"];
    const body = diffRows().map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    downloadCsv(`role-comparison-${a.id}-vs-${b.id}.csv`, [head.join(","), ...body].join("\n"));
    toast.success("Comparison exported", { description: `${body.length} rows` });
  };

  const exportPdf = () => {
    printReportPdf({
      title: "Role Comparison Report",
      subtitle: `${a.label} (A) versus ${b.label} (B)`,
      meta: [
        { label: "A roles", value: a.roles.join(" + ") },
        { label: "B roles", value: b.roles.join(" + ") },
        { label: "Scope", value: onlyChanged ? "Changed module actions only" : "All module actions" },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
      summary: [
        { label: "Changed", value: String(totals.onlyA + totals.onlyB) },
        { label: "Only A", value: String(totals.onlyA) },
        { label: "Only B", value: String(totals.onlyB) },
        { label: "Modules differing", value: String(totals.modulesChanged) },
      ],
      tables: [
        {
          title: "Effective grant diff",
          note: "Rows list every evaluated module action with the resolved decision for each subject.",
          head: ["Module", "Key", "Group", "Action", "A", "B", "Difference"],
          rows: diffRows(),
        },
      ],
    });
    toast.success("Report ready", { description: "Choose “Save as PDF” in the print dialog." });
  };

  const picker = (
    side: "A" | "B",
    kind: SubjectKind,
    setKind: (k: SubjectKind) => void,
    id: string,
    setId: (v: string) => void,
    subject: Subject,
  ) => (
    <div className="space-y-2 rounded-xl border border-border/60 p-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Subject {side}</Label>
        <div className="flex gap-1">
          {(["role", "user"] as SubjectKind[]).map((k) => (
            <Badge
              key={k}
              variant={kind === k ? "default" : "outline"}
              className="cursor-pointer font-normal capitalize"
              onClick={() => { setKind(k); setId(k === "role" ? "user" : DIRECTORY[0].email); }}
            >
              {k}
            </Badge>
          ))}
        </div>
      </div>
      <Select value={id} onValueChange={setId}>
        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          {kind === "role"
            ? ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)
            : DIRECTORY.map((d) => <SelectItem key={d.email} value={d.email}>{d.name} · {d.email}</SelectItem>)}
        </SelectContent>
      </Select>
      <p className="text-[11px] text-muted-foreground">Effective roles: {subject.roles.join(", ")}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <Hero
        icon={GitCompare}
        eyebrow="Access Lab"
        title="Role Comparison"
        subtitle="Diff effective grants and denials between two roles or users and highlight exactly which module actions change."
        right={
          <>
            <Button size="sm" variant="secondary" onClick={exportCsv}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
            </Button>
            <PermButton permission="role-compare.export" size="sm" variant="secondary" onClick={exportPdf}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />Export PDF report
            </PermButton>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_1fr]">
          {picker("A", kindA, setKindA, idA, setIdA, a)}
          <div className="hidden items-center justify-center lg:flex">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-muted">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {picker("B", kindB, setKindB, idB, setIdB, b)}
        </CardContent>
      </Card>

      <KpiStrip kpis={kpis} />

      <SectionHeader
        title="Effective grant diff"
        desc="Green = only subject A has it, blue = only subject B, muted = identical."
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter modules…" className="h-8 w-52 pl-8" />
            </div>
            <Button size="sm" variant={onlyChanged ? "default" : "outline"} className="h-8 text-xs" onClick={() => setOnlyChanged((v) => !v)}>
              Only changed
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Module</TableHead>
                <TableHead>Group</TableHead>
                {PERM_ACTIONS.map((a2) => <TableHead key={a2} className="text-center capitalize">{a2}</TableHead>)}
                <TableHead className="text-center">Δ</TableHead>
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
                  {r.cells.map((c) => (
                    <TableCell key={c.action} className="text-center">
                      <DiffMark cell={c} />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Badge variant="outline" className={r.changed ? "border-warning/50 bg-warning/10 text-warning" : "font-normal"}>
                      {r.changed}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3 + PERM_ACTIONS.length} className="py-10 text-center text-sm text-muted-foreground">
                    {onlyChanged ? "These two subjects resolve to identical access." : "No modules match this filter."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Plus className="h-3 w-3 text-success" />Only A allows</span>
        <span className="inline-flex items-center gap-1"><Minus className="h-3 w-3 text-primary" />Only B allows</span>
        <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" />Both allow</span>
        <span className="inline-flex items-center gap-1"><X className="h-3 w-3" />Both deny</span>
      </div>
    </div>
  );
}

function DiffMark({ cell }: { cell: DiffCell }) {
  if (cell.kind === "only-a")
    return (
      <span className="mx-auto inline-flex items-center gap-0.5 rounded bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success" title="Only subject A">
        <Plus className="h-3 w-3" />A
      </span>
    );
  if (cell.kind === "only-b")
    return (
      <span className="mx-auto inline-flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary" title="Only subject B">
        <Plus className="h-3 w-3" />B
      </span>
    );
  if (cell.kind === "same-allow") return <Check className="mx-auto h-4 w-4 text-muted-foreground" aria-label="both allow" />;
  return <X className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="both deny" />;
}