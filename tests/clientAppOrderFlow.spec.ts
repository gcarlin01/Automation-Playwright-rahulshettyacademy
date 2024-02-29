import { test, expect } from '@playwright/test';

test.describe("Client App Order Flow", () => {
  test.use({ storageState: "loggedInStateQA1.json" });
  test("User adds products to cart", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");   
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
       const productName = "ZARA COAT 3"
       const products = page.locator(".card-body");
       const count = await products.count();
       for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
          //add to cart
          await products.nth(i).locator("text= Add To Cart").click();
          break;
        }
      }
      await page.locator("[routerlink*='cart']").click();
      await page.locator("div li").first().waitFor();;
      const firstCartProductName = await page.locator("h3").nth(1).textContent()
      expect(firstCartProductName).toBe(productName);
  })
});
