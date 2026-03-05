import { test, expect } from "@playwright/test";

test("shows validation error for invalid imdb id", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("IMDb Movie ID").fill("invalid");
  await page.getByRole("button", { name: /analyze movie/i }).click();
  // Target the validation alert specifically (by text) in case multiple elements have role="alert"
  await expect(page.getByRole("alert").filter({ hasText: /valid IMDb ID/ })).toContainText("valid IMDb ID");
});

