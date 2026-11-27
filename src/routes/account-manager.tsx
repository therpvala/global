import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/account-manager")({
  head: () => ({
    meta: [
      { title: "Account Manager — SaaS Vala" },
      { name: "description", content: "Customers, contracts, renewals, partners." },
      { property: "og:title", content: "Account Manager — SaaS Vala" },
      { property: "og:description", content: "Customers, contracts, renewals, partners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequirePermission permission="account-manager.view" label="the Account Manager hub">
      <RoleDashboard role="account_manager" />
    </RequirePermission>
  ),
});