import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, u as useLocation, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { s as supabase } from "./_ssr/client-DPzUWV4T.mjs";
import { B as Button, c as cn } from "./_ssr/button-DjOZMqFS.mjs";
import { B as BRAND } from "./_ssr/constants-Dh7hZzwM.mjs";
import { c as LoaderCircle, d as LogOut, L as LayoutDashboard, U as Users, b as LayoutGrid, M as Mail } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/tslib.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(null);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({
          to: "/login"
        });
        return;
      }
      setEmail(data.user.email ?? null);
      const {
        data: roles
      } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!roles);
    })();
  }, [navigate]);
  async function signOut() {
    await supabase.auth.signOut();
    navigate({
      to: "/login"
    });
  }
  if (isAdmin === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-gold" }) });
  }
  if (isAdmin === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: "Not authorized" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
        email,
        " does not have admin access."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", variant: "outline", onClick: signOut, children: "Sign out" })
    ] }) });
  }
  const tabs = [{
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true
  }, {
    to: "/admin/leads",
    label: "Leads",
    icon: Users
  }, {
    to: "/admin/tiles",
    label: "Tiles",
    icon: LayoutGrid
  }, {
    to: "/admin/contacts",
    label: "Contacts",
    icon: Mail
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex h-14 items-center justify-between px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "font-display text-lg text-gold-gradient", children: [
          BRAND.name,
          " Admin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
          " Sign out"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "container mx-auto flex gap-1 overflow-x-auto px-4 pb-2", children: tabs.map((t) => {
        const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs", active ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground hover:text-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-3.5 w-3.5" }),
          " ",
          t.label
        ] }, t.to);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
