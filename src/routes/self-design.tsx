import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { RoomImagePicker } from "@/components/RoomImagePicker";
import { TileGallery, type Tile } from "@/components/TileGallery";
import { LeadFormFields } from "@/components/LeadFormFields";
import { Button } from "@/components/ui/button";
import { uploadRoomImage } from "@/lib/upload";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { createLead, generatePreview } from "@/lib/leads.functions";

export const Route = createFileRoute("/self-design")({
  head: () => ({
    meta: [
      { title: "Self Design — AI Tile Preview | TRUNEX" },
      { name: "description", content: "Upload your room, pick a TRUNEX tile, and instantly see an AI-rendered preview." },
    ],
  }),
  component: SelfDesignPage,
});

function SelfDesignPage() {
  const navigate = useNavigate();
  const createLeadFn = useServerFn(createLead);
  const generatePreviewFn = useServerFn(generatePreview);

  const [file, setFile] = useState<File | null>(null);
  const [tile, setTile] = useState<Tile | null>(null);
  const [values, setValues] = useState<Partial<LeadInput>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof LeadInput, string>>>({});
  const [step, setStep] = useState<"upload" | "tile" | "details">("upload");
  const [busy, setBusy] = useState(false);
  const [busyMsg, setBusyMsg] = useState("");

  async function handleSubmit() {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const e: any = {};
      for (const i of parsed.error.issues) e[i.path[0] as string] = i.message;
      setErrors(e);
      return;
    }
    if (!file || !tile) return;
    setErrors({});
    setBusy(true);
    try {
      setBusyMsg("Uploading your room…");
      const roomUrl = await uploadRoomImage(file);

      setBusyMsg("Saving your details…");
      const lead = await createLeadFn({
        data: {
          ...parsed.data,
          flow_type: "self",
          tile_id: tile.id,
          original_image_url: roomUrl,
        },
      });

      setBusyMsg("AI is rendering your tile preview…");
      await generatePreviewFn({
        data: { lead_id: lead.id, room_image_url: roomUrl, tile_id: tile.id },
      });

      toast.success("Your preview is ready!");
      navigate({ to: "/result/$id", params: { id: lead.id } });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <SiteHeader />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Self Design · AI Preview</p>
          <h1 className="mt-1 font-display text-3xl">Visualize your floor</h1>
        </div>

        <Stepper step={step} />

        {step === "upload" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload a photo of the room you want to tile.</p>
            <RoomImagePicker value={file} onChange={setFile} />
            <Button className="w-full" disabled={!file} onClick={() => setStep("tile")}>Continue</Button>
          </div>
        )}

        {step === "tile" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Pick a tile to preview on your floor.</p>
            <TileGallery selectedId={tile?.id ?? null} onSelect={setTile} />
            <div className="sticky bottom-3 z-30 flex gap-2 rounded-xl border gold-border bg-background/95 p-2 backdrop-blur">
              <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
              <Button className="flex-1" disabled={!tile} onClick={() => setStep("details")}>Continue</Button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">A few details so we can send you the rendered preview.</p>
            <LeadFormFields values={values} errors={errors} onChange={(v) => setValues((p) => ({ ...p, ...v }))} />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("tile")} disabled={busy}>Back</Button>
              <Button className="flex-1 gold-glow" disabled={busy} onClick={handleSubmit}>
                {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{busyMsg}</> : <><Sparkles className="mr-2 h-4 w-4" />Generate AI Preview</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: "upload" | "tile" | "details" }) {
  const idx = step === "upload" ? 0 : step === "tile" ? 1 : 2;
  return (
    <div className="mb-6 flex items-center gap-2">
      {["Photo", "Tile", "Details"].map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] ${i <= idx ? "border-gold bg-gold/15 text-gold" : "border-border/60 text-muted-foreground"}`}>{i + 1}</div>
          <span className={`text-xs ${i <= idx ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
          {i < 2 && <div className={`h-px flex-1 ${i < idx ? "bg-gold/50" : "bg-border/40"}`} />}
        </div>
      ))}
    </div>
  );
}
