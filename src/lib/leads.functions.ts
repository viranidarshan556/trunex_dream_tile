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
  generated_image_url: z.string().url().nullable().optional(),
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
        generated_image_url: data.generated_image_url ?? null,
      })
      .select("id, priority")
      .single();
    if (error) throw new Error(error.message);
    return row;
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
