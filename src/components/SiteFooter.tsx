import { BRAND, TRUNEX_LOGO, TRUNEX_PHONE_DISPLAY, TRUNEX_WHATSAPP } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-16">
      <div className="container mx-auto grid gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={TRUNEX_LOGO} alt="TRUNEX" className="h-12 w-12 rounded-md object-contain bg-white" />
            <div>
              <p className="font-display text-xl font-bold text-primary">{BRAND.group}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{BRAND.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            For the last <span className="font-semibold text-primary">12+ years</span>, TRUNEX Group has been a trusted
            expert in building materials across India. We are the <span className="font-semibold text-primary">fastest growing brand</span> in
            doors and tiles — serving thousands of homes, builders and architects pan-India with premium quality,
            modern designs and unmatched service.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Our Expertise</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Premium Vitrified Tiles</li>
            <li>• Designer Wooden Doors</li>
            <li>• Bathroom & Kitchen Ranges</li>
            <li>• Pan-India Distribution</li>
            <li>• AI-powered Tile Visualization</li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Reach Us</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>WhatsApp: <a href={`https://wa.me/${TRUNEX_WHATSAPP}`} className="text-primary hover:underline">{TRUNEX_PHONE_DISPLAY}</a></li>
            <li>Email: <a href={`mailto:${BRAND.notifyEmail}`} className="text-primary hover:underline">{BRAND.notifyEmail}</a></li>
            <li>Coverage: {BRAND.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND.group} · Trusted by Next Generation
      </div>
    </footer>
  );
}
