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

const previewSchema = z
  .object({
    lead_id: z.string().uuid(),
    room_image_url: z.string().url(),
    tile_id: z.string().uuid().optional(),
    // Inline tile (used for built-in/default tiles that are not in the DB).
    tile_image_url: z.string().url().optional(),
    tile_name: z.string().optional(),
    tile_size: z.string().optional(),
    tile_finish: z.string().optional(),
  })
  .refine((d) => !!d.tile_id || !!d.tile_image_url, {
    message: "Either tile_id or tile_image_url is required",
  });

export const generatePreview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => previewSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = admin();

    let tileName = data.tile_name || "selected tile";
    let tileSize = data.tile_size || "600x600";
    let tileFinish = data.tile_finish || "matte";
    let dbTile: any = null;

    if (data.tile_id) {
      const { data: tile, error: tErr } = await sb
        .from("tiles")
        .select("id, name, code, image_url, finish, size")
        .eq("id", data.tile_id)
        .single();
      if (tErr || !tile) throw new Error("Tile not found");
      dbTile = tile;
      tileName = tile.name;
      tileSize = tile.size;
      tileFinish = tile.finish;
    }

    const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_KEY or GEMINI_API_KEY missing");

    const promptText = `A modern photorealistic interior design photo of a gorgeous room (like a kitchen, living room, or bathroom), where the entire floor is perfectly and elegantly tiled with tiles named '${tileName}' (size ${tileSize}, ${tileFinish} finish). The lighting should be professional, casting soft realistic shadows, showing off the texture and quality of the tiles in perspective.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptText,
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini Imagen API error ${res.status}: ${errorText.slice(0, 200)}`);
    }

    const json: any = await res.json();
    const b64 = json?.generatedImages?.[0]?.image?.imageBytes;
    if (!b64) throw new Error("No image returned from Gemini Imagen API");

    const buffer = Buffer.from(b64, "base64");
    const contentType = "image/jpeg";
    const path = `${data.lead_id}-${Date.now()}.jpg`;

    const { error: upErr } = await sb.storage
      .from("generated-previews")
      .upload(path, buffer, { contentType, upsert: true });
    if (upErr) throw new Error(upErr.message);

    const publicUrl = sb.storage.from("generated-previews").getPublicUrl(path).data.publicUrl;

    const update: any = { generated_image_url: publicUrl };
    if (dbTile) update.tile_id = dbTile.id;
    await sb.from("leads").update(update).eq("id", data.lead_id);

    return { generated_image_url: publicUrl, tile: dbTile };
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
