import { defineConfig } from "vite";
import { resolve } from "node:path";

const ROOT = import.meta.dirname;
const page = (name: string) => resolve(ROOT, "src/pages", `${name}.html`);

// Multi-page static site, published to GitHub Pages under /tribune/.
export default defineConfig({
  root: resolve(ROOT, "src/pages"),
  publicDir: resolve(ROOT, "public"),
  base: "/tribune/",
  build: {
    outDir: resolve(ROOT, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: "_app",
    rolldownOptions: {
      input: { index: page("index"), teams: page("teams"), team: page("team"), about: page("about") },
    },
  },
  server: { fs: { allow: [ROOT] } },
});
