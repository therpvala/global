import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminCommand } from "@/components/specialty/SuperAdminCommand";

export const Route = createFileRoute("/super-admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — SaaS Vala" },
      { name: "description", content: "Master operating control across the platform." },
    ],
  }),
  component: () => <SuperAdminCommand />,
});