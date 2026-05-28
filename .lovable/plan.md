# TRUNEX AI Tile Visualizer — Build Plan

A luxury dark + gold lead-gen platform with AI tile preview, dual flows (Self / Expert), admin panel, email + WhatsApp integration.

## Important notes before we start

1. **Tech stack**: Your project is on **TanStack Start (React 19 + Vite)**, not Next.js. It's a comparable full-stack React framework already configured here — I'll build on it instead of rebuilding the project from scratch. All features you listed are fully supported.
2. **Backend**: I'll enable **Lovable Cloud** (managed Supabase) for database, auth, storage, and server functions.
3. **AI tile rendering**: I'll use **Lovable AI Gateway** with `google/gemini-3.1-flash-image-preview` (Nano Banana 2) to composite tiles onto the uploaded room photo. This is the realistic option available — true photorealistic floor-perspective rendering depends on the model; results are very good but I want to set the expectation.
4. **Email**: `noreply@trunexteam.com` requires a verified domain. I'll wire emails via **Resend** (you'll need a Resend API key + verified domain). Until verified, emails will send from `onboarding@resend.dev` to `buckatiexport@gmail.com`.
5. **Admin login**: I'll create an `admin` role; first admin assigned manually via SQL after you sign up.
6. **Tile library**: I'll generate the 12 demo tile swatches using the image generator.

## Phase 1 — Foundation
- Enable Lovable Cloud
- Design system: deep black, premium gold (#D4AF37-ish in oklch), white. Fonts: Playfair Display (display) + Inter (body)
- Routes: `/`, `/self-design`, `/expert-design`, `/result/$id`, `/login`, `/_authenticated/admin`, `/_authenticated/admin/leads/$id`, `/_authenticated/admin/tiles`
- Landing page with two premium option cards

## Phase 2 — Database schema (migration)
- `tiles` (id, name, code, image_url, finish, size, room_types[], active)
- `leads` (id, full_name, contact_number, city, sqft, flow_type, tile_id, original_image_url, generated_image_url, priority, created_at)
- `profiles` + `user_roles` (admin role) with `has_role()` security definer
- Storage buckets: `room-uploads` (public), `generated-previews` (public), `tile-images` (public)
- RLS: leads insert open to anon; select admin-only. Tiles select public; mutate admin-only.

## Phase 3 — Customer flows
- Image upload component: gallery + native camera (`<input capture="environment">`)
- Tile gallery with filters (finish / size / room)
- Lead form modal with Indian mobile validation (zod)
- Self-design: lead form → server fn calls AI Gateway `/v1/images/generations` with room image + tile → store preview → result page
- Expert-design: lead form → upload → open WhatsApp with prefilled message + image link
- Result page: preview, tile details, "why it fits" education, alternative tiles, Connect CTA

## Phase 4 — Admin panel
- `/login` (email/password)
- Dashboard: KPIs (total, today, by flow, by city, by sqft buckets, popular tiles)
- Leads list + detail page
- WhatsApp "Message Customer" prefilled button
- Excel export (xlsx via SheetJS)
- Tile management CRUD with image upload

## Phase 5 — Notifications
- Server function on lead insert → Resend email to `buckatiexport@gmail.com`
- Hot/Warm/Cold auto-classification by sqft (Hot >1500, Warm 600–1500, Cold <600 — adjustable)

## Phase 6 — Polish & deploy
- SEO meta on all routes, sitemap, robots
- Loading states, error boundaries
- Mobile QA at 390px

## Technical details
- AI image route: `src/routes/api/generate-preview.ts` (streaming SSE from Gateway)
- Image edit prompt sends room image + tile swatch to Nano Banana 2 with prompt: *"Replace floor in this room with the provided tile pattern. Preserve perspective, lighting, shadows, furniture, walls. Photorealistic."*
- Server functions: `createServerFn` with `requireSupabaseAuth` for admin queries; public lead-insert via admin client in `/api/public/leads`

## What I need from you to fully go live
1. **Confirm to proceed** with the above stack (TanStack Start instead of Next.js).
2. **Resend API key** (or pick Mailgun / use Lovable Emails) — I'll ask after enabling Cloud.
3. **TRUNEX WhatsApp number** for the "Connect With TRUNEX" + Expert flow (e.g. `+91XXXXXXXXXX`).
4. **First admin email** — sign up at `/login` then I'll grant admin role via SQL.

Once approved I'll execute Phases 1–6 end-to-end.
