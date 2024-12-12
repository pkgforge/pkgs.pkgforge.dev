// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({  
  cacheDir: './.astro',
  integrations: [
    react({
      include: "./src/**/*.tsx",
    }),
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
    concurrency: 4,
  },
});
