import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigating to login page and save the state as 'notLoggedInState.json'
  await page.goto('https://rahulshettyacademy.com/client')
  await page.context().storageState({ path: 'notLoggedInState.json' });

  // login
  await page.locator("#userEmail").fill("QA@tester.com");
  await page.locator("#userPassword").fill("Qa123456$");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState('networkidle');

  // save signed-in state to 'loggedInState.json'
  await page.context().storageState({ path: 'loggedInState.json' });
  await browser.close();
}

export default globalSetup;