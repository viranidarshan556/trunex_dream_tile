import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-DYlhEagM.mjs";
import { a as useQueryClient, u as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { u as utils, w as writeFileSync } from "./_libs/xlsx.mjs";
import { B as Button } from "./_ssr/button-DjOZMqFS.mjs";
import { B as Badge } from "./_ssr/badge-YM7oB01y.mjs";
import { I as Input } from "./_ssr/input-D_U8fI25.mjs";
import { u as updateLead, d as deleteLead, l as listLeads } from "./_ssr/admin.functions-CHqIy9I0.mjs";
import { a as buildLeadFollowupUrl } from "./_ssr/whatsapp-BVhti6wt.mjs";
import "./_libs/seroval.mjs";
import { D as Download, e as MessageSquareHeart, T as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
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
import "./_ssr/constants-Dh7hZzwM.mjs";
function LeadsPage() {
  const list = useServerFn(listLeads);
  const del = useServerFn(deleteLead);
  const upd = useServerFn(updateLead);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => list()
  });
  const [q, setQ] = reactExports.useState("");
  const [flt, setFlt] = reactExports.useState("all");
  const leads = (data ?? []).filter((l) => {
    if (flt === "hot" || flt === "warm" || flt === "cold") return l.priority === flt;
    if (flt === "self" || flt === "expert") return l.flow_type === flt;
    return true;
  }).filter((l) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return l.full_name?.toLowerCase().includes(s) || l.contact_number?.includes(s) || l.city?.toLowerCase().includes(s);
  });
  function exportXlsx() {
    const rows = leads.map((l) => ({
      Date: new Date(l.created_at).toLocaleString(),
      Name: l.full_name,
      Mobile: l.contact_number,
      City: l.city,
      Sqft: l.sqft,
      Flow: l.flow_type,
      Priority: l.priority,
      Tile: l.tile?.name ?? "",
      TileCode: l.tile?.code ?? "",
      Status: l.status,
      Notes: l.notes ?? "",
      OriginalImage: l.original_image_url ?? "",
      GeneratedImage: l.generated_image_url ?? ""
    }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Leads");
    writeFileSync(wb, `trunex-leads-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
  }
  async function onDelete(id) {
    if (!confirm("Delete this lead?")) return;
    await del({
      data: {
        id
      }
    });
    toast.success("Deleted");
    qc.invalidateQueries({
      queryKey: ["admin-leads"]
    });
  }
  async function onStatus(id, status) {
    await upd({
      data: {
        id,
        status
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-leads"]
    });
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl", children: [
        "Leads ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "(",
          leads.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportXlsx, variant: "outline", size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
        "Export Excel"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search name, mobile, city…", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-xs" }),
      ["all", "hot", "warm", "cold", "self", "expert"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFlt(f), className: `rounded-full border px-3 py-1 text-xs capitalize ${flt === f ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground"}`, children: f }, f))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      leads.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: l.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: l.priority === "hot" ? "destructive" : "outline", className: "capitalize", children: l.priority }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: l.flow_type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            "+91 ",
            l.contact_number,
            " · ",
            l.city,
            " · ",
            l.sqft,
            " sqft · ",
            new Date(l.created_at).toLocaleString()
          ] }),
          l.tile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: l.tile.image_url, alt: "", className: "h-8 w-8 rounded object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              l.tile.name,
              " (",
              l.tile.code,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-xs", children: [
            l.original_image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold underline", href: l.original_image_url, target: "_blank", rel: "noreferrer", children: "Room photo" }),
            l.generated_image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold underline", href: l.generated_image_url, target: "_blank", rel: "noreferrer", children: "AI preview" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { target: "_blank", rel: "noreferrer", href: buildLeadFollowupUrl({
            contact_number: l.contact_number,
            name: l.full_name,
            tileName: l.tile?.name
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareHeart, { className: "mr-1 h-3 w-3" }),
            " WhatsApp"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: l.status, onChange: (e) => onStatus(l.id, e.target.value), className: "rounded-md border border-border/60 bg-background px-2 py-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new", children: "New" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "contacted", children: "Contacted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "converted", children: "Converted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lost", children: "Lost" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => onDelete(l.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
        ] })
      ] }) }, l.id)),
      leads.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No leads yet." })
    ] })
  ] });
}
export {
  LeadsPage as component
};
