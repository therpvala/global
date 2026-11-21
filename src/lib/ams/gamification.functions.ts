import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";

type Cadence = Database["public"]["Enums"]["mission_cadence"];
type Rarity = Database["public"]["Enums"]["rarity_tier"];
type Tier = Database["public"]["Enums"]["trophy_tier"];
type EStatus = Database["public"]["Enums"]["entity_status"];
type ClaimStatus = Database["public"]["Enums"]["claim_status"];

function token() {
  const h = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
  return h?.startsWith("Bearer ") ? h.slice(7) : undefined;
}
function clientFor(tok: string): SupabaseClient<Database> {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${tok}` } },
  });
}
async function session() {
  const tok = token();
  if (!tok) return null;
  const sb = clientFor(tok);
  const { data } = await sb.auth.getUser();
  return data.user ? { sb, uid: data.user.id } : null;
}
async function requireUser() {
  const s = await session();
  if (!s) throw new Error("Sign in required");
  return s;
}
const slugify = (n: string) =>
  `${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36)}`;
const fail = (e: { message: string } | null) => {
  if (e) throw new Error(/row-level security|permission/i.test(e.message) ? "Only admins can change this" : e.message);
};

// ---------- overview ----------
export const getGamificationOverview = createServerFn({ method: "GET" }).handler(async () => {
  const s = await session();
  if (!s) return null;
  const { sb, uid } = s;
  const [missions, trophies, rewards, claims, xp, wallets, myTrophies, progress, admin] = await Promise.all([
    sb.from("missions").select("*").order("created_at", { ascending: false }),
    sb.from("trophies").select("*").order("created_at", { ascending: false }),
    sb.from("rewards").select("*").order("created_at", { ascending: false }),
    sb.from("claims").select("*").order("created_at", { ascending: false }).limit(200),
    sb.from("user_xp").select("*").order("total_xp", { ascending: false }).limit(50),
    sb.from("reward_wallets").select("*").eq("user_id", uid),
    sb.from("user_trophies").select("*").eq("user_id", uid),
    sb.from("user_mission_progress").select("*").eq("user_id", uid),
    sb.rpc("is_admin", { _user_id: uid }),
  ]);
  const ids = Array.from(new Set([...(xp.data ?? []).map((r) => r.user_id), ...(claims.data ?? []).map((c) => c.user_id)]));
  const { data: profiles } = ids.length
    ? await sb.from("profiles").select("id, display_name, email, team").in("id", ids)
    : { data: [] as { id: string; display_name: string | null; email: string | null; team: string | null }[] };
  return {
    uid,
    isAdmin: !!admin.data,
    missions: missions.data ?? [],
    trophies: trophies.data ?? [],
    rewards: rewards.data ?? [],
    claims: claims.data ?? [],
    leaderboard: (xp.data ?? []).map((r, i) => ({ ...r, rank: i + 1 })),
    profiles: profiles ?? [],
    wallets: wallets.data ?? [],
    myTrophyIds: (myTrophies.data ?? []).map((t) => t.trophy_id),
    myProgress: progress.data ?? [],
  };
});

// ---------- missions ----------
export const createMission = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; description?: string; cadence: Cadence; xp_reward: number; target: number; metric: string; coins: number }) => d)
  .handler(async ({ data }) => {
    const { sb, uid } = await requireUser();
    if (!data.name?.trim()) throw new Error("Name is required");
    const { data: row, error } = await sb.from("missions").insert({
      name: data.name.trim(), description: data.description || null, cadence: data.cadence,
      xp_reward: Math.max(0, data.xp_reward | 0),
      conditions: { metric: data.metric || "actions.count", operator: ">=", target: Math.max(1, data.target | 0) },
      rewards: { coins: Math.max(0, data.coins | 0) },
      status: "active", created_by: uid,
    }).select("*").single();
    fail(error);
    await sb.from("audit_logs").insert({ actor_id: uid, entity_type: "mission", entity_id: row!.id, action: "create", after: row as never });
    return row;
  });

export const setEntityStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { table: "missions" | "trophies" | "rewards"; id: string; status: EStatus }) => d)
  .handler(async ({ data }) => {
    const { sb } = await requireUser();
    if (!["missions", "trophies", "rewards"].includes(data.table)) throw new Error("Bad table");
    const { error } = await sb.from(data.table).update({ status: data.status }).eq("id", data.id);
    fail(error);
    return { ok: true };
  });

// ---------- trophies ----------
export const createTrophy = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; description?: string; tier: Tier }) => d)
  .handler(async ({ data }) => {
    const { sb, uid } = await requireUser();
    if (!data.name?.trim()) throw new Error("Name is required");
    const { data: row, error } = await sb.from("trophies").insert({
      name: data.name.trim(), slug: slugify(data.name), description: data.description || null,
      tier: data.tier, status: "active", created_by: uid,
    }).select("*").single();
    fail(error);
    return row;
  });

export const awardTrophy = createServerFn({ method: "POST" })
  .inputValidator((d: { trophy_id: string; user_id: string }) => d)
  .handler(async ({ data }) => {
    const { sb } = await requireUser();
    const { error } = await sb.from("user_trophies").insert({ trophy_id: data.trophy_id, user_id: data.user_id });
    fail(error);
    await sb.from("notifications").insert({ user_id: data.user_id, title: "Trophy awarded", kind: "trophy", data: { trophy_id: data.trophy_id } });
    return { ok: true };
  });

// ---------- rewards ----------
export const createReward = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; description?: string; cost_coins: number; cost_tokens: number; stock: number | null; rarity: Rarity }) => d)
  .handler(async ({ data }) => {
    const { sb, uid } = await requireUser();
    if (!data.name?.trim()) throw new Error("Name is required");
    const { data: row, error } = await sb.from("rewards").insert({
      name: data.name.trim(), slug: slugify(data.name), description: data.description || null,
      cost_coins: Math.max(0, data.cost_coins | 0), cost_tokens: Math.max(0, data.cost_tokens | 0),
      stock: data.stock, rarity: data.rarity, status: "active", created_by: uid,
    }).select("*").single();
    fail(error);
    return row;
  });

export const claimReward = createServerFn({ method: "POST" })
  .inputValidator((d: { reward_id: string }) => d)
  .handler(async ({ data }) => {
    const { sb, uid } = await requireUser();
    const { data: reward } = await sb.from("rewards").select("*").eq("id", data.reward_id).single();
    if (!reward || reward.status !== "active") throw new Error("Reward is not available");
    if (reward.stock !== null && reward.stock <= 0) throw new Error("Out of stock");
    const { data: wallets } = await sb.from("reward_wallets").select("kind, balance").eq("user_id", uid);
    const bal = (k: string) => Number(wallets?.find((w) => w.kind === k)?.balance ?? 0);
    if (bal("coins") < reward.cost_coins || bal("tokens") < reward.cost_tokens) throw new Error("Not enough balance for this reward");
    const { data: row, error } = await sb.from("claims").insert({
      user_id: uid, reward_id: reward.id, cost_coins: reward.cost_coins, cost_tokens: reward.cost_tokens, status: "pending",
    }).select("*").single();
    fail(error);
    return row;
  });

export const decideClaim = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; status: ClaimStatus; notes?: string }) => d)
  .handler(async ({ data }) => {
    const { sb, uid } = await requireUser();
    const patch: Database["public"]["Tables"]["claims"]["Update"] = { status: data.status, notes: data.notes ?? null, decided_by: uid, decided_at: new Date().toISOString() };
    if (data.status === "fulfilled") patch.fulfilled_at = new Date().toISOString();
    const { data: row, error } = await sb.from("claims").update(patch).eq("id", data.id).select("*").single();
    fail(error);
    if (row) await sb.from("notifications").insert({ user_id: row.user_id, title: `Reward claim ${data.status}`, kind: "claim", data: { claim_id: row.id } });
    return { ok: true };
  });
