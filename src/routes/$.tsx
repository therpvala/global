import { createFileRoute, Link } from "@tanstack/react-router";
import { modules } from "@/lib/modules";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { SuperAdminCommand } from "@/components/specialty/SuperAdminCommand";
import { FranchisesDashboard } from "@/components/specialty/FranchisesDashboard";

const specialty: Record<string, React.ComponentType> = {
  "/super-admin": SuperAdminCommand,
  "/franchises": FranchisesDashboard,
};

export const Route = createFileRoute("/$")({
  component: SplatRoute,
});

function SplatRoute() {
  const params = Route.useParams() as { _splat?: string };
  const path = "/" + (params._splat ?? "");
  const Specialty = specialty[path];
  if (Specialty) return <Specialty />;
  const module = modules.find((m) => m.url === path || path.startsWith(m.url + "/"));

  if (module) {
    return <ModulePage module={module} />;
  }

  return (
    <div className="grid place-items-center py-24 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold">Module not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No module is registered for <code className="bg-muted px-1 rounded">{path}</code>.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}