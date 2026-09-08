// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  markdown: {
    shikiConfig: {
      // `defaultColor: false` makes Shiki emit --shiki-light / --shiki-dark on
      // every token instead of committing to a colour, so prose.css can pick
      // the branch the same way the rest of the palette does.
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
      wrap: true,
    },
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
