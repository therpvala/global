import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/super-admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — SaaS Vala" },
      { name: "description", content: "Master operating control across the platform." },
    ],
  }),
  component: () => <RoleDashboard role="super_admin" />,
});