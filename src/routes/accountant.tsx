import { createFileRoute } from "@tanstack/react-router";
import { RequirePermission } from "@/components/permissions";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/accountant")({
  head: () => ({
    meta: [
      { title: "Accountant — SaaS Vala" },
      { name: "description", content: "Ledger, invoicing, payables, and reporting." },
      { property: "og:title", content: "Accountant — SaaS Vala" },
      { property: "og:description", content: "Ledger, invoicing, payables, and reporting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequirePermission permission="accountant.view" label="the Accountant desk">
      <RoleDashboard role="accountant" />
    </RequirePermission>
  ),
});