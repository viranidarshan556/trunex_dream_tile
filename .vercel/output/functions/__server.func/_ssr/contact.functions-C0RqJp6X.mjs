import { c as createSsrRpc } from "./createSsrRpc-CVgcWAa8.mjs";
import { a as createServerFn } from "./server-Czlvuct_.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C4O3ZJj-.mjs";
import { o as objectType, s as stringType, l as literalType } from "../_libs/zod.mjs";
const contactSchema = objectType({
  full_name: stringType().min(2).max(120),
  contact_number: stringType().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  email: stringType().email().optional().or(literalType("")),
  message: stringType().min(5).max(2e3)
});
const submitContact = createServerFn({
  method: "POST"
}).inputValidator((d) => contactSchema.parse(d)).handler(createSsrRpc("1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd"));
const listContacts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("344935986c686663187b2dcb19231e3c6c45f7f8d08757c3002271f4ffd76c0a"));
const updateContactStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid(),
  status: stringType()
}).parse(d)).handler(createSsrRpc("c66fe9cfec2a6c1bf0783033c642d937fa04e2774b783918c1cb9e08b54f7d52"));
const deleteContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("3a7c0734422901ccc86741fa396c2c561649c5b6188e4ccd9355ec9dbdcc61fd"));
export {
  deleteContact as d,
  listContacts as l,
  submitContact as s,
  updateContactStatus as u
};
