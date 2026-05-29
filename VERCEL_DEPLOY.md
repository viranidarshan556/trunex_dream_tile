# Vercel Deploy

This app can be deployed to Vercel.

## Important

The actual app root is:

`trunex-dream-tile`

If you import the parent repository into Vercel, set the **Root Directory** to `trunex-dream-tile`.

## Build setup

- Framework preset: leave auto-detect on
- If Vercel asks you to choose manually, use `Other`
- Install command: `npm install`
- Build command: `npm run build`

Nitro is enabled in `vite.config.ts` with the `vercel` preset, so the build output is generated for Vercel automatically.

## Environment variables

Add these variables in the Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY` if you want AI tile preview generation to work

You can copy the names from `.env.example`.
