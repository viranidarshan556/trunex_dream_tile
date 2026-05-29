import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { L as Label } from "./label-C8WJLhmR.mjs";
import { s as supabase } from "./client-DPzUWV4T.mjs";
import { X, C as Camera, I as Image } from "../_libs/lucide-react.mjs";
import { o as objectType, c as coerce, s as stringType } from "../_libs/zod.mjs";
function RoomImagePicker({ value, onChange }) {
  const galleryRef = reactExports.useRef(null);
  const cameraRef = reactExports.useRef(null);
  const [preview, setPreview] = reactExports.useState(null);
  function handleFile(f) {
    onChange(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }
  if (value && preview) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border gold-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "Room", className: "aspect-[4/3] w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => handleFile(null),
          className: "absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background",
          "aria-label": "Remove",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: galleryRef,
        type: "file",
        accept: "image/*",
        hidden: true,
        onChange: (e) => handleFile(e.target.files?.[0] ?? null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: cameraRef,
        type: "file",
        accept: "image/*",
        capture: "environment",
        hidden: true,
        onChange: (e) => handleFile(e.target.files?.[0] ?? null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "h-32 flex-col gap-2 gold-border",
        onClick: () => cameraRef.current?.click(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Take photo" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "h-32 flex-col gap-2 gold-border",
        onClick: () => galleryRef.current?.click(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "From gallery" })
        ]
      }
    )
  ] });
}
function LeadFormFields({ values, errors, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", error: errors.full_name, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        value: values.full_name ?? "",
        onChange: (e) => onChange({ full_name: e.target.value }),
        placeholder: "Your name"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mobile number", error: errors.contact_number, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm", children: "+91" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "tel",
          inputMode: "numeric",
          maxLength: 10,
          className: "rounded-l-none",
          value: values.contact_number ?? "",
          onChange: (e) => onChange({ contact_number: e.target.value.replace(/\D/g, "") }),
          placeholder: "10-digit number"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Town / City", error: errors.city, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        value: values.city ?? "",
        onChange: (e) => onChange({ city: e.target.value }),
        placeholder: "e.g. Agartala"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Area to tile (sqft)", error: errors.sqft, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type: "number",
        inputMode: "numeric",
        min: 1,
        value: values.sqft ?? "",
        onChange: (e) => onChange({ sqft: e.target.value ? Number(e.target.value) : void 0 }),
        placeholder: "e.g. 800"
      }
    ) })
  ] });
}
function Field({ label, error, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
  ] });
}
async function uploadRoomImage(file) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("room-uploads").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("room-uploads").getPublicUrl(path);
  return data.publicUrl;
}
const leadSchema = objectType({
  full_name: stringType().trim().min(2, "Enter your full name").max(100),
  contact_number: stringType().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: stringType().trim().min(2, "Enter your town/city").max(80),
  sqft: coerce.number().int().positive("Enter valid square feet").max(1e5)
});
export {
  LeadFormFields as L,
  RoomImagePicker as R,
  leadSchema as l,
  uploadRoomImage as u
};
