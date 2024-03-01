import { Page, Locator } from '@playwright/test';

export default class OrderDetailsPage {
  page: Page;
  orderIdDetails: Locator;
  
  
  constructor(page: Page) {
    this.page = page;
    this.orderIdDetails = page.locator(".col-text");
  }

  async getOrderId() {
   return await this.orderIdDetails.textContent();
  }
}