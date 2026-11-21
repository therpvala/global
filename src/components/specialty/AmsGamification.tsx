import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Award, Gift, Loader2, Plus, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  awardTrophy, claimReward, createMission, createReward, createTrophy, decideClaim,
  getGamificationOverview, setEntityStatus,
} from "@/lib/ams/gamification.functions";

type Kind = "missions" | "trophies" | "leaderboard" | "rewards";

export function AmsGamification({ kind }: { kind: Kind }) {
  const qc = useQueryClient();
  const fnOverview = useServerFn(getGamificationOverview);
  const q = useQuery({ queryKey: ["ams", "gamification"], queryFn: () => fnOverview() });
  const refresh = () => void qc.invalidateQueries({ queryKey: ["ams", "gamification"] });
  const d = q.data;

  if (q.isLoading) return <div className="grid h-40 place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  if (q.error) return <p className="py-10 text-center text-sm text-destructive">{(q.error as Error).message}</p>;
  if (!d) return <p className="py-10 text-center text-sm text-muted-foreground">Sign in to see this section.</p>;

  const name = (id: string) => {
    const p = d.profiles.find((x) => x.id === id);
    return p?.display_name || p?.email || id.slice(0, 8);
  };
  const props = { d, refresh, name };
  if (kind === "missions") return <Missions {...props} />;
  if (kind === "trophies") return <Trophies {...props} />;
  if (kind === "leaderboard") return <Leaderboard {...props} />;
  return <Rewards {...props} />;
}

type Data = NonNullable<Awaited<ReturnType<typeof getGamificationOverview>>>;
type P = { d: Data; refresh: () => void; name: (id: string) => string };

function useAction<T>(fn: (v: T) => Promise<unknown>, ok: string, refresh: () => void, after?: () => void) {
  return useMutation({
    mutationFn: fn,
    onSuccess: () => { toast.success(ok); refresh(); after?.(); },
    onError: (e: Error) => toast.error(e.message),
  });
}

function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function StatusToggle({ table, id, status, refresh, disabled }: { table: "missions" | "trophies" | "rewards"; id: string; status: string; refresh: () => void; disabled: boolean }) {
  const fn = useServerFn(setEntityStatus);
  const m = useAction((s: "active" | "inactive") => fn({ data: { table, id, status: s } }), "Status updated", refresh);
  return (
    <Button size="sm" variant="ghost" disabled={disabled || m.isPending}
      onClick={() => m.mutate(status === "active" ? "inactive" : "active")}>
      {status === "active" ? "Pause" : "Activate"}
    </Button>
  );
}

