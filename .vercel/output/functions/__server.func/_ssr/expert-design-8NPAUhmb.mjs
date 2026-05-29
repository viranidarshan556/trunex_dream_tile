import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./createSsrRpc-CVgcWAa8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SiteHeader } from "./SiteHeader-Dn_X5VxI.mjs";
import { R as RoomImagePicker, L as LeadFormFields, l as leadSchema, u as uploadRoomImage } from "./validation-Cx0rCNSc.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { c as createLead } from "./leads.functions-CLL7Dv36.mjs";
import { b as buildExpertWhatsAppUrl } from "./whatsapp-BVhti6wt.mjs";
import "../_libs/seroval.mjs";
import { c as LoaderCircle, e as MessageSquareHeart } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./server-Czlvuct_.mjs";
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
import "./client-DPzUWV4T.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/tailwind-merge.mjs";
function ExpertPage() {
  const createLeadFn = useServerFn(createLead);
  const [file, setFile] = reactExports.useState(null);
  const [values, setValues] = reactExports.useState({});
  const [errors, setErrors] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  async function handleSubmit() {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const e = {};
      for (const i of parsed.error.issues) e[i.path[0]] = i.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      let roomUrl;
      if (file) roomUrl = await uploadRoomImage(file);
      await createLeadFn({
        data: {
          ...parsed.data,
          flow_type: "expert",
          original_image_url: roomUrl ?? null,
          tile_id: null
        }
      });
      const url = buildExpertWhatsAppUrl({
        name: parsed.data.full_name,
        city: parsed.data.city,
        sqft: parsed.data.sqft,
        imageUrl: roomUrl
      });
      toast.success("Opening WhatsApp…");
      const w = window.open(url, "_blank");
      if (!w) window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Could not submit. Try again.");
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-gold", children: "Expert Design" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl", children: "Get a free recommendation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Share your room and a TRUNEX expert will reach out on WhatsApp with the perfect tile match." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs uppercase tracking-wider text-muted-foreground", children: "Room photo (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoomImagePicker, { value: file, onChange: setFile })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LeadFormFields, { values, errors, onChange: (v) => setValues((p) => ({
          ...p,
          ...v
        })) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full gold-glow", disabled: busy, onClick: handleSubmit, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Submitting…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareHeart, { className: "mr-2 h-4 w-4" }),
          "Connect on WhatsApp"
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ExpertPage as component
};
