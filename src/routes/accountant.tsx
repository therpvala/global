import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/accountant")({
  head: () => ({
    meta: [
      { title: "Accountant — SaaS Vala" },
      { name: "description", content: "Ledger, invoicing, payables, and reporting." },
    ],
  }),
  component: () => (
    <RequirePermission permission="accountant.view" label="the Accountant desk">
      <RoleDashboard role="accountant" />
    </RequirePermission>
  ),
});