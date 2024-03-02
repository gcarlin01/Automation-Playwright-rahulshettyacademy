import { Page, Locator } from '@playwright/test';

export default class CartPage {
  page: Page;
  checkoutButton: Locator;
  firstCartProduct: Locator;


  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator("text=Checkout");
    this.firstCartProduct = page.locator("div li").first();
  }
  async goToCheckout() {
    await this.checkoutButton.click();
    await this.page.locator("text=Place Order").waitFor();
  }

  getProductLocator(productName: string) {
    return this.page.locator("h3:has-text('"+productName+"')");
  }

  async checkIfProductIsDisplayed(productName: string) {
    await this.firstCartProduct.waitFor();
    const productNameVisibility = await this.getProductLocator(productName).isVisible();
    return productNameVisibility;
    
  }

  
}