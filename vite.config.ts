import { defineConfig } from "vite";
import { resolve, basename } from "node:path";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import handlebars from "vite-plugin-handlebars";

const ROOT = import.meta.dirname;
const page = (name: string) => resolve(ROOT, "src/pages", `${name}.html`);

// Per-page values for the shared header/footer partials (templates/partials).
const PAGE_CONTEXT: Record<string, { home?: boolean; current?: string }> = {
  "index.html": { home: true },
  "teams.html": { current: "teams" },
  "team.html": {},
  "about.html": { current: "about" },
};

// The stadium module entry (public/assets/stadium/js/stadium.js) has a fixed name, so browsers and the
// service worker would keep serving an old copy. Its content hash goes into the import URL instead.
const STADIUM_VERSION = createHash("sha256")
  .update(readFileSync(resolve(ROOT, "public/assets/stadium/js/stadium.js")))
  .digest("hex").slice(0, 10);

// Multi-page static site, published to GitHub Pages under /tribune/.
export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(ROOT, "src/udf/templates/partials"),
      context: (pagePath: string) => PAGE_CONTEXT[basename(pagePath)] ?? {},
      helpers: { eq: (a: unknown, b: unknown) => a === b },
    }),
  ],
  root: resolve(ROOT, "src/pages"),
  publicDir: resolve(ROOT, "public"),
  base: "/tribune/",
  define: { __STADIUM_VERSION__: JSON.stringify(STADIUM_VERSION) },
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
