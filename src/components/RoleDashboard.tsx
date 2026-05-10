import { Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingDown, TrendingUp, Minus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roleConfigs, modulesForGroups } from "@/lib/role-config";
import { useAuth, type AppRole } from "@/lib/auth";

export function RoleDashboard({ role: forcedRole }: { role?: AppRole }) {
  const { primaryRole } = useAuth();
  const role = forcedRole ?? primaryRole;
  const cfg = roleConfigs[role] ?? roleConfigs.user;
  const grouped = modulesForGroups(cfg.groups);

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div className="relative z-10 max-w-3xl text-primary-foreground">
          <Badge variant="secondary" className="mb-3 capitalize">
            <Sparkles className="mr-1 h-3 w-3" />
            {role.replace("_", " ")}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{cfg.title}</h1>
          <p className="mt-2 text-sm md:text-base opacity-90">{cfg.subtitle}</p>
        </div>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cfg.kpis.map((k) => (
          <Card key={k.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="mt-1 text-2xl font-semibold">{k.value}</div>
              {k.delta && (
                <div
                  className={
                    "mt-1 inline-flex items-center gap-1 text-xs " +
                    (k.tone === "up"
                      ? "text-success"
                      : k.tone === "down"
                        ? "text-destructive"
                        : "text-muted-foreground")
                  }
                >
                  {k.tone === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : k.tone === "down" ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {k.delta}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {grouped.map(({ group, items }) => (
        <section key={group} className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {group}
            </h2>
            <span className="text-xs text-muted-foreground">{items.length} modules</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.url}
                  to={m.url as any}
                  className="group rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold truncate">{m.title}</h3>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{m.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button asChild variant="outline" size="sm">
          <Link to={"/settings" as any}>Customize workspace</Link>
        </Button>
      </div>
    </div>
  );
}