// Builds the embeddable stadium module into the static site (../assets/stadium/).
// `npm run dev` keeps serving the full-screen harness from index.html.
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  publicDir: command === "build" ? false : "public",
  build: {
    outDir: "../assets/stadium/js",
    emptyOutDir: true,
    target: "es2020",
    lib: {
      entry: "src/stadium.ts",
      formats: ["es"],
      fileName: () => "stadium.js",
    },
  },
}));
