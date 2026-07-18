import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, type AppRole } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SaaS Vala" }] }),
  component: LoginPage,
});

const roles: { label: string; value: AppRole }[] = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Accountant", value: "accountant" },
  { label: "Account Manager", value: "account_manager" },
  { label: "User", value: "user" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@vala.app");
  const [role, setRole] = useState<AppRole>("admin");

  return (
    <div
      className="min-h-screen grid place-items-center p-6"
      style={{ backgroundImage: "var(--gradient-surface)" }}
    >
      <Card className="w-full max-w-md border-border/60 shadow-[var(--shadow-elegant)]">
        <CardHeader className="space-y-2 text-center">
          <div
            className="mx-auto grid h-12 w-12 place-items-center rounded-xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Sign in to SaaS Vala</CardTitle>
          <p className="text-xs text-muted-foreground">Enterprise Operating System</p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login(email, [role]);
              navigate({ to: "/dashboard" as any });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role (demo)</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as AppRole)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Demo auth — wire Lovable Cloud for real sign-in.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}