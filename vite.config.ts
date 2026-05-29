// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  plugins: [
    {
      name: "production-ssr-error-logger",
      transform(code, id) {
        const normalizedId = id.replace(/\\/g, "/");
        const isTargetModule =
          normalizedId.includes("/@tanstack/start-server-core/src/request-response.ts") ||
          normalizedId.includes("/@tanstack/start-server-core/dist/esm/request-response.js");
        if (!isTargetModule) return null;

        const needle = "handler(request, requestOpts)";
        if (!code.includes(needle)) return null;

        return code.replace(
          needle,
          `Promise.resolve(${needle}).catch((err) => { globalThis.__LOVABLE_TANSTACK_CAPTURE_SSR_ERROR__?.(err); throw err; })`,
        );
      },
    },
  ],
  nitro: {
    // Lovable's wrapper skips Nitro outside its sandbox unless we opt in.
    // Force the Vercel preset so production builds emit the server bundle Vercel expects.
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
