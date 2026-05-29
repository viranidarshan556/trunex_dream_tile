import { c as createServerRpc } from "./createServerRpc-ByD-7kmg.mjs";
import { a as createServerFn } from "./server-BV-6dHeb.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BdMvRj_6.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, l as literalType } from "../_libs/zod.mjs";
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
const contactSchema = objectType({
  full_name: stringType().min(2).max(120),
  contact_number: stringType().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  email: stringType().email().optional().or(literalType("")),
  message: stringType().min(5).max(2e3)
});
const submitContact_createServerFn_handler = createServerRpc({
  id: "1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd",
  name: "submitContact",
  filename: "src/lib/contact.functions.ts"
}, (opts) => submitContact.__executeServer(opts));
const submitContact = createServerFn({
  method: "POST"
}).inputValidator((d) => contactSchema.parse(d)).handler(submitContact_createServerFn_handler, async ({
  data
}) => {
  const {
    error
  } = await supabaseAdmin.from("contact_messages").insert({
    full_name: data.full_name,
    contact_number: data.contact_number,
    email: data.email || null,
    message: data.message
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
async function assertAdmin(userId) {
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Not authorized");
}
const listContacts_createServerFn_handler = createServerRpc({
  id: "344935986c686663187b2dcb19231e3c6c45f7f8d08757c3002271f4ffd76c0a",
  name: "listContacts",
  filename: "src/lib/contact.functions.ts"
}, (opts) => listContacts.__executeServer(opts));
const listContacts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listContacts_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("contact_messages").select("*").order("created_at", {
    ascending: false
  }).limit(1e3);
  if (error) throw new Error(error.message);
  return data;
});
const updateContactStatus_createServerFn_handler = createServerRpc({
  id: "c66fe9cfec2a6c1bf0783033c642d937fa04e2774b783918c1cb9e08b54f7d52",
  name: "updateContactStatus",
  filename: "src/lib/contact.functions.ts"
}, (opts) => updateContactStatus.__executeServer(opts));
const updateContactStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid(),
  status: stringType()
}).parse(d)).handler(updateContactStatus_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("contact_messages").update({
    status: data.status
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteContact_createServerFn_handler = createServerRpc({
  id: "3a7c0734422901ccc86741fa396c2c561649c5b6188e4ccd9355ec9dbdcc61fd",
  name: "deleteContact",
  filename: "src/lib/contact.functions.ts"
}, (opts) => deleteContact.__executeServer(opts));
const deleteContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(deleteContact_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("contact_messages").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteContact_createServerFn_handler,
  listContacts_createServerFn_handler,
  submitContact_createServerFn_handler,
  updateContactStatus_createServerFn_handler
};
