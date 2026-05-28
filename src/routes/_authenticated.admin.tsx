import { useEffect, useState } from "react";
import { createFileRoute, Outlet, redirect, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { LayoutDashboard, Users, LayoutGrid, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!roles);
      }
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-xl">Not authorized</p>
          <p className="mt-2 text-sm text-muted-foreground">{email} does not have admin access.</p>
          <Button className="mt-4" variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    );
  }

  const tabs: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/leads", label: "Leads", icon: Users },
    { to: "/admin/tiles", label: "Tiles", icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/admin" className="font-display text-lg text-gold-gradient">{BRAND.name} Admin</Link>
          <button onClick={signOut} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
        <nav className="container mx-auto flex gap-1 overflow-x-auto px-4 pb-2">
          {tabs.map((t) => {
            const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs",
                  active ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
