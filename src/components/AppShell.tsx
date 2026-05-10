import { type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Command, LogOut, Bell } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { modules } from "@/lib/modules";
import { useAuth, type AppRole } from "@/lib/auth";

const roleOptions: { label: string; roles: AppRole[] }[] = [
  { label: "Super Admin", roles: ["super_admin"] },
  { label: "Admin", roles: ["admin"] },
  { label: "Manager", roles: ["manager"] },
  { label: "Accountant", roles: ["accountant"] },
  { label: "Account Manager", roles: ["account_manager"] },
  { label: "User", roles: ["user"] },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, roles, logout, setRoles, primaryRole } = useAuth();
  const navigate = useNavigate();
  const current = modules.find(
    (m) => pathname === m.url || pathname.startsWith(m.url + "/"),
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/70 bg-background/80 backdrop-blur px-4">
            <SidebarTrigger />
            {current ? (
              <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="opacity-50">/</span>
                <span>{current.group}</span>
                <span className="opacity-50">/</span>
                <span className="text-foreground font-medium">{current.title}</span>
              </nav>
            ) : (
              <span className="hidden md:inline text-xs text-muted-foreground">
                {primaryRole.replace("_", " ")} workspace
              </span>
            )}

            <div className="relative ml-auto hidden md:block w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search modules…"
                className="pl-9 pr-12 h-9 bg-muted/40"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 capitalize">
                  <Badge variant="secondary" className="px-1.5 py-0">
                    role
                  </Badge>
                  <span className="hidden sm:inline">{primaryRole.replace("_", " ")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roleOptions.map((r) => (
                  <DropdownMenuItem
                    key={r.label}
                    onClick={() => setRoles(r.roles)}
                    className={roles[0] === r.roles[0] ? "bg-accent" : ""}
                  >
                    {r.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative" aria-label="Account menu">
                  <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary transition">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {user?.email?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.email ?? "Guest"}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {roles.join(", ").replaceAll("_", " ")}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={"/profile" as any}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={"/settings" as any}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    navigate({ to: "/login" as any });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 p-4 md:p-6 animate-in fade-in duration-200">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}