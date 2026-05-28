import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageSquareHeart, Download } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLeadResult } from "@/lib/leads.functions";
import { TRUNEX_WHATSAPP, BRAND } from "@/lib/constants";

export const Route = createFileRoute("/result/$id")({
  head: () => ({
    meta: [
      { title: "Your AI Tile Preview | TRUNEX" },
      { name: "description", content: "Your personalized TRUNEX tile preview." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { id } = useParams({ from: "/result/$id" });
  const fn = useServerFn(getLeadResult);
  const { data, isLoading, error } = useQuery({
    queryKey: ["lead-result", id],
    queryFn: () => fn({ data: { id } }),
  });

  if (isLoading) return <CenterMsg msg="Loading your preview…" />;
  if (error || !data) return <CenterMsg msg="Could not load this preview." />;

  const { lead, tile } = data;
  const waMsg = `Hi ${BRAND.name}, I previewed ${tile?.name ?? "a tile"} in my room and would like to know more. (Ref: ${lead.id.slice(0, 8)})`;
  const waUrl = `https://wa.me/${TRUNEX_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="min-h-screen pb-24">
      <SiteHeader />
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Home
        </Link>

        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-gold">Your AI Preview</p>
        <h1 className="mt-1 font-display text-3xl">Hello {lead.full_name.split(" ")[0]} —<br/>here is your room.</h1>

        {lead.generated_image_url ? (
          <div className="mt-6 overflow-hidden rounded-2xl border gold-border gold-glow">
            <img src={lead.generated_image_url} alt="AI rendered preview" className="w-full" />
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">Preview is still being generated. Refresh in a moment.</p>
        )}

        {lead.original_image_url && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <p className="mb-1 uppercase tracking-widest">Before</p>
              <img src={lead.original_image_url} className="rounded-lg border border-border/60" alt="Original" />
            </div>
            <div>
              <p className="mb-1 uppercase tracking-widest">After (AI)</p>
              {lead.generated_image_url && <img src={lead.generated_image_url} className="rounded-lg border border-border/60" alt="After" />}
            </div>
          </div>
        )}

        {tile && (
          <div className="mt-6 rounded-2xl border border-border/60 bg-card p-4">
            <div className="flex gap-4">
              <img src={tile.image_url} alt={tile.name} className="h-20 w-20 rounded-lg object-cover" />
              <div>
                <p className="font-display text-xl">{tile.name}</p>
                <p className="text-xs text-muted-foreground">Code: {tile.code}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="outline">{tile.size}</Badge>
                  <Badge variant="outline" className="capitalize">{tile.finish}</Badge>
                </div>
              </div>
            </div>
            {tile.description && <p className="mt-3 text-sm text-muted-foreground">{tile.description}</p>}
          </div>
        )}

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button asChild className="gold-glow">
            <a href={waUrl} target="_blank" rel="noreferrer">
              <MessageSquareHeart className="mr-2 h-4 w-4" /> Connect with {BRAND.name}
            </a>
          </Button>
          {lead.generated_image_url && (
            <Button asChild variant="outline">
              <a href={lead.generated_image_url} download>
                <Download className="mr-2 h-4 w-4" /> Download preview
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CenterMsg({ msg }: { msg: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}
