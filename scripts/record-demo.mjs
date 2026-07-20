import { chromium } from "@playwright/test";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const appUrl = process.env.DEMO_URL || "http://127.0.0.1:3000";
const outputDir = path.resolve("output/demo-video");
const outputFile = path.join(outputDir, "classroom-after-dark-demo.webm");
const topic = "My seminar gets quiet after one student answers. How can I draw out better contributions?";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  colorScheme: "dark",
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outputDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

await page.goto(appUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1600);

const topicField = page.getByLabel("What are you teaching or trying to solve?");
await topicField.type(topic, { delay: 15 });
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Convene the room" }).click();
await page.getByRole("heading", { name: "What needs to happen before the room moves on?" }).waitFor();
await page.waitForTimeout(2600);

await page.locator(".recommendation").scrollIntoViewIfNeeded();
await page.waitForTimeout(1700);
await page.getByRole("button", { name: "Let the lenses challenge each other" }).click();
await page.waitForTimeout(2500);

const video = page.video();
await context.close();
await browser.close();

if (!video) throw new Error("Playwright did not attach a video recorder.");
await copyFile(await video.path(), outputFile);
console.log(outputFile);
