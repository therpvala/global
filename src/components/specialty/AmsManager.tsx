import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Archive,
  ArchiveRestore,
  Download,
  LifeBuoy,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { KpiStrip, type Kpi } from "@/components/enterprise";
import { useAuth } from "@/lib/auth";
import {
  addComment,
  archiveTicket,
  assignTicket,
  changeStatus,
  createTicket,
  getTicket,
  listAgents,
  listTickets,
  postChatMessage,
  restoreTicket,
  whoAmI,
} from "@/lib/ams/tickets.functions";
import {
  AMS_CHAT_CHANNELS,
  AMS_PRIORITIES,
  AMS_STATUSES,
  PRIORITY_META,
  STATUS_META,
  type AmsChatChannel,
  type AmsPriority,
  type AmsStatus,
  type Ticket,
} from "@/lib/ams/tickets.types";

const OPEN_STATUSES: AmsStatus[] = [
  "submitted",
  "assigned",
  "accepted",
  "in_progress",
  "waiting_customer",
  "waiting_developer",
  "waiting_qa",
  "testing",
  "reopened",
];

function fmt(ts?: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status }: { status: AmsStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${meta.tone}`}>
      {meta.label}
    </span>
  );
}

function PriorityPill({ priority }: { priority: AmsPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${meta.tone}`}>
      {meta.label}
    </span>
  );
}

