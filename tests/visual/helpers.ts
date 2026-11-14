import type { Page } from "@playwright/test";

/** Collects console errors and failed requests for the page's lifetime. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  // Failed requests are reported by URL below; the browser's generic console line
  // ("Failed to load resource") carries no URL, so it is skipped here.
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(m.text().slice(0, 300));
  });
  page.on("response", (r) => {
    // The site has no favicon yet (added in the optimisation task); every other 4xx/5xx counts.
    if (r.status() >= 400 && !r.url().endsWith("/favicon.ico")) errors.push(`${r.status()} ${r.url()}`);
  });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
  return errors;
}

/** Opens a page and waits until fonts and images are in. */
export async function openSettled(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
}

/** WebGL canvases (stadium, about arena) are not deterministic: mask them. */
export const webglMasks = (page: Page) => [page.locator("canvas")];
