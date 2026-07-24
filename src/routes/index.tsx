import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <RoleDashboard />;
}
