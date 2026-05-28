import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not authorized");
}

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*, tile:tiles(name, code, image_url)")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return data;
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.string().optional(),
      notes: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin.from("leads").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("id, created_at, flow_type, city, sqft, priority, tile_id");
    if (error) throw new Error(error.message);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = leads.filter((l) => new Date(l.created_at) >= today).length;
    const byFlow = { self: 0, expert: 0 };
    const byPriority = { hot: 0, warm: 0, cold: 0 };
    const byCity: Record<string, number> = {};
    const byTile: Record<string, number> = {};
    for (const l of leads) {
      byFlow[l.flow_type as "self" | "expert"]++;
      byPriority[l.priority as "hot" | "warm" | "cold"]++;
      byCity[l.city] = (byCity[l.city] || 0) + 1;
      if (l.tile_id) byTile[l.tile_id] = (byTile[l.tile_id] || 0) + 1;
    }
    return {
      total: leads.length,
      today: todayCount,
      byFlow,
      byPriority,
      topCities: Object.entries(byCity).sort((a, b) => b[1] - a[1]).slice(0, 5),
      topTiles: Object.entries(byTile).sort((a, b) => b[1] - a[1]).slice(0, 5),
    };
  });

export const upsertTile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1),
      code: z.string().min(1),
      image_url: z.string().url(),
      finish: z.enum(["matte", "glossy", "anti_skid"]),
      size: z.enum(["2x2", "2x4", "plank"]),
      room_types: z.array(z.enum(["bathroom", "living_room", "kitchen", "balcony", "bedroom"])),
      description: z.string().optional().nullable(),
      active: z.boolean().default(true),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabaseAdmin.from("tiles").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("tiles").insert(data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteTile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("tiles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
