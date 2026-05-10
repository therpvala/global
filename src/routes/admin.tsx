import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — SaaS Vala" },
      { name: "description", content: "Run the business: people, partners, organization." },
    ],
  }),
  component: () => <RoleDashboard role="admin" />,
});