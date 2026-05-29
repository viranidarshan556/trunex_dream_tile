import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-DYlhEagM.mjs";
import { u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { g as getStats } from "./_ssr/admin.functions-CHqIy9I0.mjs";
import "./_libs/seroval.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_ssr/server-BV-6dHeb.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/auth-middleware-BdMvRj_6.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/zod.mjs";
function Dashboard() {
  const fn = useServerFn(getStats);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fn()
  });
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl", children: "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Total leads", value: data.total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Today", value: data.today }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Self design", value: data.byFlow.self }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Expert design", value: data.byFlow.expert })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "By priority", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Hot (≥1500 sqft)", v: data.byPriority.hot, className: "text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Warm (600–1499)", v: data.byPriority.warm, className: "text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Cold (<600)", v: data.byPriority.cold })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Top cities", children: data.topCities.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {}) : data.topCities.map(([c, n]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: c, v: n }, c)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Top tiles", children: data.topTiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {}) : data.topTiles.map(([t, n]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: t.slice(0, 8), v: n }, t)) })
    ] })
  ] });
}
function Kpi({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border gold-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-display text-3xl text-gold-gradient", children: value })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs uppercase tracking-widest text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children })
  ] });
}
function Row({
  k,
  v,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: v })
  ] });
}
function Empty() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No data yet." });
}
export {
  Dashboard as component
};
