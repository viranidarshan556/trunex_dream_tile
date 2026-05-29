import { Link } from "@tanstack/react-router";
import { BRAND, TRUNEX_LOGO } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={TRUNEX_LOGO} alt="TRUNEX" className="h-10 w-10 rounded-md object-contain" />
          <div className="leading-tight">
            <p className="font-display text-xl font-bold text-primary">{BRAND.name}</p>
            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              {BRAND.tagline}
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-xs">
          <a href="#gallery" className="text-muted-foreground hover:text-primary">Gallery</a>
          <a href="#reviews" className="hidden text-muted-foreground hover:text-primary sm:inline">Reviews</a>
          <a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a>
          <Link to="/login" className="uppercase tracking-widest text-muted-foreground hover:text-primary">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
