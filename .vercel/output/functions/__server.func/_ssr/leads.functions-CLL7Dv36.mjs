import { c as createSsrRpc } from "./createSsrRpc-CVgcWAa8.mjs";
import { a as createServerFn } from "./server-Czlvuct_.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
const inputSchema = objectType({
  full_name: stringType().min(2).max(100),
  contact_number: stringType().regex(/^[6-9]\d{9}$/),
  city: stringType().min(2).max(80),
  sqft: numberType().int().positive().max(1e5),
  flow_type: enumType(["self", "expert"]),
  tile_id: stringType().uuid().nullable().optional(),
  original_image_url: stringType().url().nullable().optional()
});
const createLead = createServerFn({
  method: "POST"
}).inputValidator((d) => inputSchema.parse(d)).handler(createSsrRpc("d09b5def561c97d9af2d33d19dea3fb9e628ab88e1cbc611eb88b776cde547d4"));
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
const generatePreview = createServerFn({
  method: "POST"
}).inputValidator((d) => previewSchema.parse(d)).handler(createSsrRpc("a714aea962572ad8f71408bbe0ddc3e51d6fdaac1ee82ad1331742c222b8ce6e"));
const getLeadResult = createServerFn({
  method: "GET"
}).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("f11efb53847f1d9abeab1aa16c43ecf00b29d672ea2f512ea9e6a86a576c3782"));
export {
  getLeadResult as a,
  createLead as c,
  generatePreview as g
};
