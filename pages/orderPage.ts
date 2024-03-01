import { Page, Locator } from '@playwright/test';

export default class OrdersPage {
  page: Page;
  selectCountry: Locator;
  countryDropdown: Locator;
  formEmailId: Locator;
  placeOrderButton: Locator;
  
  
  


  constructor(page: Page) {
    this.page = page;
    this.selectCountry = page.locator("[placeholder*='Country']");
    this.countryDropdown = page.locator(".ta-results");
    this.formEmailId = page.locator(".user__name [type='text']").first();
    this.placeOrderButton = page.locator(".action__submit");
  }


  async searchCountryAndSelect(country: string) {
    await this.selectCountry.pressSequentially(country);
    await this.countryDropdown.waitFor();
    const countryOptionsCount = await this.countryDropdown.locator("button").count();
    for (let i = 0; i < countryOptionsCount; ++i) {
      if (await this.countryDropdown.locator("button").nth(i).textContent() === " Peru") {
        await this.countryDropdown.locator("button").nth(i).click();
        break;
      }
    }
  }

  async getFormEmailId() {
    return await this.formEmailId.textContent();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}