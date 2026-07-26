import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager — SaaS Vala" },
      { name: "description", content: "Operational execution across sales, projects, and people." },
    ],
  }),
  component: () => (
    <RequirePermission permission="manager.view" label="the Manager workspace">
      <RoleDashboard role="manager" />
    </RequirePermission>
  ),
});