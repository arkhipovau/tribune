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
