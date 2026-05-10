import type { AppRole } from "./auth";
import { modules, type ModuleItem } from "./modules";

export interface RoleConfig {
  role: AppRole;
  title: string;
  subtitle: string;
  kpis: { label: string; value: string; delta?: string; tone?: "up" | "down" | "neutral" }[];
  /** Module groups (from modules.ts) to show on this dashboard, in order */
  groups: string[];
}

export const roleConfigs: Record<AppRole, RoleConfig> = {
  super_admin: {
    role: "super_admin",
    title: "Super Admin Command Center",
    subtitle: "Master operating control across every tenant, branch, and module",
    kpis: [
      { label: "Tenants", value: "248", delta: "+12 this month", tone: "up" },
      { label: "Active users", value: "8,412", delta: "+4.2%", tone: "up" },
      { label: "MRR", value: "$184K", delta: "+9.1%", tone: "up" },
      { label: "Critical alerts", value: "3", delta: "-2", tone: "down" },
    ],
    groups: ["Master", "Overview", "Organization", "Security", "Platform", "Insights"],
  },
  admin: {
    role: "admin",
    title: "Admin Dashboard",
    subtitle: "Run the business: people, partners, organization, automation",
    kpis: [
      { label: "Employees", value: "312", delta: "+6", tone: "up" },
      { label: "Open approvals", value: "14", tone: "neutral" },
      { label: "Active workflows", value: "27", tone: "neutral" },
      { label: "Uptime", value: "99.98%", tone: "up" },
    ],
    groups: ["Overview", "People", "Partners", "Organization", "Platform", "Security"],
  },
  manager: {
    role: "manager",
    title: "Manager Workspace",
    subtitle: "Operational execution across sales, projects, and people",
    kpis: [
      { label: "Pipeline", value: "$1.2M", delta: "+8%", tone: "up" },
      { label: "Open tasks", value: "47", tone: "neutral" },
      { label: "Team capacity", value: "82%", tone: "up" },
      { label: "Blockers", value: "2", tone: "down" },
    ],
    groups: ["Overview", "Sales", "Operations", "People", "Insights"],
  },
  accountant: {
    role: "accountant",
    title: "Accountant Desk",
    subtitle: "Ledger, invoicing, payables, and financial reporting",
    kpis: [
      { label: "Revenue MTD", value: "$94K", delta: "+11%", tone: "up" },
      { label: "Outstanding AR", value: "$28K", tone: "neutral" },
      { label: "Bills due", value: "9", tone: "down" },
      { label: "Reconciled", value: "96%", tone: "up" },
    ],
    groups: ["Overview", "Finance", "Sales", "Insights"],
  },
  account_manager: {
    role: "account_manager",
    title: "Account Manager Hub",
    subtitle: "Customers, contracts, renewals, and channel partners",
    kpis: [
      { label: "Accounts", value: "142", delta: "+5", tone: "up" },
      { label: "Renewals (30d)", value: "18", tone: "neutral" },
      { label: "At-risk", value: "4", tone: "down" },
      { label: "NPS", value: "62", delta: "+3", tone: "up" },
    ],
    groups: ["Overview", "Sales", "Partners", "Platform"],
  },
  user: {
    role: "user",
    title: "Welcome",
    subtitle: "Your personal workspace",
    kpis: [
      { label: "Tasks", value: "6", tone: "neutral" },
      { label: "Messages", value: "3", tone: "neutral" },
      { label: "Events today", value: "2", tone: "neutral" },
      { label: "Favorites", value: "8", tone: "neutral" },
    ],
    groups: ["Overview", "System"],
  },
};

export function modulesForGroups(groups: string[]): { group: string; items: ModuleItem[] }[] {
  return groups
    .map((g) => ({ group: g, items: modules.filter((m) => m.group === g) }))
    .filter((g) => g.items.length > 0);
}