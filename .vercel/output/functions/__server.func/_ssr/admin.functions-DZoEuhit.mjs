import { c as createSsrRpc } from "./createSsrRpc-CVgcWAa8.mjs";
import { a as createServerFn } from "./server-Czlvuct_.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C4O3ZJj-.mjs";
import { o as objectType, s as stringType, b as booleanType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
const listLeads = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a13c3b0d62eea35ba805b089a3831e1be937ec740199e09b4efc93c0ef8a2fbc"));
const updateLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid(),
  status: stringType().optional(),
  notes: stringType().optional()
}).parse(d)).handler(createSsrRpc("08c965869a2f91e208cdeb8ba1fb475ab63ebb3216a549387f4273fe177ecfe3"));
const deleteLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("c4914de15b69e3708912558dce7c6fc2ff9cfdd664f29082dbfdb3552465b36d"));
const getStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("31268a6b3a687234f7b6a0977b07f20f082afec1528a26cc9ece4c7c1d53487f"));
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
}).parse(d)).handler(createSsrRpc("add9d5062ae8cd43029d764a92782b75295a21c733b36bb694a65ac2178298a6"));
const deleteTile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("831ab7258e4b42992e0dbdb9f7fe4a910abe409e17ea40e8edb272115b38a519"));
export {
  deleteTile as a,
  upsertTile as b,
  deleteLead as d,
  getStats as g,
  listLeads as l,
  updateLead as u
};
