import { c as createServerRpc } from "./createServerRpc-ByD-7kmg.mjs";
import { a as createServerFn } from "./server-BV-6dHeb.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const inputSchema = objectType({
  full_name: stringType().min(2).max(100),
  contact_number: stringType().regex(/^[6-9]\d{9}$/),
  city: stringType().min(2).max(80),
  sqft: numberType().int().positive().max(1e5),
  flow_type: enumType(["self", "expert"]),
  tile_id: stringType().uuid().nullable().optional(),
  original_image_url: stringType().url().nullable().optional()
});
function admin() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
const createLead_createServerFn_handler = createServerRpc({
  id: "d09b5def561c97d9af2d33d19dea3fb9e628ab88e1cbc611eb88b776cde547d4",
  name: "createLead",
  filename: "src/lib/leads.functions.ts"
}, (opts) => createLead.__executeServer(opts));
const createLead = createServerFn({
  method: "POST"
}).inputValidator((d) => inputSchema.parse(d)).handler(createLead_createServerFn_handler, async ({
  data
}) => {
  const sb = admin();
  const {
    data: row,
    error
  } = await sb.from("leads").insert({
    full_name: data.full_name,
    contact_number: data.contact_number,
    city: data.city,
    sqft: data.sqft,
    flow_type: data.flow_type,
    tile_id: data.tile_id ?? null,
    original_image_url: data.original_image_url ?? null
  }).select("id, priority").single();
  if (error) throw new Error(error.message);
  return row;
});
const previewSchema = objectType({
  lead_id: stringType().uuid(),
  room_image_url: stringType().url(),
  tile_id: stringType().uuid().optional(),
  // Inline tile (used for built-in/default tiles that are not in the DB).
  tile_image_url: stringType().url().optional(),
  tile_name: stringType().optional(),
  tile_size: stringType().optional(),
  tile_finish: stringType().optional()
}).refine((d) => !!d.tile_id || !!d.tile_image_url, {
  message: "Either tile_id or tile_image_url is required"
});
async function fetchImageAsDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buf = await res.arrayBuffer();
  const mime = res.headers.get("content-type") || "image/jpeg";
  const b64 = Buffer.from(buf).toString("base64");
  return `data:${mime};base64,${b64}`;
}
const generatePreview_createServerFn_handler = createServerRpc({
  id: "a714aea962572ad8f71408bbe0ddc3e51d6fdaac1ee82ad1331742c222b8ce6e",
  name: "generatePreview",
  filename: "src/lib/leads.functions.ts"
}, (opts) => generatePreview.__executeServer(opts));
const generatePreview = createServerFn({
  method: "POST"
}).inputValidator((d) => previewSchema.parse(d)).handler(generatePreview_createServerFn_handler, async ({
  data
}) => {
  const sb = admin();
  let tileImageUrl;
  let tileName = data.tile_name || "selected tile";
  let tileSize = data.tile_size || "600x600";
  let tileFinish = data.tile_finish || "matte";
  let dbTile = null;
  if (data.tile_id) {
    const {
      data: tile,
      error: tErr
    } = await sb.from("tiles").select("id, name, code, image_url, finish, size").eq("id", data.tile_id).single();
    if (tErr || !tile) throw new Error("Tile not found");
    dbTile = tile;
    tileImageUrl = tile.image_url;
    tileName = tile.name;
    tileSize = tile.size;
    tileFinish = tile.finish;
  } else {
    tileImageUrl = data.tile_image_url;
  }
  const [roomDataUrl, tileDataUrl] = await Promise.all([fetchImageAsDataUrl(data.room_image_url), fetchImageAsDataUrl(tileImageUrl)]);
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
  const prompt = `You are an expert interior visualizer. The FIRST image is a real photo of a customer's room. The SECOND image is a single tile texture (${tileName}, size ${tileSize}, ${tileFinish} finish).

YOUR TASK: Re-render the same room with this tile applied to the appropriate surface(s). Auto-detect the surface based on the photo:
- If the photo is a normal room / living room / bedroom / kitchen / office — tile the FLOOR only.
- If the photo is a bathroom or shower area — tile BOTH the floor AND the wet-area walls (where wall tiles typically go).
- If the photo clearly shows only a wall (close-up of wall, backsplash, feature wall) — tile that WALL.
- If both floor and walls are clearly visible in a bathroom-like setting — tile both.

CRITICAL RULES:
1. Preserve the room's perspective, camera angle, lighting direction, shadows, furniture, fixtures, doors, windows, ceiling and any objects exactly as in the original photo. Do not move or alter them.
2. Tile the chosen surface(s) with realistic grout lines, correct scale for tile size ${tileSize}, and surface reflectivity matching a ${tileFinish} finish.
3. Follow the original surface's perspective so tiles converge naturally toward vanishing points.
4. Preserve the original shadows cast onto the surface by furniture and people.
5. Output a single photorealistic image of the same room with the new tile applied. Do NOT add or remove furniture. Do NOT change wall color outside the tiled area.`;
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      modalities: ["image", "text"],
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: prompt
        }, {
          type: "image_url",
          image_url: {
            url: roomDataUrl
          }
        }, {
          type: "image_url",
          image_url: {
            url: tileDataUrl
          }
        }]
      }]
    })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const msg = json?.choices?.[0]?.message;
  const imgUrl = msg?.images?.[0]?.image_url?.url || msg?.images?.[0]?.url || (Array.isArray(msg?.content) ? msg.content.find((c) => c.type === "image_url")?.image_url?.url : void 0);
  if (!imgUrl) throw new Error("No image returned from AI");
  const m = imgUrl.match(/^data:(.+?);base64,(.+)$/);
  let buffer;
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
  const {
    error: upErr
  } = await sb.storage.from("generated-previews").upload(path, buffer, {
    contentType,
    upsert: true
  });
  if (upErr) throw new Error(upErr.message);
  const publicUrl = sb.storage.from("generated-previews").getPublicUrl(path).data.publicUrl;
  const update = {
    generated_image_url: publicUrl
  };
  if (dbTile) update.tile_id = dbTile.id;
  await sb.from("leads").update(update).eq("id", data.lead_id);
  return {
    generated_image_url: publicUrl,
    tile: dbTile
  };
});
const getLeadResult_createServerFn_handler = createServerRpc({
  id: "f11efb53847f1d9abeab1aa16c43ecf00b29d672ea2f512ea9e6a86a576c3782",
  name: "getLeadResult",
  filename: "src/lib/leads.functions.ts"
}, (opts) => getLeadResult.__executeServer(opts));
const getLeadResult = createServerFn({
  method: "GET"
}).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(getLeadResult_createServerFn_handler, async ({
  data
}) => {
  const sb = admin();
  const {
    data: lead,
    error
  } = await sb.from("leads").select("id, full_name, sqft, city, original_image_url, generated_image_url, tile_id, flow_type").eq("id", data.id).single();
  if (error || !lead) throw new Error("Not found");
  let tile = null;
  if (lead.tile_id) {
    const {
      data: t
    } = await sb.from("tiles").select("*").eq("id", lead.tile_id).single();
    tile = t;
  }
  return {
    lead,
    tile
  };
});
export {
  createLead_createServerFn_handler,
  generatePreview_createServerFn_handler,
  getLeadResult_createServerFn_handler
};
