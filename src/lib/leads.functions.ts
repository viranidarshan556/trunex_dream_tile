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

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buf = await res.arrayBuffer();
  const mime = res.headers.get("content-type") || "image/jpeg";
  const b64 = Buffer.from(buf).toString("base64");
  return `data:${mime};base64,${b64}`;
}

const getBase64Data = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid base64 data URL");
  return { mimeType: match[1], data: match[2] };
};

export const generatePreview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => previewSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = admin();

    let tileImageUrl = data.tile_image_url || "";
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
      tileImageUrl = tile.image_url;
      tileName = tile.name;
      tileSize = tile.size;
      tileFinish = tile.finish;
    }

    const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_KEY or GEMINI_API_KEY missing");

    // Fetch both room and tile images to send to Gemini Flash
    const [roomDataUrl, tileDataUrl] = await Promise.all([
      fetchImageAsDataUrl(data.room_image_url),
      fetchImageAsDataUrl(tileImageUrl),
    ]);

    const roomB64 = getBase64Data(roomDataUrl);
    const tileB64 = getBase64Data(tileDataUrl);

    // Call Gemini 2.0 Flash (100% Free Tier) to analyze images and write the perfect generation prompt
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert interior visualizer. Analyze the first image (room photo) and the second image (tile texture named "${tileName}", size ${tileSize}, finish ${tileFinish}).
                Write a highly detailed, professional, single-paragraph prompt for a text-to-image generator. The prompt must describe a photorealistic interior design render of a room with the exact same layout, furniture, and style as the first image, but with the floor beautifully and perfectly covered with the new tile texture.
                Do not include any greeting or conversational text. Output ONLY the optimized prompt, starting directly with "A photorealistic interior design photo..." and ending with "...highly detailed, 8k resolution, photorealistic."`
              },
              {
                inlineData: {
                  mimeType: roomB64.mimeType,
                  data: roomB64.data,
                }
              },
              {
                inlineData: {
                  mimeType: tileB64.mimeType,
                  data: tileB64.data,
                }
              }
            ]
          }
        ]
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      throw new Error(`Gemini API error ${geminiRes.status}: ${errorText.slice(0, 200)}`);
    }

    const geminiJson: any = await geminiRes.json();
    const generatedPrompt = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
      `A modern photorealistic interior design photo of a gorgeous room with the floor perfectly tiled with tiles named '${tileName}' (size ${tileSize}, ${tileFinish} finish).`;

    // Call Pollinations.ai (100% Free Public AI Image Generator) to render the preview room!
    const encodedPrompt = encodeURIComponent(generatedPrompt);
    const renderUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&private=true&enhance=true`;

    const imageRes = await fetch(renderUrl);
    if (!imageRes.ok) {
      throw new Error(`Failed to generate image via free AI generator: ${imageRes.status}`);
    }

    const buffer = Buffer.from(await imageRes.arrayBuffer());
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
