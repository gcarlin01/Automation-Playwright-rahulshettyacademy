import { Page, Locator } from '@playwright/test';

export default class ThanksPage {
  page: Page;
  orderId: Locator;
  thanksMessage: Locator;

  


  constructor(page: Page) {
    this.page = page;
    this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    this.thanksMessage = page.locator(".hero-primary");
  }

  async getOrderId() {
   return await this.orderId.textContent();
  }

  async getThanksMessage() {
    return await this.thanksMessage.textContent();
  }
}