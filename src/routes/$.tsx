import type { ComponentType } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { resolveModulePath, normalizeModulePath } from "@/lib/module-resolver";
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
import { RoleSimulatorConsole, PermissionAuditConsole } from "@/components/specialty/access-lab";
import { RoleComparisonConsole } from "@/components/specialty/role-compare";
import { AchievementsConsole } from "@/components/specialty/AchievementsConsole";
import { RequirePermission } from "@/components/permissions";
import { moduleKeyFromUrl } from "@/lib/permissions";

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
  "/role-simulator": RoleSimulatorConsole,
  "/permission-audit": PermissionAuditConsole,
  "/role-compare": RoleComparisonConsole,
};

export const Route = createFileRoute("/$")({
  component: SplatRoute,
});

function SplatRoute() {
  const params = Route.useParams() as { _splat?: string };
  const path = "/" + (params._splat ?? "");
  const resolution = resolveModulePath(path);
  const directSpecialty = specialty[path];

  // Known-but-non-canonical path (alias, casing, trailing slash, bare slug):
  // send the user to the canonical module route so the workspace always opens.
  if (resolution.status === "redirect" && !directSpecialty) {
    return <Navigate to={resolution.target as never} replace />;
  }

  const module = resolution.module;
  const canonical = module ? normalizeModulePath(module.url) : normalizeModulePath(path);
  const Specialty = specialty[canonical] ?? specialty[path];
  const key = moduleKeyFromUrl(canonical);
  const permission = `${key}.view`;

  if (Specialty) {
    return (
      <RequirePermission permission={permission} label={module?.title ?? path}>
        <Specialty />
      </RequirePermission>
    );
  }

  if (module) {
    return (
      <RequirePermission permission={permission} label={module.title}>
        <ModulePage module={module} />
      </RequirePermission>
    );
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