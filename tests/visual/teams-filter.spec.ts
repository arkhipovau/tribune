import { test, expect } from "@playwright/test";

test("teams filter: country tag keeps only that country's teams and goes into the URL", async ({ page }) => {
  await page.goto("teams.html", { waitUntil: "load" });
  await page.getByRole("button", { name: /^Philippines/ }).click();
  await expect(page).toHaveURL(/country=philippines/);
  const visible = page.locator(".o-bento > [data-team]:not([hidden])");
  await expect(visible).toHaveCount(4);
  await expect(page.locator(".o-bento > [data-foundation-tile]:not([hidden])")).toHaveCount(0);
});

test("teams filter: foundation tag keeps its teams and its own tiles", async ({ page }) => {
  await page.goto("teams.html", { waitUntil: "load" });
  await page.getByRole("tab", { name: "Foundations" }).click();
  await page.getByRole("button", { name: /^Football for Humanity/ }).click();
  await expect(page.locator(".o-bento > [data-team]:not([hidden])")).toHaveCount(4);
  await expect(page.locator(".o-bento > [data-foundation-tile='ffh']:not([hidden])")).toHaveCount(2);
});

test("teams filter: a shared link opens filtered", async ({ page }) => {
  await page.goto("teams.html?type=girls", { waitUntil: "load" });
  await expect(page.locator(".o-bento > [data-team]:not([hidden])")).toHaveCount(2);
  await expect(page.getByRole("tab", { name: "Girls’ teams" })).toHaveAttribute("aria-selected", "true");
});
