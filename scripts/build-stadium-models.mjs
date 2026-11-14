// Prepares the stadium models for the site from the 3D artist's originals.
//   stadium-src/public/models/*.glb  (originals, untouched)
//   → public/assets/stadium/models/       full models, textures as WebP (q90)
//   → public/assets/stadium/models-lite/  team houses with 256px WebP textures, for the first view
// Geometry is not changed. Run: node scripts/build-stadium-models.mjs
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

const run = (...args) => execFileSync(CLI, args, { stdio: "pipe" });
for (const dir of [FULL, LITE, TMP]) { rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); }

const kb = (p) => Math.round(statSync(p).size / 1024);
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".glb"))) {
  const src = join(SRC, file);
  run("webp", src, join(FULL, file), "--quality", "90");
  if (TEAM_FILES.includes(file)) {
    const small = join(TMP, file);
    run("resize", src, small, "--width", "256", "--height", "256");
    run("webp", small, join(LITE, file), "--quality", "85");
    console.log(`${file}: ${kb(src)} KB → full ${kb(join(FULL, file))} KB, lite ${kb(join(LITE, file))} KB`);
  } else {
    console.log(`${file}: ${kb(src)} KB → ${kb(join(FULL, file))} KB`);
  }
}
rmSync(TMP, { recursive: true, force: true });
