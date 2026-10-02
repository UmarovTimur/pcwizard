import { expect, test } from "@playwright/test";

test("корень редиректит на язык по умолчанию", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});
