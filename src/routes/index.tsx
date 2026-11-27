import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enterprise Command Center — SaaS Vala" },
      { name: "description", content: "A role-aware command center for enterprise operations, teams, and business modules." },
      { property: "og:title", content: "Enterprise Command Center — SaaS Vala" },
      { property: "og:description", content: "A role-aware command center for enterprise operations, teams, and business modules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return <RoleDashboard />;
}
