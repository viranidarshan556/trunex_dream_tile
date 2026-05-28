import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const inputSchema = z.object({
  full_name: z.string().min(2).max(100),
  contact_number: z.string().regex(/^[6-9]\d{9}$/),
  city: z.string().min(2).max(80),
  sqft: z.number().int().positive().max(100000),
  flow_type: z.enum(["self", "expert"]),
  tile_id: z.string().uuid().nullable().optional(),
  original_image_url: z.string().url().nullable().optional(),
});

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = admin();
    const { data: row, error } = await sb
      .from("leads")
      .insert({
        full_name: data.full_name,
        contact_number: data.contact_number,
        city: data.city,
        sqft: data.sqft,
        flow_type: data.flow_type,
        tile_id: data.tile_id ?? null,
        original_image_url: data.original_image_url ?? null,
      })
      .select("id, priority")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

const previewSchema = z.object({
  lead_id: z.string().uuid(),
  room_image_url: z.string().url(),
  tile_id: z.string().uuid(),
});

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buf = await res.arrayBuffer();
  const mime = res.headers.get("content-type") || "image/jpeg";
  const b64 = Buffer.from(buf).toString("base64");
  return `data:${mime};base64,${b64}`;
}

export const generatePreview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => previewSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = admin();
    const { data: tile, error: tErr } = await sb
      .from("tiles")
      .select("id, name, code, image_url, finish, size")
      .eq("id", data.tile_id)
      .single();
    if (tErr || !tile) throw new Error("Tile not found");

    const [roomDataUrl, tileDataUrl] = await Promise.all([
      fetchImageAsDataUrl(data.room_image_url),
      fetchImageAsDataUrl(tile.image_url),
    ]);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const prompt = `You are an expert interior visualizer. Take the first image (a real room photo) and replace ONLY the floor surface with the tile pattern shown in the second image. Preserve the original room's perspective, lighting, shadows, furniture, walls, and camera angle exactly. The tile should tile naturally with realistic grout lines, correct scale (tile size ${tile.size}), and ${tile.finish} finish reflectivity. Output a single photorealistic image of the same room with the new floor.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: roomDataUrl } },
              { type: "image_url", image_url: { url: tileDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway error ${res.status}: ${t.slice(0, 200)}`);
    }
    const json: any = await res.json();
    const msg = json?.choices?.[0]?.message;
    const imgUrl: string | undefined =
      msg?.images?.[0]?.image_url?.url ||
      msg?.images?.[0]?.url ||
      (Array.isArray(msg?.content)
        ? msg.content.find((c: any) => c.type === "image_url")?.image_url?.url
        : undefined);
    if (!imgUrl) throw new Error("No image returned from AI");

    // Decode and upload to storage
    const m = imgUrl.match(/^data:(.+?);base64,(.+)$/);
    let buffer: Buffer;
    let contentType = "image/png";
    if (m) {
      contentType = m[1];
      buffer = Buffer.from(m[2], "base64");
    } else {
      const r = await fetch(imgUrl);
      buffer = Buffer.from(await r.arrayBuffer());
      contentType = r.headers.get("content-type") || "image/png";
    }
    const ext = contentType.split("/")[1] || "png";
    const path = `${data.lead_id}-${Date.now()}.${ext}`;
    const { error: upErr } = await sb.storage
      .from("generated-previews")
      .upload(path, buffer, { contentType, upsert: true });
    if (upErr) throw new Error(upErr.message);
    const publicUrl = sb.storage.from("generated-previews").getPublicUrl(path).data.publicUrl;

    await sb
      .from("leads")
      .update({ generated_image_url: publicUrl, tile_id: tile.id })
      .eq("id", data.lead_id);

    return { generated_image_url: publicUrl, tile };
  });

export const getLeadResult = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const sb = admin();
    const { data: lead, error } = await sb
      .from("leads")
      .select("id, full_name, sqft, city, original_image_url, generated_image_url, tile_id, flow_type")
      .eq("id", data.id)
      .single();
    if (error || !lead) throw new Error("Not found");
    let tile = null as any;
    if (lead.tile_id) {
      const { data: t } = await sb.from("tiles").select("*").eq("id", lead.tile_id).single();
      tile = t;
    }
    return { lead, tile };
  });
