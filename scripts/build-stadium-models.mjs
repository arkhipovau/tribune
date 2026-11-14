// Prepares the stadium models for the site from the 3D artist's originals.
//   stadium-src/public/models/*.glb  (originals, untouched)
//   → public/assets/stadium/models/       full models: WebP textures (q90), meshopt-compressed geometry
//   → public/assets/stadium/models-lite/  team houses with 256px WebP textures, for the first view
// Meshopt quantises vertex data (sub-millimetre precision) and compresses it; the site decodes it
// with assets/stadium/meshopt_decoder.js. Run: npm run models
import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, copyFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "stadium-src/public/models";
const FULL = "public/assets/stadium/models";
const LITE = "public/assets/stadium/models-lite";
const TMP = ".superpowers/tmp-models";
const CLI = "stadium-src/node_modules/.bin/gltf-transform";
const TEAM_FILES = ["Carabell.glb", "brave_eagles.glb", "dreamchasers.glb", "ffk.glb", "firetails.glb",
  "hanoman.glb", "lwf.glb", "mathare.glb", "redwoods.glb", "we.glb"];

// field.glb keeps raw geometry: the scene widens its line strips by moving vertices in model units,
// which breaks on quantised (meshopt) positions. It is tiny anyway.
const KEEP_GEOMETRY = ["field.glb"];
const run = (...args) => execFileSync(CLI, args, { stdio: "pipe" });
for (const dir of [FULL, LITE, TMP]) { rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); }

const kb = (p) => Math.round(statSync(p).size / 1024);
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".glb"))) {
  const src = join(SRC, file);
  const webp = join(TMP, `webp-${file}`);
  run("webp", src, webp, "--quality", "90");
  if (KEEP_GEOMETRY.includes(file)) copyFileSync(webp, join(FULL, file));
  else run("meshopt", webp, join(FULL, file), "--level", "medium");
  if (TEAM_FILES.includes(file)) {
    const small = join(TMP, file);
    const smallWebp = join(TMP, `lite-${file}`);
    run("resize", src, small, "--width", "256", "--height", "256");
    run("webp", small, smallWebp, "--quality", "85");
    run("meshopt", smallWebp, join(LITE, file), "--level", "medium");
    console.log(`${file}: ${kb(src)} KB → full ${kb(join(FULL, file))} KB, lite ${kb(join(LITE, file))} KB`);
  } else {
    console.log(`${file}: ${kb(src)} KB → ${kb(join(FULL, file))} KB`);
  }
}
rmSync(TMP, { recursive: true, force: true });
