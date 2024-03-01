import { Page, Locator } from '@playwright/test';

export default class OrdersPage {
  page: Page;
  
  
  


  constructor(page: Page) {
    this.page = page;
  }
}