import { Page, Locator } from '@playwright/test';

export default class DashboardPage {
  page: Page;
  products: Locator;
  cart: Locator;
  orders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator(".card-body");
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']"); 
  }

  async searchAndAddToCart(productName: string) {
       const count = await this.products.count();
       for (let i = 0; i < count; ++i) {
        if (await this.products.nth(i).locator("b").textContent() === productName) {
          //Adds to cart
          await this.products.nth(i).locator("text= Add To Cart").click();
          break;
        }
      }
  }

  async goToCart() {
    await this.cart.click();
    await this.page.locator("div li").first().waitFor();
  }

  async goToMyOrders() {
    await this.orders.click();
    await this.page.locator("tbody").waitFor();
  }
}