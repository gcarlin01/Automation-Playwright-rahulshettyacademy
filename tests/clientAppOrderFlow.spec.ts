import { test, expect } from '@playwright/test';
import { usersLoginData } from '../utils/usersLoginData';

test.describe("Client App Order Flow", () => {
  test.use({ storageState: "loggedInStateQA1.json" });
  test("User is able to place an order", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");   
    await page.locator(".card-body b").first().waitFor();
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
      await page.locator("text=Checkout").click();
      await page.locator("[placeholder*='Country']").pressSequentially("pe");
      const countryDropdown = await page.locator(".ta-results");
      await countryDropdown.waitFor();
      const countryOptionsCount = await countryDropdown.locator("button").count();
      for (let i = 0; i < countryOptionsCount; ++i) {
        if (await countryDropdown.locator("button").nth(i).textContent() === " Peru") {
          await countryDropdown.locator("button").nth(i).click();
          break;
        }
      }
      expect(page.locator(".user__name [type='text']").first()).toHaveText(usersLoginData.userOne.email);
      await page.locator(".action__submit").click();
      await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
      
  })
});
