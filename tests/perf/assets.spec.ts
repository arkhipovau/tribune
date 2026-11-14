import { test, expect } from "@playwright/test";

test("web fonts are served as woff2", async ({ page }) => {
  const fonts: string[] = [];
  page.on("response", (r) => { if (r.request().resourceType() === "font") fonts.push(r.url()); });
  await page.goto("index.html", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  expect(fonts.length).toBeGreaterThan(0);
  expect(fonts.filter((u) => !u.includes(".woff2"))).toEqual([]);
});

test("favicon exists", async ({ request, baseURL }) => {
  const res = await request.get(new URL("favicon.svg", baseURL).href);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/svg");
});

test("stadium first load stays light: lite houses, under 7 MB of model files", async ({ page }) => {
  test.setTimeout(120_000);
  const glb: { url: string; bytes: number }[] = [];
  page.on("response", async (r) => {
    if (!r.url().endsWith(".glb")) return;
    try { glb.push({ url: r.url(), bytes: (await r.body()).length }); } catch { /* aborted */ }
  });
  await page.goto("index.html", { waitUntil: "load" });
  await expect.poll(() => glb.length, { timeout: 60_000 }).toBeGreaterThanOrEqual(15);
  await page.waitForTimeout(2000);
  const total = glb.reduce((s, g) => s + g.bytes, 0);
  expect(glb.filter((g) => g.url.includes("/carabell") || g.url.includes("/Carabell")).every((g) => g.url.includes("/models-lite/"))).toBe(true);
  expect(total).toBeLessThan(7 * 1024 * 1024);
});

test("repeat visit serves stadium models from the service worker cache", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("index.html", { waitUntil: "load" });
  await page.waitForFunction(() => navigator.serviceWorker?.controller || navigator.serviceWorker?.ready.then(() => true), null, { timeout: 15_000 });
  await page.waitForTimeout(8000); // let the first visit fill the cache
  const fromCache: boolean[] = [];
  page.on("response", (r) => { if (r.url().endsWith(".glb")) fromCache.push(r.fromServiceWorker()); });
  await page.reload({ waitUntil: "load" });
  await expect.poll(() => fromCache.length, { timeout: 60_000 }).toBeGreaterThanOrEqual(10);
  expect(fromCache.every(Boolean)).toBe(true);
});

test("photos are served as AVIF", async ({ page }) => {
  const images: string[] = [];
  page.on("response", (r) => { if (r.request().resourceType() === "image" && r.url().includes("/assets/img/")) images.push(r.url()); });
  await page.goto("index.html", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  expect(images.length).toBeGreaterThan(0);
  expect(images.filter((u) => !u.endsWith(".avif"))).toEqual([]);
});
