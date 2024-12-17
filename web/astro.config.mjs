// @ts-check
import { defineConfig } from "astro/config";

import react from "astro-react-swc";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  cacheDir: "./.astro",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@/*": "./src/*",
      },
    },
  },
  redirects: {
    "/app/edge/x86_64/[...slug]": "/app/edge/x86_64-linux/[...slug]",
    "/app/edge/x86_64-Linux/[...slug]": "/app/edge/x86_64-linux/[...slug]",
    "/app/edge/aarch64/[...slug]": "/app/edge/aarch64-linux/[...slug]",
    "/app/edge/aarch64-Linux/[...slug]": "/app/edge/aarch64-linux/[...slug]",

    "/app/stable/x86_64/[...slug]": "/app/stable/x86_64-linux/[...slug]",
    "/app/stable/x86_64-Linux/[...slug]": "/app/stable/x86_64-linux/[...slug]",
    "/app/stable/aarch64/[...slug]": "/app/stable/aarch64-linux/[...slug]",
    "/app/stable/aarch64-Linux/[...slug]":
      "/app/stable/aarch64-linux/[...slug]",
  },
  build: {
    concurrency: 4,
    redirects: true,
  },
});
