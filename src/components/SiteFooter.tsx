import { BRAND } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-10 text-center text-xs text-muted-foreground">
      <p className="font-display text-base text-gold-gradient">{BRAND.name}</p>
      <p className="mt-1">{BRAND.city} · © {new Date().getFullYear()}</p>
    </footer>
  );
}
