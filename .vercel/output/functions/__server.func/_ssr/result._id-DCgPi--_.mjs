import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./createSsrRpc-DYlhEagM.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as SiteHeader } from "./SiteHeader-Dn_X5VxI.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { a as getLeadResult } from "./leads.functions-v3yNUiV1.mjs";
import { B as BRAND, a as TRUNEX_WHATSAPP } from "./constants-Dh7hZzwM.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, e as MessageSquareHeart, D as Download } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-BV-6dHeb.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
function ResultPage() {
  const {
    id
  } = useParams({
    from: "/result/$id"
  });
  const fn = useServerFn(getLeadResult);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["lead-result", id],
    queryFn: () => fn({
      data: {
        id
      }
    })
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(CenterMsg, { msg: "Loading your preview…" });
  if (error || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx(CenterMsg, { msg: "Could not load this preview." });
  const {
    lead,
    tile
  } = data;
  const waMsg = `Hi ${BRAND.name}, I previewed ${tile?.name ?? "a tile"} in my room and would like to know more. (Ref: ${lead.id.slice(0, 8)})`;
  const waUrl = `https://wa.me/${TRUNEX_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-3xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " Home"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[10px] uppercase tracking-[0.25em] text-gold", children: "Your AI Preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 font-display text-3xl", children: [
        "Hello ",
        lead.full_name.split(" ")[0],
        " —",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "here is your room."
      ] }),
      lead.generated_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border gold-border gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lead.generated_image_url, alt: "AI rendered preview", className: "w-full" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm", children: "Preview is still being generated. Refresh in a moment." }),
      lead.original_image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 uppercase tracking-widest", children: "Before" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lead.original_image_url, className: "rounded-lg border border-border/60", alt: "Original" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 uppercase tracking-widest", children: "After (AI)" }),
          lead.generated_image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lead.generated_image_url, className: "rounded-lg border border-border/60", alt: "After" })
        ] })
      ] }),
      tile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border/60 bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: tile.image_url, alt: tile.name, className: "h-20 w-20 rounded-lg object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl", children: tile.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Code: ",
              tile.code
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: tile.size }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: tile.finish })
            ] })
          ] })
        ] }),
        tile.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: tile.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waUrl, target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareHeart, { className: "mr-2 h-4 w-4" }),
          " Connect with ",
          BRAND.name
        ] }) }),
        lead.generated_image_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: lead.generated_image_url, download: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          " Download preview"
        ] }) })
      ] })
    ] })
  ] });
}
function CenterMsg({
  msg
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground", children: msg });
}
export {
  ResultPage as component
};
