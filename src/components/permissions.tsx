import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePermissions } from "@/lib/use-permissions";
import { useAuth } from "@/lib/auth";
import { recordPermEvent, type PermDecision, type PermSource } from "@/lib/perm-audit";

/** Writes a permission decision into the audit trail for the current user. */
export function usePermAudit() {
  const { user, roles } = useAuth();
  return (permission: string, decision: PermDecision, source: PermSource, detail?: string) =>
    recordPermEvent({
      actor: user?.email ?? "anonymous",
      roles,
      permission,
      decision,
      source,
      detail,
    });
}

/** Renders children only when the permission is granted. */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = usePermissions();
  return <>{can(permission) ? children : fallback}</>;
}

export function AccessDenied({ permission, label }: { permission: string; label?: string }) {
  return (
    <div className="grid place-items-center py-20">
      <Card className="max-w-md border-destructive/30">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {label ? `You don't have permission to open ${label}.` : "You don't have permission to view this area."}{" "}
            Required permission{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">{permission}</code>.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild size="sm">
              <Link to="/">Back to dashboard</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to={"/roles" as never}>Request access</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** Page-level gate: renders an access-denied screen when not permitted. */
export function RequirePermission({
  permission,
  label,
  children,
}: {
  permission: string;
  label?: string;
  children: ReactNode;
}) {
  const { can } = usePermissions();
  const allowed = can(permission);
  const audit = usePermAudit();
  useEffect(() => {
    audit(permission, allowed ? "granted" : "denied", "page", label ? `Opened ${label}` : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission, allowed, label]);
  if (!allowed) return <AccessDenied permission={permission} label={label} />;
  return <>{children}</>;
}

/**
 * Button that is disabled (with an explanatory tooltip) when the permission is
 * missing, so console actions can't be fired without the right grant.
 */
export function PermButton({
  permission,
  children,
  onClick,
  hideWhenDenied = false,
  ...props
}: ButtonProps & { permission: string; hideWhenDenied?: boolean }) {
  const { can } = usePermissions();
  const allowed = can(permission);
  const audit = usePermAudit();

  if (!allowed && hideWhenDenied) return null;

  const btn = (
    <Button
      {...props}
      aria-disabled={!allowed}
      data-permission={permission}
      className={props.className}
      onClick={(e) => {
        if (!allowed) {
          e.preventDefault();
          e.stopPropagation();
          audit(permission, "denied", "action", "Blocked console action");
          toast.error("Permission required", { description: permission });
          return;
        }
        audit(permission, "granted", "action", "Console action executed");
        onClick?.(e);
      }}
    >
      {!allowed && <Lock className="mr-1.5 h-3 w-3 opacity-70" />}
      {children}
    </Button>
  );

  if (allowed) return btn;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-not-allowed opacity-60">{btn}</span>
        </TooltipTrigger>
        <TooltipContent>Requires {permission}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
