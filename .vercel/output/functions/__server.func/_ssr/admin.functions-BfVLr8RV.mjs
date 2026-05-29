import { c as createServerRpc } from "./createServerRpc-ByD-7kmg.mjs";
import { a as createServerFn } from "./server-BV-6dHeb.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BdMvRj_6.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function assertAdmin(userId) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not authorized");
}
const listLeads_createServerFn_handler = createServerRpc({
  id: "a13c3b0d62eea35ba805b089a3831e1be937ec740199e09b4efc93c0ef8a2fbc",
  name: "listLeads",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listLeads.__executeServer(opts));
const listLeads = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listLeads_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("leads").select("*, tile:tiles(name, code, image_url)").order("created_at", {
    ascending: false
  }).limit(1e3);
  if (error) throw new Error(error.message);
  return data;
});
const updateLead_createServerFn_handler = createServerRpc({
  id: "08c965869a2f91e208cdeb8ba1fb475ab63ebb3216a549387f4273fe177ecfe3",
  name: "updateLead",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updateLead.__executeServer(opts));
const updateLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid(),
  status: stringType().optional(),
  notes: stringType().optional()
}).parse(d)).handler(updateLead_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    id,
    ...rest
  } = data;
  const {
    error
  } = await supabaseAdmin.from("leads").update(rest).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteLead_createServerFn_handler = createServerRpc({
  id: "c4914de15b69e3708912558dce7c6fc2ff9cfdd664f29082dbfdb3552465b36d",
  name: "deleteLead",
  filename: "src/lib/admin.functions.ts"
}, (opts) => deleteLead.__executeServer(opts));
const deleteLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(deleteLead_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getStats_createServerFn_handler = createServerRpc({
  id: "31268a6b3a687234f7b6a0977b07f20f082afec1528a26cc9ece4c7c1d53487f",
  name: "getStats",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getStats.__executeServer(opts));
const getStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: leads,
    error
  } = await supabaseAdmin.from("leads").select("id, created_at, flow_type, city, sqft, priority, tile_id");
  if (error) throw new Error(error.message);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = leads.filter((l) => new Date(l.created_at) >= today).length;
  const byFlow = {
    self: 0,
    expert: 0
  };
  const byPriority = {
    hot: 0,
    warm: 0,
    cold: 0
  };
  const byCity = {};
  const byTile = {};
  for (const l of leads) {
    byFlow[l.flow_type]++;
    byPriority[l.priority]++;
    byCity[l.city] = (byCity[l.city] || 0) + 1;
    if (l.tile_id) byTile[l.tile_id] = (byTile[l.tile_id] || 0) + 1;
  }
  return {
    total: leads.length,
    today: todayCount,
    byFlow,
    byPriority,
    topCities: Object.entries(byCity).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topTiles: Object.entries(byTile).sort((a, b) => b[1] - a[1]).slice(0, 5)
  };
});
const upsertTile_createServerFn_handler = createServerRpc({
  id: "add9d5062ae8cd43029d764a92782b75295a21c733b36bb694a65ac2178298a6",
  name: "upsertTile",
  filename: "src/lib/admin.functions.ts"
}, (opts) => upsertTile.__executeServer(opts));
const upsertTile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid().optional(),
  name: stringType().min(1),
  code: stringType().min(1),
  image_url: stringType().url(),
  finish: enumType(["matte", "glossy", "anti_skid"]),
  size: enumType(["2x2", "2x4", "plank"]),
  room_types: arrayType(enumType(["bathroom", "living_room", "kitchen", "balcony", "bedroom"])),
  description: stringType().optional().nullable(),
  active: booleanType().default(true)
}).parse(d)).handler(upsertTile_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  if (data.id) {
    const {
      id,
      ...rest
    } = data;
    const {
      error
    } = await supabaseAdmin.from("tiles").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("tiles").insert(data);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteTile_createServerFn_handler = createServerRpc({
  id: "831ab7258e4b42992e0dbdb9f7fe4a910abe409e17ea40e8edb272115b38a519",
  name: "deleteTile",
  filename: "src/lib/admin.functions.ts"
}, (opts) => deleteTile.__executeServer(opts));
const deleteTile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(deleteTile_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("tiles").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteLead_createServerFn_handler,
  deleteTile_createServerFn_handler,
  getStats_createServerFn_handler,
  listLeads_createServerFn_handler,
  updateLead_createServerFn_handler,
  upsertTile_createServerFn_handler
};
