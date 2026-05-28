import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-gold-gradient">
            {BRAND.name}
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            {BRAND.tagline}
          </span>
        </Link>
        <Link
          to="/login"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
