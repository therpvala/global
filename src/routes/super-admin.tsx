import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { SuperAdminCommand } from "@/components/specialty/SuperAdminCommand";

export const Route = createFileRoute("/super-admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — SaaS Vala" },
      { name: "description", content: "Master operating control across the platform." },
    ],
  }),
  component: () => (
    <RequirePermission permission="super-admin.view" label="the Super Admin command center">
      <SuperAdminCommand />
    </RequirePermission>
  ),
});