import { test, expect } from "@playwright/test";
import { openSettled, webglMasks } from "./helpers";

const STOPS = [0, 0.25, 0.5, 0.75, 1];

/** Scrolls so that `progress` of the section's scroll range has passed. */
async function scrollThrough(page: import("@playwright/test").Page, id: string, progress: number) {
  await page.evaluate(([sel, k]) => {
    const el = document.getElementById(sel as string)!;
    const top = el.getBoundingClientRect().top + scrollY;
    const range = Math.max(0, el.offsetHeight - innerHeight);
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.style.scrollSnapType = "none";
    scrollTo(0, top + range * (k as number));
  }, [id, progress]);
  await page.waitForTimeout(700);
}

for (const id of ["stadium", "how"]) {
  for (const k of STOPS) {
    test(`scroll scene #${id} at ${k * 100}%`, async ({ page }) => {
      await openSettled(page, "index.html");
      await scrollThrough(page, id, k);
      await expect(page).toHaveScreenshot(`scene-${id}-${k * 100}.png`, { mask: webglMasks(page) });
    });
  }
}

test("menu link jumps to the journal", async ({ page, isMobile }) => {
  test.skip(isMobile, "the header nav is hidden on mobile");
  await openSettled(page, "index.html");
  await page.locator('header a[href="#journal"]').click();
  await page.waitForTimeout(800);
  const top = await page.locator("#journal").evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThanOrEqual(2);
});

test("stadium models load on the home page only", async ({ page }) => {
  const glb: string[] = [];
  page.on("request", (r) => { if (r.url().endsWith(".glb")) glb.push(r.url()); });
  for (const path of ["teams.html", "team.html?id=carabell", "about.html"]) await openSettled(page, path);
  expect(glb).toEqual([]);
  // The loader starts 800px before the section, which on the home page is right away.
  await openSettled(page, "index.html");
  await expect.poll(() => glb.length, { timeout: 15_000 }).toBeGreaterThan(0);
});
