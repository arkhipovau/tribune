// Subsets the brand fonts (fonts-src/, not deployed) to the characters the site uses and saves WOFF2.
// Run: npm run fonts   (needs python3 with fontTools + brotli)
import { execFileSync } from "node:child_process";
const UNICODES = "U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201E,U+2022,U+2026,U+2190-2193,U+20AC,U+2122";
const FONTS = [["Youth-Medium.ttf", "Youth-Medium.woff2"], ["SuisseIntl-Book.otf", "SuisseIntl-Book.woff2"], ["SuisseIntl-SemiBold.otf", "SuisseIntl-SemiBold.woff2"]];
for (const [src, out] of FONTS) {
  execFileSync("python3", ["-m", "fontTools.subset", `fonts-src/${src}`, `--unicodes=${UNICODES}`,
    "--flavor=woff2", "--layout-features=*", `--output-file=public/assets/fonts/${out}`], { stdio: "inherit" });
}
