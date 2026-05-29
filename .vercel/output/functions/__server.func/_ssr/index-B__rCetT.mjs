import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader } from "./SiteHeader-Dn_X5VxI.mjs";
import { T as TRUNEX_LOGO, B as BRAND, a as TRUNEX_WHATSAPP } from "./constants-Dh7hZzwM.mjs";
import { s as supabase } from "./client-DPzUWV4T.mjs";
import { B as Badge } from "./badge-YM7oB01y.mjs";
import { D as DEFAULT_TILES } from "./default-tiles-BefLdNa_.mjs";
import { u as useServerFn } from "./createSsrRpc-CVgcWAa8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Input } from "./input-D_U8fI25.mjs";
import { T as Textarea } from "./textarea-F69quoCd.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { s as submitContact } from "./contact.functions-C0RqJp6X.mjs";
import "../_libs/seroval.mjs";
import { g as Sparkles, e as MessageSquareHeart, a as ArrowRight, h as Star, c as LoaderCircle, S as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./server-Czlvuct_.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/tailwind-merge.mjs";
import "./auth-middleware-C4O3ZJj-.mjs";
import "../_libs/zod.mjs";
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border bg-secondary/40 mt-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto grid gap-8 px-4 py-12 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: TRUNEX_LOGO, alt: "TRUNEX", className: "h-12 w-12 rounded-md object-contain bg-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-primary", children: BRAND.group }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: BRAND.tagline })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground leading-relaxed", children: [
          "For the last ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "12+ years" }),
          ", TRUNEX Group has been a trusted expert in building materials across India. We are the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "fastest growing brand" }),
          " in doors and tiles — serving thousands of homes, builders and architects pan-India with premium quality, modern designs and unmatched service."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-primary font-semibold", children: "Our Expertise" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Premium Vitrified Tiles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Designer Wooden Doors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bathroom & Kitchen Ranges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Pan-India Distribution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• AI-powered Tile Visualization" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-primary font-semibold", children: "Reach Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "WhatsApp: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${TRUNEX_WHATSAPP}`, className: "text-primary hover:underline", children: "+91 87988 21619" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "Email: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${BRAND.notifyEmail}`, className: "text-primary hover:underline", children: BRAND.notifyEmail })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "Coverage: ",
            BRAND.city
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border py-4 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " ",
      BRAND.group,
      " · Trusted by Next Generation"
    ] })
  ] });
}
function GallerySection() {
  const [tiles, setTiles] = reactExports.useState(DEFAULT_TILES);
  reactExports.useEffect(() => {
    supabase.from("tiles").select("id, name, image_url, finish, size").eq("active", true).order("created_at", { ascending: false }).limit(12).then(({ data }) => {
      const dbTiles = data || [];
      setTiles([...dbTiles, ...DEFAULT_TILES].slice(0, 12));
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "gallery", className: "container mx-auto px-4 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-primary font-semibold", children: "Our Collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-3xl text-primary", children: "Tile Gallery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Explore our latest TRUNEX tile designs available pan-India." })
    ] }),
    tiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "New tiles coming soon." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4", children: tiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group overflow-hidden rounded-xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: t.image_url, alt: t.name, loading: "lazy", className: "h-full w-full object-cover transition-transform group-hover:scale-105" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-primary", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: t.size }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] capitalize", children: t.finish })
        ] })
      ] })
    ] }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/self-design", className: "inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90", children: "Try a tile in your room with AI →" }) })
  ] });
}
const REVIEWS = [
  { name: "Rahul Sharma", city: "Delhi", lang: "Hindi", text: "TRUNEX के tiles मेरे घर में लगवाए, finish बहुत premium है और AI preview से colour चुनना बहुत आसान हो गया।" },
  { name: "Subrata Das", city: "Kolkata", lang: "Bengali", text: "আমার নতুন বাড়ির জন্য TRUNEX এর টাইলস নিয়েছি, কোয়ালিটি অসাধারণ এবং ডেলিভারি খুব দ্রুত হয়েছে।" },
  { name: "Pranab Borah", city: "Guwahati", lang: "Assamese", text: "TRUNEX-ৰ টাইল আৰু দুৱাৰ দুয়োটা অতি উচ্চ মানৰ। গ্ৰাহক সেৱা অতি ভাল আৰু দাম যুক্তিযুক্ত।" },
  { name: "Anita Verma", city: "Lucknow", lang: "Hindi", text: "Bathroom के लिए anti-skid tile choose किया, AI में पहले देखा फिर order किया — exactly वैसा ही मिला!" },
  { name: "Mithun Roy", city: "Siliguri", lang: "Bengali", text: "১২ বছরের অভিজ্ঞ ব্র্যান্ড, বিশ্বাস করা যায়। দরজা গুলোর কাঠের কাজ দারুণ সুন্দর।" },
  { name: "Hiren Saikia", city: "Dibrugarh", lang: "Assamese", text: "Pan India ত সকলো ঠাইতে delivery কৰে, আমাৰ বাবে এইটো ডাঙৰ সুবিধা। TRUNEX best brand!" },
  { name: "Priya Singh", city: "Patna", lang: "Hindi", text: "Builder हूँ, पिछले 3 साल से TRUNEX से tiles ले रहा हूँ — quality consistent है और pricing competitive।" },
  { name: "Sayan Ghosh", city: "Howrah", lang: "Bengali", text: "Living room এ marble finish tile বসিয়েছি, অতিথিরা সবাই প্রশংসা করেছে। ধন্যবাদ TRUNEX!" }
];
function ReviewsMarquee() {
  const loop = [...REVIEWS, ...REVIEWS];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "reviews", className: "border-y border-border bg-secondary/40 py-12 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-primary font-semibold", children: "Trusted by 10,000+ families" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-3xl text-primary", children: "What our customers say" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-max gap-4 animate-marquee", children: loop.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "w-[320px] shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 text-accent", children: Array.from({ length: 5 }).map((_, k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm leading-relaxed text-foreground", children: [
        '"',
        r.text,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          r.city,
          " · ",
          r.lang
        ] })
      ] })
    ] }, i)) }) })
  ] });
}
function ContactForm() {
  const submit = useServerFn(submitContact);
  const [busy, setBusy] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ full_name: "", contact_number: "", email: "", message: "" });
  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await submit({ data: form });
      toast.success("Thank you! We'll get back to you shortly.");
      setForm({ full_name: "", contact_number: "", email: "", message: "" });
    } catch (err) {
      toast.error(err?.message || "Failed to send. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "contact", className: "container mx-auto max-w-xl px-4 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.25em] text-primary font-semibold", children: "Get in touch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-3xl text-primary", children: "Contact us" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Have questions about tiles, doors, or bulk orders? Send us a message — our team will reach out." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Full name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.full_name, onChange: (e) => setForm({ ...form, full_name: e.target.value }), placeholder: "Your name" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Mobile number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.contact_number, onChange: (e) => setForm({ ...form, contact_number: e.target.value.replace(/\D/g, "").slice(0, 10) }), placeholder: "10-digit mobile", inputMode: "numeric" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Email (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), placeholder: "you@email.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { required: true, value: form.message, onChange: (e) => setForm({ ...form, message: e.target.value }), placeholder: "How can we help?", rows: 4 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Sending…"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
        "Send Message"
      ] }) })
    ] })
  ] });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden px-4 pt-12 pb-12 sm:pt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-50", style: {
        background: "radial-gradient(ellipse at top, oklch(0.85 0.06 258 / 0.5), transparent 60%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-4xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: TRUNEX_LOGO, alt: "TRUNEX Group", className: "mx-auto h-20 w-20 rounded-xl object-contain bg-white shadow-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-5 inline-flex items-center gap-1.5 rounded-full border brand-border bg-card px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " AI-Powered Tile Visualization"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 font-display text-4xl font-bold leading-[1.05] text-primary sm:text-6xl", children: [
          "See ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand-gradient", children: BRAND.name }),
          " tiles",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "in your own room."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base", children: "Pan-India's fastest growing tiles & doors brand. Upload a photo, pick a tile, watch AI render your dream floor in seconds." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-8 sm:pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto grid max-w-4xl gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowCard, { to: "/self-design", badge: "Self Design", title: "Visualize it yourself", desc: "Choose any tile from our gallery and instantly preview it in your room using AI.", cta: "Try AI Preview", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }), accent: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowCard, { to: "/expert-design", badge: "Expert Design", title: "Talk to a TRUNEX expert", desc: "Get a free personalized tile recommendation from our team on WhatsApp.", cta: "Get Recommendation", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareHeart, { className: "h-5 w-5" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto grid max-w-4xl gap-6 text-center sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: "1", t: "Upload", d: "Snap or upload your room photo." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: "2", t: "Choose", d: "Pick a TRUNEX tile you love." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: "3", t: "Visualize", d: "See it rendered in seconds." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GallerySection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsMarquee, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContactForm, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
function FlowCard({
  to,
  badge,
  title,
  desc,
  cta,
  icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: `group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-0.5 ${accent ? "brand-border brand-glow bg-card" : "border-border bg-card"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`, children: [
      icon,
      " ",
      badge
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-primary", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `mt-auto inline-flex items-center gap-1.5 text-sm font-medium ${accent ? "text-primary" : "text-foreground"}`, children: [
      cta,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
    ] })
  ] });
}
function Step({
  n,
  t,
  d
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-10 w-10 items-center justify-center rounded-full brand-border bg-card font-display text-primary", children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-primary", children: t }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d })
  ] });
}
export {
  Index as component
};
