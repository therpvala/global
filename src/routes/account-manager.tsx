import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/account-manager")({
  head: () => ({
    meta: [
      { title: "Account Manager — SaaS Vala" },
      { name: "description", content: "Customers, contracts, renewals, partners." },
    ],
  }),
  component: () => <RoleDashboard role="account_manager" />,
});