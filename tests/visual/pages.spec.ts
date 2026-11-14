import { test, expect } from "@playwright/test";
import { openSettled, watchErrors, webglMasks } from "./helpers";

const PAGES = [
  { name: "home", path: "index.html" },
  { name: "teams", path: "teams.html" },
  { name: "team-carabell", path: "team.html?id=carabell" },
  { name: "about", path: "about.html" },
];

for (const p of PAGES) {
  test(`page ${p.name} matches baseline and has no console errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await openSettled(page, p.path);
    await expect(page).toHaveScreenshot(`${p.name}.png`, { fullPage: true, mask: webglMasks(page) });
    expect(errors).toEqual([]);
  });
}
