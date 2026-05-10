import { Link } from "@tanstack/react-router";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { ModuleItem } from "@/lib/modules";

export function ModulePage({ module }: { module: ModuleItem }) {
  const Icon = module.icon;
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
              <Badge variant="secondary">{module.group}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{module.desc}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to={"/" as any}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Total", "Active", "Pending", "Archived"].map((k) => (
              <Card key={k} className="border-border/60">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="mt-1 text-2xl font-semibold">—</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Construction className="h-4 w-4 text-warning" />
                Module workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                This is the unified workspace template for{" "}
                <span className="text-foreground font-medium">{module.title}</span>. Hook it up to
                your data layer (Lovable Cloud or your existing Prisma API) to render records,
                charts, and workflows here. The shell, navigation, breadcrumbs and role context
                are already wired.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              List / table view will render here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Charts and KPIs for this module.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Module configuration.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}