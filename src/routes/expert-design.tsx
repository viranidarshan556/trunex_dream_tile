import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, MessageSquareHeart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { RoomImagePicker } from "@/components/RoomImagePicker";
import { LeadFormFields } from "@/components/LeadFormFields";
import { Button } from "@/components/ui/button";
import { uploadRoomImage } from "@/lib/upload";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { createLead } from "@/lib/leads.functions";
import { buildExpertWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/expert-design")({
  head: () => ({
    meta: [
      { title: "Expert Design — Free Tile Recommendation | TRUNEX" },
      { name: "description", content: "Share your room photo and our TRUNEX experts will recommend the perfect tile on WhatsApp." },
    ],
  }),
  component: ExpertPage,
});

function ExpertPage() {
  const createLeadFn = useServerFn(createLead);
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<Partial<LeadInput>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof LeadInput, string>>>({});
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const e: any = {};
      for (const i of parsed.error.issues) e[i.path[0] as string] = i.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      let roomUrl: string | undefined;
      if (file) roomUrl = await uploadRoomImage(file);
      await createLeadFn({
        data: {
          ...parsed.data,
          flow_type: "expert",
          original_image_url: roomUrl ?? null,
          tile_id: null,
        },
      });
      const url = buildExpertWhatsAppUrl({
        name: parsed.data.full_name,
        city: parsed.data.city,
        sqft: parsed.data.sqft,
        imageUrl: roomUrl,
      });
      toast.success("Opening WhatsApp…");
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Could not submit. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <SiteHeader />
      <div className="container mx-auto max-w-xl px-4 py-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Expert Design</p>
        <h1 className="mt-1 font-display text-3xl">Get a free recommendation</h1>
        <p className="mt-2 text-sm text-muted-foreground">Share your room and a TRUNEX expert will reach out on WhatsApp with the perfect tile match.</p>

        <div className="mt-6 space-y-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Room photo (optional)</p>
            <RoomImagePicker value={file} onChange={setFile} />
          </div>
          <LeadFormFields values={values} errors={errors} onChange={(v) => setValues((p) => ({ ...p, ...v }))} />
          <Button className="w-full gold-glow" disabled={busy} onClick={handleSubmit}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : <><MessageSquareHeart className="mr-2 h-4 w-4" />Connect on WhatsApp</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
