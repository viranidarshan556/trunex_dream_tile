import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, f as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-DscuiET_.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$a = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TRUNEX — AI Tile Visualizer" },
      { name: "description", content: "See TRUNEX tiles rendered in your own room with AI." },
      { name: "author", content: "TRUNEX" },
      { property: "og:title", content: "TRUNEX — AI Tile Visualizer" },
      { property: "og:description", content: "See TRUNEX tiles rendered in your own room with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$a.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] });
}
const $$splitComponentImporter$9 = () => import("./self-design-Ddv72GKk.mjs");
const Route$9 = createFileRoute("/self-design")({
  head: () => ({
    meta: [{
      title: "Self Design — AI Tile Preview | TRUNEX"
    }, {
      name: "description",
      content: "Upload your room, pick a TRUNEX tile, and instantly see an AI-rendered preview."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./login-E25rXYki.mjs");
const Route$8 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Admin Login | TRUNEX"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./expert-design-8NPAUhmb.mjs");
const Route$7 = createFileRoute("/expert-design")({
  head: () => ({
    meta: [{
      title: "Expert Design — Free Tile Recommendation | TRUNEX"
    }, {
      name: "description",
      content: "Share your room photo and our TRUNEX experts will recommend the perfect tile on WhatsApp."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-B__rCetT.mjs");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "TRUNEX Group — Tiles, Doors & AI Tile Visualizer"
    }, {
      name: "description",
      content: "TRUNEX Group — Pan-India leader in tiles and doors for 12+ years. Try our AI tile visualizer to preview TRUNEX tiles in your own room instantly."
    }, {
      property: "og:title",
      content: "TRUNEX Group — Trusted by Next Generation"
    }, {
      property: "og:description",
      content: "Preview TRUNEX tiles in your own room with AI. India's fastest growing tiles & doors brand."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./result._id-BRuCnlmH.mjs");
const Route$5 = createFileRoute("/result/$id")({
  head: () => ({
    meta: [{
      title: "Your AI Tile Preview | TRUNEX"
    }, {
      name: "description",
      content: "Your personalized TRUNEX tile preview."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_authenticated.admin-DJKwMqVg.mjs");
const Route$4 = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_authenticated.admin.index-DQXqKvHx.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_authenticated.admin.tiles-77xcwE2l.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/tiles")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_authenticated.admin.leads-C3YRUFfA.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/leads")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("../_authenticated.admin.contacts-CPm6-Stw.mjs");
const Route = createFileRoute("/_authenticated/admin/contacts")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SelfDesignRoute = Route$9.update({
  id: "/self-design",
  path: "/self-design",
  getParentRoute: () => Route$a
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$a
});
const ExpertDesignRoute = Route$7.update({
  id: "/expert-design",
  path: "/expert-design",
  getParentRoute: () => Route$a
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const ResultIdRoute = Route$5.update({
  id: "/result/$id",
  path: "/result/$id",
  getParentRoute: () => Route$a
});
const AuthenticatedAdminRoute = Route$4.update({
  id: "/_authenticated/admin",
  path: "/admin",
  getParentRoute: () => Route$a
});
const AuthenticatedAdminIndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminTilesRoute = Route$2.update({
  id: "/tiles",
  path: "/tiles",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminLeadsRoute = Route$1.update({
  id: "/leads",
  path: "/leads",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminContactsRoute = Route.update({
  id: "/contacts",
  path: "/contacts",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminContactsRoute,
  AuthenticatedAdminLeadsRoute,
  AuthenticatedAdminTilesRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  ExpertDesignRoute,
  LoginRoute,
  SelfDesignRoute,
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  ResultIdRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
