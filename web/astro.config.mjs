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
  build: {
    concurrency: 50,
  },
});
