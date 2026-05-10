import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager — SaaS Vala" },
      { name: "description", content: "Operational execution across sales, projects, and people." },
    ],
  }),
  component: () => <RoleDashboard role="manager" />,
});