import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/accountant")({
  head: () => ({
    meta: [
      { title: "Accountant — SaaS Vala" },
      { name: "description", content: "Ledger, invoicing, payables, and reporting." },
    ],
  }),
  component: () => <RoleDashboard role="accountant" />,
});