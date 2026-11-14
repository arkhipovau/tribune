import { defineConfig } from "@playwright/test";

// The site under test. Task 1: the current static site; later tasks point this
// at `vite preview` (base /tribune/) without touching the specs.
const BASE_URL = process.env.SITE_URL ?? "http://localhost:4173/";

export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: "disabled" } },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  use: { baseURL: BASE_URL, channel: "chrome", headless: true },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
  webServer: process.env.SITE_URL ? undefined : {
    command: "python3 -m http.server 4173",
    url: "http://localhost:4173/index.html",
    reuseExistingServer: true,
  },
});
