import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Nitro builds the Vercel Output API. On Vercel CI the vercel preset is
  // auto-detected; pinning it keeps local `vite build` aligned with deploy.
  nitro: {
    preset: "vercel",
  },
  vite: {
    base: "/",
    server: {
      allowedHosts: true,
    },
    preview: {
      allowedHosts: true,
    },
  },
});
