import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — SaaS Vala" },
      { name: "description", content: "Run the business: people, partners, organization." },
      { property: "og:title", content: "Admin — SaaS Vala" },
      { property: "og:description", content: "Run the business: people, partners, organization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequirePermission permission="admin.view" label="the Admin dashboard">
      <RoleDashboard role="admin" />
    </RequirePermission>
  ),
});