export function AmsManager() {
  const qc = useQueryClient();
  const { cloudUser } = useAuth();

  const fnList = useServerFn(listTickets);
  const fnAgents = useServerFn(listAgents);
  const fnWho = useServerFn(whoAmI);
  const fnCreate = useServerFn(createTicket);
  const fnStatus = useServerFn(changeStatus);
  const fnAssign = useServerFn(assignTicket);
  const fnArchive = useServerFn(archiveTicket);
  const fnRestore = useServerFn(restoreTicket);

  const [status, setStatus] = useState<AmsStatus | "all">("all");
  const [priority, setPriority] = useState<AmsPriority | "all">("all");
  const [mine, setMine] = useState(false);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const who = useQuery({ queryKey: ["ams", "me"], queryFn: () => fnWho({}) });
  const agents = useQuery({ queryKey: ["ams", "agents"], queryFn: () => fnAgents({}) });

  const listKey = ["ams", "tickets", status, priority, mine, search] as const;
  const tickets = useQuery({
    queryKey: listKey,
    queryFn: () =>
      fnList({
        data: {
          status,
          ...(priority !== "all" ? { priority } : {}),
          ...(search ? { q: search } : {}),
          assignee: mine ? ("me" as const) : ("any" as const),
        },
      }),
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["ams"] });
  };

  const mCreate = useMutation({
    mutationFn: (input: Parameters<typeof createTicket>[0] extends never ? never : {
      subject: string;
      description?: string;
      product?: string;
      category?: string;
      priority?: AmsPriority;
      department?: string;
      team?: string;
      submit?: boolean;
    }) => fnCreate({ data: input }),
    onSuccess: (row) => {
      toast.success(`Ticket ${(row as Ticket).ticket_no} created`);
      setCreateOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mStatus = useMutation({
    mutationFn: (v: { id: string; to: AmsStatus }) => fnStatus({ data: v }),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mAssign = useMutation({
    mutationFn: (v: { id: string; assignee_id: string | null }) => fnAssign({ data: v }),
    onSuccess: () => {
      toast.success("Assignment saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mArchive = useMutation({
    mutationFn: (id: string) => fnArchive({ data: { id } }),
    onSuccess: () => {
      toast.success("Ticket archived");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mRestore = useMutation({
    mutationFn: (id: string) => fnRestore({ data: { id } }),
    onSuccess: () => {
      toast.success("Ticket restored");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (tickets.data?.rows ?? []) as Ticket[];
  const stats = tickets.data?.stats ?? {};

  const kpis: Kpi[] = useMemo(() => {
    const open = OPEN_STATUSES.reduce((n, s) => n + (stats[s] ?? 0), 0);
    const critical = rows.filter((r) => r.priority === "critical").length;
    const unassigned = rows.filter((r) => !r.assignee_id).length;
    return [
      { label: "Total tickets", value: String(stats.total ?? 0), hint: "Active workload" },
      { label: "Open", value: String(open), tone: open ? "up" : "neutral", hint: "Not resolved or closed" },
      { label: "Critical", value: String(critical), tone: critical ? "down" : "neutral", hint: "P1 escalations" },
      { label: "Unassigned", value: String(unassigned), tone: unassigned ? "down" : "up", hint: "Awaiting an owner" },
    ];
  }, [rows, stats]);

  const agentName = (id: string | null) => {
    if (!id) return "Unassigned";
    const a = (agents.data ?? []).find((x) => x.id === id);
    return a?.display_name || a?.email || id.slice(0, 8);
  };

  const exportCsv = () => {
    const head = ["ticket_no", "subject", "status", "priority", "assignee", "created_at"];
    const body = rows.map((r) =>
      [r.ticket_no, r.subject, r.status, r.priority, agentName(r.assignee_id), r.created_at]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ams-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const signedIn = !!cloudUser || !!who.data;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10">
            <LifeBuoy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AMS Manager</h1>
            <p className="text-sm text-muted-foreground">
              Control Panel · end-to-end ticket intake, triage, assignment, resolution and audit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void tickets.refetch()}>
            <RefreshCw className={`mr-1.5 h-4 w-4 ${tickets.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!rows.length}>
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} disabled={!signedIn}>
            <Plus className="mr-1.5 h-4 w-4" /> New ticket
          </Button>
        </div>
      </header>

      {!signedIn && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4 text-sm">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span>
              You are browsing without a backend session. Sign in to load and change real ticket
              records.
            </span>
          </CardContent>
        </Card>
      )}

      <KpiStrip kpis={kpis} />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <form
            className="relative min-w-[220px] flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(q.trim());
            }}
          >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search subject or ticket number…"
              className="pl-8"
            />
          </form>

          <Select value={status} onValueChange={(v) => setStatus(v as AmsStatus | "all")}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {AMS_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={(v) => setPriority(v as AmsPriority | "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {AMS_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_META[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <Switch checked={mine} onCheckedChange={setMine} />
            Assigned to me
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Ticket</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[110px]">Priority</TableHead>
                <TableHead className="w-[170px]">Assignee</TableHead>
                <TableHead className="w-[170px]">Created</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading tickets…
                  </TableCell>
                </TableRow>
              )}
              {!tickets.isLoading && !rows.length && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No tickets match these filters.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer"
                  onClick={() => setOpenId(t.id)}
                >
                  <TableCell className="font-mono text-xs">{t.ticket_no}</TableCell>
                  <TableCell className="font-medium">{t.subject}</TableCell>
                  <TableCell>
                    <StatusPill status={t.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityPill priority={t.priority} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {agentName(t.assignee_id)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fmt(t.created_at)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {t.deleted_at ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Restore"
                        onClick={() => mRestore.mutate(t.id)}
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Archive"
                        onClick={() => mArchive.mutate(t.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateTicketDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        pending={mCreate.isPending}
        onSubmit={(v) => mCreate.mutate(v)}
      />

      <TicketDetail
        id={openId}
        onClose={() => setOpenId(null)}
        agents={agents.data ?? []}
        agentName={agentName}
        onStatus={(id, to) => mStatus.mutate({ id, to })}
        onAssign={(id, assignee_id) => mAssign.mutate({ id, assignee_id })}
        currentUserId={who.data?.id ?? null}
      />
    </div>
  );
}

/* --------------------------- create dialog --------------------------- */

function CreateTicketDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pending: boolean;
  onSubmit: (v: {
    subject: string;
    description?: string;
    product?: string;
    category?: string;
    priority?: AmsPriority;
    department?: string;
    team?: string;
    submit?: boolean;
  }) => void;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState<AmsPriority>("medium");

  const submit = (asDraft: boolean) => {
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    onSubmit({
      subject,
      description: description || undefined,
      product: product || undefined,
      category: category || undefined,
      department: department || undefined,
      priority,
      submit: !asDraft,
    });
    setSubject("");
    setDescription("");
    setProduct("");
    setCategory("");
    setDepartment("");
    setPriority("medium");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New ticket</DialogTitle>
          <DialogDescription>
            Records are written to the live ticket database with a full audit event.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ams-subject">Subject *</Label>
            <Input
              id="ams-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary of the issue"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ams-desc">Description</Label>
            <Textarea
              id="ams-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Steps, impact, expected behaviour…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ams-product">Product</Label>
              <Input id="ams-product" value={product} onChange={(e) => setProduct(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ams-category">Category</Label>
              <Input id="ams-category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ams-dept">Department</Label>
              <Input id="ams-dept" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as AmsPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AMS_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_META[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => submit(true)} disabled={pending}>
            Save as draft
          </Button>
          <Button onClick={() => submit(false)} disabled={pending}>
            {pending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Submit ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------- detail sheet ---------------------------- */

type AgentRow = { id: string; display_name: string | null; email: string | null };

function TicketDetail({
  id,
  onClose,
  agents,
  agentName,
  onStatus,
  onAssign,
  currentUserId,
}: {
  id: string | null;
  onClose: () => void;
  agents: AgentRow[];
  agentName: (id: string | null) => string;
  onStatus: (id: string, to: AmsStatus) => void;
  onAssign: (id: string, assignee: string | null) => void;
  currentUserId: string | null;
}) {
  const qc = useQueryClient();
  const fnGet = useServerFn(getTicket);
  const fnComment = useServerFn(addComment);
  const fnChat = useServerFn(postChatMessage);

  const [comment, setComment] = useState("");
  const [internal, setInternal] = useState(false);
  const [channel, setChannel] = useState<AmsChatChannel>("support");
  const [chatBody, setChatBody] = useState("");

  const detail = useQuery({
    queryKey: ["ams", "ticket", id],
    queryFn: () => fnGet({ data: { id: id! } }),
    enabled: !!id,
  });

  const refresh = () => void qc.invalidateQueries({ queryKey: ["ams"] });

  const mComment = useMutation({
    mutationFn: () => fnComment({ data: { ticket_id: id!, body: comment, is_internal: internal } }),
    onSuccess: () => {
      setComment("");
      toast.success(internal ? "Internal note added" : "Comment posted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mChat = useMutation({
    mutationFn: () => fnChat({ data: { ticket_id: id!, channel, body: chatBody } }),
    onSuccess: () => {
      setChatBody("");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const data = detail.data;
  const ticket = data?.ticket as Ticket | undefined;

  return (
    <Sheet open={!!id} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        {detail.isLoading && (
          <div className="grid h-40 place-items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {!detail.isLoading && !ticket && (
          <div className="grid h-40 place-items-center text-sm text-muted-foreground">
            This ticket is not available for your session.
          </div>
        )}
        {ticket && (
          <>
            <SheetHeader className="space-y-2 pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[11px]">
                  {ticket.ticket_no}
                </Badge>
                <StatusPill status={ticket.status} />
                <PriorityPill priority={ticket.priority} />
              </div>
              <SheetTitle className="text-left text-xl">{ticket.subject}</SheetTitle>
            </SheetHeader>

            <div className="flex flex-wrap items-center gap-2 border-y py-3">
              <Select value={ticket.status} onValueChange={(v) => onStatus(ticket.id, v as AmsStatus)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AMS_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_META[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={ticket.assignee_id ?? "none"}
                onValueChange={(v) => onAssign(ticket.id, v === "none" ? null : v)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.display_name || a.email || a.id.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentUserId && ticket.assignee_id !== currentUserId && (
                <Button variant="outline" size="sm" onClick={() => onAssign(ticket.id, currentUserId)}>
                  <UserIcon className="mr-1.5 h-4 w-4" /> Assign to me
                </Button>
              )}
            </div>

            <Tabs defaultValue="overview" className="mt-3">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comments">Comments ({data?.comments.length ?? 0})</TabsTrigger>
                <TabsTrigger value="chat">Chat ({data?.chat.length ?? 0})</TabsTrigger>
                <TabsTrigger value="timeline">Timeline ({data?.events.length ?? 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3 pt-3">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {ticket.description || "No description provided."}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Product" value={ticket.product} />
                  <Field label="Category" value={ticket.category} />
                  <Field label="Department" value={ticket.department} />
                  <Field label="Team" value={ticket.team} />
                  <Field label="Assignee" value={agentName(ticket.assignee_id)} />
                  <Field label="Created" value={fmt(ticket.created_at)} />
                  <Field label="Resolved" value={fmt(ticket.resolved_at)} />
                  <Field label="Closed" value={fmt(ticket.closed_at)} />
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-3 pt-3">
                <div className="space-y-2">
                  {(data?.comments ?? []).map((c) => (
                    <div key={c.id} className="rounded-md border p-3">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{agentName(c.author_id)}</span>
                        <span className="flex items-center gap-2">
                          {c.is_internal && (
                            <Badge variant="secondary" className="text-[10px]">
                              internal
                            </Badge>
                          )}
                          {fmt(c.created_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{c.body}</p>
                    </div>
                  ))}
                  {!data?.comments.length && (
                    <p className="py-6 text-center text-sm text-muted-foreground">No comments yet.</p>
                  )}
                </div>
                <div className="space-y-2 border-t pt-3">
                  <Textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a reply…"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch checked={internal} onCheckedChange={setInternal} />
                      Internal note
                    </label>
                    <Button
                      size="sm"
                      disabled={!comment.trim() || mComment.isPending}
                      onClick={() => mComment.mutate()}
                    >
                      <MessageSquare className="mr-1.5 h-4 w-4" /> Post
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="space-y-3 pt-3">
                <Select value={channel} onValueChange={(v) => setChannel(v as AmsChatChannel)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AMS_CHAT_CHANNELS.map((c) => (
                      <SelectItem key={c} value={c}>
                        #{c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  {(data?.chat ?? [])
                    .filter((m) => m.channel === channel)
                    .map((m) => (
                      <div key={m.id} className="rounded-md bg-muted/50 p-3">
                        <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                          <span>{agentName(m.author_id)}</span>
                          <span>{fmt(m.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm">{m.body}</p>
                      </div>
                    ))}
                  {!(data?.chat ?? []).some((m) => m.channel === channel) && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No messages in #{channel} yet.
                    </p>
                  )}
                </div>
                <form
                  className="flex gap-2 border-t pt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (chatBody.trim()) mChat.mutate();
                  }}
                >
                  <Input
                    value={chatBody}
                    onChange={(e) => setChatBody(e.target.value)}
                    placeholder={`Message #${channel}`}
                  />
                  <Button type="submit" size="icon" disabled={!chatBody.trim() || mChat.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="timeline" className="pt-3">
                <ol className="space-y-3">
                  {(data?.events ?? []).map((ev) => (
                    <li key={ev.id} className="flex gap-3 text-sm">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <div className="font-medium">
                          {ev.kind.replace(/_/g, " ")}
                          {ev.to_value ? ` → ${ev.to_value}` : ""}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {agentName(ev.actor_id)} · {fmt(ev.created_at)}
                        </div>
                      </div>
                    </li>
                  ))}
                  {!data?.events.length && (
                    <p className="py-6 text-center text-sm text-muted-foreground">No events yet.</p>
                  )}
                </ol>
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

export default AmsManager;
