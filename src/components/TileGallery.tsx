import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const FINISHES = ["all", "matte", "glossy", "anti_skid"];
const ROOMS = ["all", "bathroom", "living_room", "kitchen", "balcony", "bedroom"];

export function TileGallery({ selectedId, onSelect }: Props) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState("all");
  const [room, setRoom] = useState("all");

  useEffect(() => {
    supabase
      .from("tiles")
      .select("id, name, code, image_url, finish, size, room_types, description")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTiles((data as Tile[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      tiles.filter(
        (t) =>
          (finish === "all" || t.finish === finish) &&
          (room === "all" || t.room_types.includes(room)),
      ),
    [tiles, finish, room],
  );

  return (
    <div>
      <div className="mb-4 space-y-2">
        <Chips label="Finish" values={FINISHES} active={finish} onChange={setFinish} />
        <Chips label="Room" values={ROOMS} active={room} onChange={setRoom} />
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading tiles…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tiles match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t)}
              className={cn(
                "group overflow-hidden rounded-xl border bg-card text-left transition-all",
                selectedId === t.id ? "border-gold gold-glow ring-2 ring-gold" : "border-border/60 hover:border-gold/60",
              )}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={t.image_url} alt={t.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
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
      )}
    </div>
  );
}

function Chips({ label, values, active, onChange }: { label: string; values: string[]; active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <span className="shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs capitalize transition-colors",
            active === v ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground hover:text-foreground",
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
