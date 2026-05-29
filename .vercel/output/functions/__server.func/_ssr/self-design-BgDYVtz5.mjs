import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./createSsrRpc-DYlhEagM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SiteHeader } from "./SiteHeader-Dn_X5VxI.mjs";
import { R as RoomImagePicker, L as LeadFormFields, l as leadSchema, u as uploadRoomImage } from "./validation-Cx0rCNSc.mjs";
import { s as supabase } from "./client-DPzUWV4T.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { D as DEFAULT_TILES } from "./default-tiles-BefLdNa_.mjs";
import { c as createLead, g as generatePreview } from "./leads.functions-v3yNUiV1.mjs";
import "../_libs/seroval.mjs";
import { c as LoaderCircle, g as Sparkles } from "../_libs/lucide-react.mjs";
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
import "./constants-Dh7hZzwM.mjs";
import "./input-D_U8fI25.mjs";
import "./label-C8WJLhmR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tailwind-merge.mjs";
function TileGallery({ selectedId, onSelect }) {
  const [tiles, setTiles] = reactExports.useState(DEFAULT_TILES);
  reactExports.useEffect(() => {
    supabase.from("tiles").select("id, name, code, image_url, finish, size, room_types, description").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => {
      const dbTiles = data || [];
      setTiles([...dbTiles, ...DEFAULT_TILES]);
    });
  }, []);
  if (tiles.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No tiles available yet." });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: tiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSelect(t),
      className: cn(
        "group overflow-hidden rounded-xl border bg-card text-left transition-all",
        selectedId === t.id ? "border-primary brand-glow ring-2 ring-primary" : "border-border hover:border-primary/60"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: t.image_url, alt: t.name, loading: "lazy", className: "h-full w-full object-cover transition-transform group-hover:scale-105" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-semibold", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: t.size }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] capitalize", children: t.finish })
          ] })
        ] })
      ]
    },
    t.id
  )) });
}
function SelfDesignPage() {
  const navigate = useNavigate();
  const createLeadFn = useServerFn(createLead);
  const generatePreviewFn = useServerFn(generatePreview);
  const [file, setFile] = reactExports.useState(null);
  const [tile, setTile] = reactExports.useState(null);
  const [values, setValues] = reactExports.useState({});
  const [errors, setErrors] = reactExports.useState({});
  const [step, setStep] = reactExports.useState("upload");
  const [busy, setBusy] = reactExports.useState(false);
  const [busyMsg, setBusyMsg] = reactExports.useState("");
  async function handleSubmit() {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const e = {};
      for (const i of parsed.error.issues) e[i.path[0]] = i.message;
      setErrors(e);
      return;
    }
    if (!file || !tile) return;
    setErrors({});
    setBusy(true);
    try {
      setBusyMsg("Uploading your room…");
      const roomUrl = await uploadRoomImage(file);
      const isDefault = tile.id.startsWith("default-");
      const tileAbsoluteUrl = isDefault ? `${window.location.origin}${tile.image_url}` : tile.image_url;
      setBusyMsg("Saving your details…");
      const lead = await createLeadFn({
        data: {
          ...parsed.data,
          flow_type: "self",
          tile_id: isDefault ? null : tile.id,
          original_image_url: roomUrl
        }
      });
      setBusyMsg("AI is rendering your tile preview…");
      await generatePreviewFn({
        data: isDefault ? {
          lead_id: lead.id,
          room_image_url: roomUrl,
          tile_image_url: tileAbsoluteUrl,
          tile_name: tile.name,
          tile_size: tile.size,
          tile_finish: tile.finish
        } : {
          lead_id: lead.id,
          room_image_url: roomUrl,
          tile_id: tile.id
        }
      });
      toast.success("Your preview is ready!");
      navigate({
        to: "/result/$id",
        params: {
          id: lead.id
        }
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-gold", children: "Self Design · AI Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl", children: "Visualize your floor" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stepper, { step }),
      step === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload a photo of the room you want to tile." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RoomImagePicker, { value: file, onChange: setFile }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: !file, onClick: () => setStep("tile"), children: "Continue" })
      ] }),
      step === "tile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Pick a tile to preview on your floor." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TileGallery, { selectedId: tile?.id ?? null, onSelect: setTile }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-3 z-30 flex gap-2 rounded-xl border gold-border bg-background/95 p-2 backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setStep("upload"), children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", disabled: !tile, onClick: () => setStep("details"), children: "Continue" })
        ] })
      ] }),
      step === "details" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "A few details so we can send you the rendered preview." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LeadFormFields, { values, errors, onChange: (v) => setValues((p) => ({
          ...p,
          ...v
        })) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setStep("tile"), disabled: busy, children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1 gold-glow", disabled: busy, onClick: handleSubmit, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            busyMsg
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
            "Generate AI Preview"
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function Stepper({
  step
}) {
  const idx = step === "upload" ? 0 : step === "tile" ? 1 : 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex items-center gap-2", children: ["Photo", "Tile", "Details"].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] ${i <= idx ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground"}`, children: i + 1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${i <= idx ? "text-foreground" : "text-muted-foreground"}`, children: s }),
    i < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-px flex-1 ${i < idx ? "bg-gold/50" : "bg-border/40"}` })
  ] }, s)) });
}
export {
  SelfDesignPage as component
};