/* ------------------------------ missions ------------------------------ */
function Missions({ d, refresh }: P) {
  const fn = useServerFn(createMission);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", description: "", cadence: "daily" as const as "daily" | "weekly" | "monthly" | "seasonal", xp_reward: 50, target: 1, metric: "tickets.resolved", coins: 10 });
  const m = useAction(() => fn({ data: f }), "Mission created", refresh, () => setOpen(false));
  const prog = (id: string) => d.myProgress.find((p) => p.mission_id === id);
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)} disabled={!d.isAdmin} title={d.isAdmin ? "" : "Admins only"}>
          <Plus className="mr-1.5 h-4 w-4" /> New mission
        </Button>
      </div>
      {!d.missions.length ? <Empty text="No missions yet." /> : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {d.missions.map((ms) => {
            const c = ms.conditions as { metric?: string; target?: number };
            const p = prog(ms.id);
            return (
              <Card key={ms.id}><CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground"><Target className="h-3.5 w-3.5" />{ms.cadence}</div>
                    <div className="font-semibold">{ms.name}</div>
                  </div>
                  <Badge variant={ms.status === "active" ? "default" : "secondary"}>{ms.status}</Badge>
                </div>
                {ms.description && <p className="text-xs text-muted-foreground">{ms.description}</p>}
                <div className="text-xs text-muted-foreground">Goal: {c?.metric ?? "—"} ≥ {c?.target ?? 1} · +{ms.xp_reward} XP</div>
                <div className="text-xs">{p?.completed_at ? "Completed by you" : `Your progress: ${Number(p?.progress ?? 0)}`}</div>
                <div className="flex justify-end"><StatusToggle table="missions" id={ms.id} status={ms.status} refresh={refresh} disabled={!d.isAdmin} /></div>
              </CardContent></Card>
            );
          })}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New mission</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <F label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></F>
            <F label="Description"><Textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Cadence">
                <Select value={f.cadence} onValueChange={(v) => setF({ ...f, cadence: v as typeof f.cadence })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["daily", "weekly", "monthly", "seasonal"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Metric"><Input value={f.metric} onChange={(e) => setF({ ...f, metric: e.target.value })} /></F>
              <F label="Target"><Input type="number" value={f.target} onChange={(e) => setF({ ...f, target: +e.target.value })} /></F>
              <F label="XP reward"><Input type="number" value={f.xp_reward} onChange={(e) => setF({ ...f, xp_reward: +e.target.value })} /></F>
              <F label="Coins"><Input type="number" value={f.coins} onChange={(e) => setF({ ...f, coins: +e.target.value })} /></F>
            </div>
          </div>
          <DialogFooter><Button onClick={() => m.mutate(undefined)} disabled={m.isPending || !f.name.trim()}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ trophies ------------------------------ */
const TIER_TONE: Record<string, string> = { bronze: "text-orange-600", silver: "text-slate-500", gold: "text-amber-500", platinum: "text-cyan-600" };
function Trophies({ d, refresh, name }: P) {
  const fn = useServerFn(createTrophy);
  const fnAward = useServerFn(awardTrophy);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", description: "", tier: "bronze" as "bronze" | "silver" | "gold" | "platinum" });
  const [awardFor, setAwardFor] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const m = useAction(() => fn({ data: f }), "Trophy created", refresh, () => setOpen(false));
  const mA = useAction(() => fnAward({ data: { trophy_id: awardFor!, user_id: recipient } }), "Trophy awarded", refresh, () => setAwardFor(null));
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)} disabled={!d.isAdmin}><Plus className="mr-1.5 h-4 w-4" /> New trophy</Button>
      </div>
      {!d.trophies.length ? <Empty text="No trophies yet." /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {d.trophies.map((t) => (
            <Card key={t.id}><CardContent className="space-y-2 p-4 text-center">
              <Trophy className={`mx-auto h-8 w-8 ${TIER_TONE[t.tier] ?? ""}`} />
              <div className="font-semibold">{t.name}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{t.tier}{d.myTrophyIds.includes(t.id) ? " · earned" : ""}</div>
              {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
              <div className="flex justify-center gap-1">
                <Button size="sm" variant="outline" disabled={!d.isAdmin} onClick={() => { setAwardFor(t.id); setRecipient(""); }}><Award className="mr-1 h-4 w-4" /> Award</Button>
                <StatusToggle table="trophies" id={t.id} status={t.status} refresh={refresh} disabled={!d.isAdmin} />
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New trophy</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <F label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></F>
            <F label="Description"><Textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></F>
            <F label="Tier">
              <Select value={f.tier} onValueChange={(v) => setF({ ...f, tier: v as typeof f.tier })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["bronze", "silver", "gold", "platinum"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </F>
          </div>
          <DialogFooter><Button onClick={() => m.mutate(undefined)} disabled={m.isPending || !f.name.trim()}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!awardFor} onOpenChange={(v) => !v && setAwardFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Award trophy</DialogTitle></DialogHeader>
          <F label="Recipient">
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger><SelectValue placeholder="Choose a person" /></SelectTrigger>
              <SelectContent>{d.leaderboard.map((r) => <SelectItem key={r.user_id} value={r.user_id}>{name(r.user_id)}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <DialogFooter><Button disabled={!recipient || mA.isPending} onClick={() => mA.mutate(undefined)}>Award</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------------------- leaderboard ----------------------------- */
function Leaderboard({ d, name }: P) {
  if (!d.leaderboard.length) return <Empty text="No one has earned XP yet." />;
  return (
    <Card><CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead className="w-16 text-right">#</TableHead><TableHead>Person</TableHead>
          <TableHead className="text-right">Total XP</TableHead><TableHead className="text-right">Level</TableHead><TableHead className="text-right">Rank</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {d.leaderboard.map((r) => (
            <TableRow key={r.user_id} className={r.user_id === d.uid ? "bg-primary/5" : ""}>
              <TableCell className="text-right font-mono">{r.rank}</TableCell>
              <TableCell className="font-medium">{name(r.user_id)}{r.user_id === d.uid ? " (you)" : ""}</TableCell>
              <TableCell className="text-right">{Number(r.total_xp).toLocaleString()}</TableCell>
              <TableCell className="text-right">{r.current_level}</TableCell>
              <TableCell className="text-right">{r.current_rank}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent></Card>
  );
}

/* ------------------------------- rewards ------------------------------- */
function Rewards({ d, refresh, name }: P) {
  const fn = useServerFn(createReward);
  const fnClaim = useServerFn(claimReward);
  const fnDecide = useServerFn(decideClaim);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", description: "", cost_coins: 100, cost_tokens: 0, stock: null as number | null, rarity: "common" as "common" | "rare" | "epic" | "legendary" | "mythic" });
  const m = useAction(() => fn({ data: f }), "Reward created", refresh, () => setOpen(false));
  const mClaim = useAction((id: string) => fnClaim({ data: { reward_id: id } }), "Claim submitted for approval", refresh);
  const mDecide = useAction((v: { id: string; status: "approved" | "rejected" | "fulfilled" }) => fnDecide({ data: v }), "Claim updated", refresh);
  const bal = (k: string) => Number(d.wallets.find((w) => w.kind === k)?.balance ?? 0);
  const rewardName = (id: string) => d.rewards.find((r) => r.id === id)?.name ?? "—";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Your balance: <b className="text-foreground">{bal("coins")}</b> coins · <b className="text-foreground">{bal("tokens")}</b> tokens</div>
        <Button size="sm" onClick={() => setOpen(true)} disabled={!d.isAdmin}><Plus className="mr-1.5 h-4 w-4" /> New reward</Button>
      </div>
      {!d.rewards.length ? <Empty text="No rewards in the store yet." /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {d.rewards.map((r) => (
            <Card key={r.id}><CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between"><Gift className="h-5 w-5 text-primary" /><Badge variant="secondary">{r.rarity}</Badge></div>
              <div className="font-semibold">{r.name}</div>
              {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
              <div className="text-xs">{r.cost_coins} coins{r.cost_tokens ? ` · ${r.cost_tokens} tokens` : ""} · {r.stock === null ? "unlimited" : `${r.stock} left`}</div>
              <div className="flex gap-1">
                <Button size="sm" disabled={r.status !== "active" || mClaim.isPending} onClick={() => mClaim.mutate(r.id)}>Claim</Button>
                <StatusToggle table="rewards" id={r.id} status={r.status} refresh={refresh} disabled={!d.isAdmin} />
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <div>
        <h3 className="mb-2 text-sm font-semibold">{d.isAdmin ? "Claims queue" : "Your claims"}</h3>
        {!d.claims.length ? <Empty text="No claims yet." /> : (
          <Card><CardContent className="p-0"><Table>
            <TableHeader><TableRow><TableHead>Reward</TableHead><TableHead>Person</TableHead><TableHead>Status</TableHead><TableHead>Requested</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{d.claims.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{rewardName(c.reward_id)}</TableCell>
                <TableCell>{name(c.user_id)}</TableCell>
                <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {d.isAdmin && c.status === "pending" && (<>
                    <Button size="sm" variant="ghost" onClick={() => mDecide.mutate({ id: c.id, status: "approved" })}>Approve</Button>
                    <Button size="sm" variant="ghost" onClick={() => mDecide.mutate({ id: c.id, status: "rejected" })}>Reject</Button>
                  </>)}
                  {d.isAdmin && c.status === "approved" && <Button size="sm" variant="ghost" onClick={() => mDecide.mutate({ id: c.id, status: "fulfilled" })}>Mark fulfilled</Button>}
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></CardContent></Card>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New reward</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <F label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></F>
            <F label="Description"><Textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Cost (coins)"><Input type="number" value={f.cost_coins} onChange={(e) => setF({ ...f, cost_coins: +e.target.value })} /></F>
              <F label="Cost (tokens)"><Input type="number" value={f.cost_tokens} onChange={(e) => setF({ ...f, cost_tokens: +e.target.value })} /></F>
              <F label="Stock (empty = unlimited)"><Input type="number" value={f.stock ?? ""} onChange={(e) => setF({ ...f, stock: e.target.value === "" ? null : +e.target.value })} /></F>
              <F label="Rarity">
                <Select value={f.rarity} onValueChange={(v) => setF({ ...f, rarity: v as typeof f.rarity })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["common", "rare", "epic", "legendary", "mythic"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
          </div>
          <DialogFooter><Button onClick={() => m.mutate(undefined)} disabled={m.isPending || !f.name.trim()}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
