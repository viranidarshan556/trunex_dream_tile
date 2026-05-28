import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Download, MessageSquareHeart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listLeads, deleteLead, updateLead } from "@/lib/admin.functions";
import { buildLeadFollowupUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const list = useServerFn(listLeads);
  const del = useServerFn(deleteLead);
  const upd = useServerFn(updateLead);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-leads"], queryFn: () => list() });
  const [q, setQ] = useState("");
  const [flt, setFlt] = useState<"all" | "hot" | "warm" | "cold" | "self" | "expert">("all");

  const leads = (data ?? []).filter((l: any) => {
    if (flt === "hot" || flt === "warm" || flt === "cold") return l.priority === flt;
    if (flt === "self" || flt === "expert") return l.flow_type === flt;
    return true;
  }).filter((l: any) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return l.full_name?.toLowerCase().includes(s) || l.contact_number?.includes(s) || l.city?.toLowerCase().includes(s);
  });

  function exportXlsx() {
    const rows = leads.map((l: any) => ({
      Date: new Date(l.created_at).toLocaleString(),
      Name: l.full_name,
      Mobile: l.contact_number,
      City: l.city,
      Sqft: l.sqft,
      Flow: l.flow_type,
      Priority: l.priority,
      Tile: l.tile?.name ?? "",
      TileCode: l.tile?.code ?? "",
      Status: l.status,
      Notes: l.notes ?? "",
      OriginalImage: l.original_image_url ?? "",
      GeneratedImage: l.generated_image_url ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `trunex-leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this lead?")) return;
    await del({ data: { id } });
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
  }

  async function onStatus(id: string, status: string) {
    await upd({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-2xl">Leads <span className="text-sm text-muted-foreground">({leads.length})</span></h1>
        <Button onClick={exportXlsx} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export Excel</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Search name, mobile, city…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        {(["all", "hot", "warm", "cold", "self", "expert"] as const).map((f) => (
          <button key={f} onClick={() => setFlt(f)}
            className={`rounded-full border px-3 py-1 text-xs capitalize ${flt === f ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {leads.map((l: any) => (
          <div key={l.id} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{l.full_name}</p>
                  <Badge variant={l.priority === "hot" ? "destructive" : "outline"} className="capitalize">{l.priority}</Badge>
                  <Badge variant="outline" className="capitalize">{l.flow_type}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  +91 {l.contact_number} · {l.city} · {l.sqft} sqft · {new Date(l.created_at).toLocaleString()}
                </p>
                {l.tile && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <img src={l.tile.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                    <span>{l.tile.name} ({l.tile.code})</span>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {l.original_image_url && <a className="text-gold underline" href={l.original_image_url} target="_blank" rel="noreferrer">Room photo</a>}
                  {l.generated_image_url && <a className="text-gold underline" href={l.generated_image_url} target="_blank" rel="noreferrer">AI preview</a>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="sm" className="gold-glow">
                  <a target="_blank" rel="noreferrer"
                    href={buildLeadFollowupUrl({ contact_number: l.contact_number, name: l.full_name, tileName: l.tile?.name })}>
                    <MessageSquareHeart className="mr-1 h-3 w-3" /> WhatsApp
                  </a>
                </Button>
                <select
                  value={l.status}
                  onChange={(e) => onStatus(l.id, e.target.value)}
                  className="rounded-md border border-border/60 bg-background px-2 py-1 text-xs"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
                <Button size="sm" variant="ghost" onClick={() => onDelete(l.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No leads yet.</p>}
      </div>
    </div>
  );
}
