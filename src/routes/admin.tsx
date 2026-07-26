import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — SaaS Vala" },
      { name: "description", content: "Run the business: people, partners, organization." },
    ],
  }),
  component: () => (
    <RequirePermission permission="admin.view" label="the Admin dashboard">
      <RoleDashboard role="admin" />
    </RequirePermission>
  ),
});