// Makes an AVIF copy of every WebP photo in public/assets/img (the WebP stays as the fallback).
// Run: npm run images
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "public/assets/img";
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
let before = 0, after = 0;
for (const file of walk(ROOT).filter((f) => f.endsWith(".webp"))) {
  const out = file.replace(/\.webp$/, ".avif");
  await sharp(file).avif({ quality: 60, effort: 6 }).toFile(out);
  before += statSync(file).size; after += statSync(out).size;
}
console.log(`WebP ${(before / 1024).toFixed(0)} KB → AVIF ${(after / 1024).toFixed(0)} KB`);
