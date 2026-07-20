import { expect, test } from "@playwright/test";

test("teacher can rehearse, branch, compare, and create a Teach Tomorrow pack", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rehearse the fractions lesson" }).click();
  await page.getByRole("button", { name: "Open the signal deck" }).click();
  await page.getByRole("button", { name: "Dim the room. Start rehearsal" }).click();

  await page.getByRole("button", { name: /Explain it again/ }).click();
  await expect(page.getByText("Why the rehearsal shifted")).toBeVisible();
  await page.getByRole("button", { name: "Branch from this moment" }).click();
  await page.getByRole("button", { name: /Show, pair, then prove/ }).click();
  await expect(page.getByRole("heading", { name: /Keep the move that/ })).toBeVisible();

  await expect(page.locator(".route-card--branch").getByRole("button", { name: "This is the route to keep" })).toBeVisible();
  await page.getByRole("button", { name: /Commit this into tomorrow/ }).click();
  await expect(page.getByRole("heading", { name: /Teach Tomorrow/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Show, pair, then prove" })).toBeVisible();
});
