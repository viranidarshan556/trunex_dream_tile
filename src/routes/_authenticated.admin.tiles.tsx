import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { upsertTile, deleteTile } from "@/lib/admin.functions";

const FINISHES = ["matte", "glossy", "anti_skid"] as const;
const SIZES = ["2x2", "2x4", "plank"] as const;
const ROOMS = ["bathroom", "living_room", "kitchen", "balcony", "bedroom"] as const;

interface TileForm {
  id?: string;
  name: string;
  code: string;
  image_url: string;
  finish: (typeof FINISHES)[number];
  size: (typeof SIZES)[number];
  room_types: string[];
  description: string;
  active: boolean;
}

const empty: TileForm = { name: "", code: "", image_url: "", finish: "matte", size: "2x2", room_types: [], description: "", active: true };

export const Route = createFileRoute("/_authenticated/admin/tiles")({
  component: TilesPage,
});

function TilesPage() {
  const qc = useQueryClient();
  const upsert = useServerFn(upsertTile);
  const del = useServerFn(deleteTile);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TileForm>(empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: tiles, isLoading } = useQuery({
    queryKey: ["admin-tiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  function openNew() { setForm(empty); setOpen(true); }
  function openEdit(t: any) {
    setForm({ id: t.id, name: t.name, code: t.code, image_url: t.image_url, finish: t.finish, size: t.size, room_types: t.room_types || [], description: t.description ?? "", active: t.active });
    setOpen(true);
  }

  async function uploadTileImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("tile-images").upload(path, file, { contentType: file.type });
      if (error) throw error;
      const url = supabase.storage.from("tile-images").getPublicUrl(path).data.publicUrl;
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.name || !form.code || !form.image_url || form.room_types.length === 0) {
      toast.error("Fill all required fields and pick at least one room type"); return;
    }
    setBusy(true);
    try {
      await upsert({ data: { ...form, description: form.description || null } });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-tiles"] });
    } catch (e: any) { toast.error(e?.message || "Save failed"); }
    finally { setBusy(false); }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this tile?")) return;
    await del({ data: { id } });
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-tiles"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Tiles <span className="text-sm text-muted-foreground">({tiles?.length ?? 0})</span></h1>
        <Button onClick={openNew} className="gold-glow"><Plus className="mr-1 h-4 w-4" />Add tile</Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiles?.map((t: any) => (
            <div key={t.id} className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <img src={t.image_url} alt={t.name} className="aspect-square w-full object-cover" />
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.code} · {t.size} · {t.finish}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(t.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                {!t.active && <p className="mt-1 text-[10px] uppercase tracking-widest text-destructive">Inactive</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit tile" : "Add tile"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Code"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field label="Image">
              {form.image_url && <img src={form.image_url} alt="" className="mb-2 h-24 w-24 rounded-md object-cover" />}
              <Input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadTileImage(e.target.files[0])} />
              {uploading && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Finish">
                <select className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm" value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value as any })}>
                  {FINISHES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Size">
                <select className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value as any })}>
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Room types">
              <div className="flex flex-wrap gap-2">
                {ROOMS.map((r) => {
                  const on = form.room_types.includes(r);
                  return (
                    <button key={r} type="button"
                      onClick={() => setForm({ ...form, room_types: on ? form.room_types.filter((x) => x !== r) : [...form.room_types, r] })}
                      className={`rounded-full border px-3 py-1 text-xs ${on ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground"}`}>
                      {r}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></Field>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c })} />
              <Label>Active</Label>
            </div>
            <Button onClick={save} disabled={busy} className="w-full gold-glow">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
