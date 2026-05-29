import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as TRUNEX_LOGO, B as BRAND } from "./constants-Dh7hZzwM.mjs";
function SiteHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: TRUNEX_LOGO, alt: "TRUNEX", className: "h-10 w-10 rounded-md object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-primary", children: BRAND.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block", children: BRAND.tagline })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-4 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#gallery", className: "text-muted-foreground hover:text-primary", children: "Gallery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#reviews", className: "hidden text-muted-foreground hover:text-primary sm:inline", children: "Reviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#contact", className: "text-muted-foreground hover:text-primary", children: "Contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "uppercase tracking-widest text-muted-foreground hover:text-primary", children: "Admin" })
    ] })
  ] }) });
}
export {
  SiteHeader as S
};
