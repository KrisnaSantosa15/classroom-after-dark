import { expect, test } from "@playwright/test";

test("teacher can convene a topic and receive an interactive next move", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("What are you teaching or trying to solve?").fill("My seminar gets quiet after one student answers. How can I draw out better contributions?");
  await page.getByRole("button", { name: "Convene the room" }).click();

  await expect(page.getByText("The question in the room")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Open with a quiet first answer" })).toBeVisible();
  await page.getByRole("button", { name: "Let the lenses challenge each other" }).click();
  await expect(page.getByText("Energy is not enough.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy plan" })).toBeVisible();
});
