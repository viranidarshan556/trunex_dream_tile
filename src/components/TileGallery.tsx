import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DEFAULT_TILES } from "@/lib/default-tiles";

export interface Tile {
  id: string;
  name: string;
  code: string;
  image_url: string;
  finish: string;
  size: string;
  room_types: string[];
  description: string | null;
}

interface Props {
  selectedId: string | null;
  onSelect: (tile: Tile) => void;
}

export function TileGallery({ selectedId, onSelect }: Props) {
  const [tiles, setTiles] = useState<Tile[]>(DEFAULT_TILES);

  useEffect(() => {
    supabase
      .from("tiles")
      .select("id, name, code, image_url, finish, size, room_types, description")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const dbTiles = (data as Tile[]) || [];
        setTiles([...dbTiles, ...DEFAULT_TILES]);
      });
  }, []);

  if (tiles.length === 0) return <p className="text-sm text-muted-foreground">No tiles available yet.</p>;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tiles.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t)}
          className={cn(
            "group overflow-hidden rounded-xl border bg-card text-left transition-all",
            selectedId === t.id ? "border-primary brand-glow ring-2 ring-primary" : "border-border hover:border-primary/60",
          )}
        >
          <div className="aspect-square overflow-hidden bg-muted">
            <img src={t.image_url} alt={t.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="p-2">
            <p className="truncate text-xs font-semibold">{t.name}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-[10px]">{t.size}</Badge>
              <Badge variant="outline" className="text-[10px] capitalize">{t.finish}</Badge>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
