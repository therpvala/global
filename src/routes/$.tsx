import type { ComponentType } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { modules } from "@/lib/modules";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { SuperAdminCommand } from "@/components/specialty/SuperAdminCommand";
import { FranchisesDashboard } from "@/components/specialty/FranchisesDashboard";
import {
  CRMConsole,
  AccountingConsole,
  ApiManagerConsole,
  SEOConsole,
  ProjectsConsole,
  HRMConsole,
  MarketplaceConsole,
  SubscriptionsConsole,
  SecurityConsole,
  HomeApps,
} from "@/components/specialty/wave2";
import {
  ExecutiveConsole,
  AnalyticsConsole,
  ReportsConsole,
  AutomationConsole,
  SupportConsole,
  MessagingConsole,
  NotificationsConsole,
  ProfileConsole,
  SettingsConsole,
  AuditConsole,
  RolesConsole,
  KnowledgeConsole,
  ResellersConsole,
  CompaniesConsole,
  AIStudioConsole,
  CopilotConsole,
  InvoicesConsole,
  LicensesConsole,
  DocumentsConsole,
  WelcomeConsole,
} from "@/components/specialty/wave3";
import {
  OrgChartConsole, CalendarConsole, ActivityConsole, FavoritesConsole, BookmarksConsole,
  GoalsConsole, LiveConsole, HeatmapsConsole, OfflineConsole, SessionsConsole,
  DevicesConsole, ThreatsConsole, WalletConsole, LeaderboardConsole, ThemeConsole,
  MlmConsole, BranchesConsole, RecruitmentConsole, PosConsole, ErpConsole,
  InventoryConsole, ManufacturingConsole,
} from "@/components/specialty/wave4";
import { AchievementsConsole } from "@/components/specialty/AchievementsConsole";

const specialty: Record<string, ComponentType> = {
  "/super-admin": SuperAdminCommand,
  "/franchises": FranchisesDashboard,
  "/crm": CRMConsole,
  "/accounting": AccountingConsole,
  "/api-manager": ApiManagerConsole,
  "/seo": SEOConsole,
  "/projects": ProjectsConsole,
  "/hrm": HRMConsole,
  "/marketplace": MarketplaceConsole,
  "/subscriptions": SubscriptionsConsole,
  "/security": SecurityConsole,
  "/apps": HomeApps,
  "/welcome": WelcomeConsole,
  "/executive": ExecutiveConsole,
  "/dashboard": ExecutiveConsole,
  "/analytics": AnalyticsConsole,
  "/reports": ReportsConsole,
  "/automation": AutomationConsole,
  "/support": SupportConsole,
  "/messaging": MessagingConsole,
  "/notifications": NotificationsConsole,
  "/profile": ProfileConsole,
  "/settings": SettingsConsole,
  "/audit": AuditConsole,
  "/trail": AuditConsole,
  "/roles": RolesConsole,
  "/knowledge": KnowledgeConsole,
  "/resellers": ResellersConsole,
  "/companies": CompaniesConsole,
  "/ai-studio": AIStudioConsole,
  "/copilot": CopilotConsole,
  "/invoices": InvoicesConsole,
  "/licenses": LicensesConsole,
  "/documents": DocumentsConsole,
  "/org-chart": OrgChartConsole,
  "/calendar": CalendarConsole,
  "/activity": ActivityConsole,
  "/favorites": FavoritesConsole,
  "/bookmarks": BookmarksConsole,
  "/goals": GoalsConsole,
  "/live": LiveConsole,
  "/heatmaps": HeatmapsConsole,
  "/offline": OfflineConsole,
  "/sessions": SessionsConsole,
  "/devices": DevicesConsole,
  "/threats": ThreatsConsole,
  "/wallet": WalletConsole,
  "/leaderboard": LeaderboardConsole,
  "/theme": ThemeConsole,
  "/mlm": MlmConsole,
  "/branches": BranchesConsole,
  "/recruitment": RecruitmentConsole,
  "/pos": PosConsole,
  "/erp": ErpConsole,
  "/inventory": InventoryConsole,
  "/manufacturing": ManufacturingConsole,
  "/achievements": AchievementsConsole,
};

export const Route = createFileRoute("/$")({
  component: SplatRoute,
});

function SplatRoute() {
  const params = Route.useParams() as { _splat?: string };
  const path = "/" + (params._splat ?? "");
  const Specialty = specialty[path];
  if (Specialty) return <Specialty />;
  const module = modules.find((m) => m.url === path || path.startsWith(m.url + "/"));

  if (module) {
    return <ModulePage module={module} />;
  }

  return (
    <div className="grid place-items-center py-24 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold">Module not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No module is registered for <code className="bg-muted px-1 rounded">{path}</code>.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}