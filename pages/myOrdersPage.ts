import { Page, Locator } from '@playwright/test';

export default class MyOrdersPage {
  page: Page;
  orderRows: Locator;
  
  


  constructor(page: Page) {
    this.page = page;
    this.orderRows = page.locator("tbody tr");
    
  }

  async searchOrderAndClickOnViewDetails(orderId: string) {
    const orderRowsCount = await this.orderRows.count();
    for (let i = 0; i < orderRowsCount; ++i) {
      const rowOrderId = await this.orderRows.nth(i).locator("th").textContent();
      if (orderId && rowOrderId && orderId.includes(rowOrderId)) {
        await this.orderRows.nth(i).locator("button").first().click();
        break;
      }
    }
  }
}