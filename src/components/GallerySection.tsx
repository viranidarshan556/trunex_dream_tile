import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Tile {
  id: string;
  name: string;
  image_url: string;
  finish: string;
  size: string;
}

export function GallerySection() {
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    supabase
      .from("tiles")
      .select("id, name, image_url, finish, size")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setTiles((data as Tile[]) || []));
  }, []);

  return (
    <section id="gallery" className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">Our Collection</p>
        <h2 className="mt-1 font-display text-3xl text-primary">Tile Gallery</h2>
        <p className="mt-2 text-sm text-muted-foreground">Explore our latest TRUNEX tile designs available pan-India.</p>
      </div>
      {tiles.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">New tiles coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.id} className="group overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={t.image_url} alt={t.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-primary">{t.name}</p>
                <div className="mt-1 flex gap-1">
                  <Badge variant="outline" className="text-[10px]">{t.size}</Badge>
                  <Badge variant="outline" className="text-[10px] capitalize">{t.finish}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link to="/self-design" className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          Try a tile in your room with AI →
        </Link>
      </div>
    </section>
  );
}
