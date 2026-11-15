// Team images for the site from the team content pack (not in the repo; default
// ~/Tribune-context/team_content). Every image gets an AVIF (q72) and a WebP (q88) copy,
// sized with headroom for Retina screens. Run: npm run team-images [source dir]
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SRC = process.argv[2] ?? join(homedir(), "Tribune-context/team_content");
const OUT = "public/assets/img/teams";
// content folder → site id (ids match the 3D stadium's TEAMS)
const TEAMS = {
  "carabell club": "carabell", "kids football club": "ffk", "brave eagles": "brave_eagles",
  "dream chasers": "dreamchasers", "firetails": "firetails", "hanoman": "hanoman",
  "life with football": "lwf", "mathare stars": "mathare", "red woods": "redwoods", "we football": "we",
};
// file role → output name and max width (px)
const ROLES = [
  ["_house.", "house", 1800], ["_house.", "house-card", 1200], ["_photo.", "photo", 1600],
  ["_poster.", "poster", 1024], ["_jersey_front.", "kit-front", 1024], ["_jersey_back.", "kit-back", 1024],
  ["_logo.", "logo", 512],
];

for (const [folder, id] of Object.entries(TEAMS)) {
  const dir = join(SRC, folder);
  if (!existsSync(dir)) { console.warn("missing", dir); continue; }
  const files = readdirSync(dir);
  mkdirSync(join(OUT, id), { recursive: true });
  for (const [marker, name, width] of ROLES) {
    const file = files.find((f) => f.toLowerCase().includes(marker) && /\.(png|jpe?g)$/i.test(f));
    if (!file) { console.warn(`${id}: no ${marker}`); continue; }
    const base = sharp(join(dir, file)).resize({ width, withoutEnlargement: true });
    await base.clone().avif({ quality: 72, effort: 6 }).toFile(join(OUT, id, `${name}.avif`));
    await base.clone().webp({ quality: 88, effort: 6 }).toFile(join(OUT, id, `${name}.webp`));
  }
  console.log("done", id);
}
