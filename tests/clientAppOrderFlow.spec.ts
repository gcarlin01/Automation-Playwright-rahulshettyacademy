import { test, expect } from '@playwright/test';

test.describe("Client App Order Flow", () => {
  test.use({ storageState: "loggedInStateQA2.json" });
  test("User adds products to cart", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");   
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles); 
  })
});
