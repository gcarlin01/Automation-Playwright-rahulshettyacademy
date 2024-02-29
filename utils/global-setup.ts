import { chromium, FullConfig, Page } from '@playwright/test';
import { usersLoginData } from './usersLoginData';

async function globalSetup(config: FullConfig) {
  // Function to login and save state
  const loginAndSaveState = async (page: Page, userData: { email: string, password: string }, stateFileName: string) => {
    await page.goto('https://rahulshettyacademy.com/client'); // Increase timeout to 60 seconds

    // login
    await page.locator("#userEmail").fill(userData.email);
    await page.locator("#userPassword").fill(userData.password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    // save signed-in state
    await page.context().storageState({ path: `loggedInState${stateFileName}.json` });
  };

  const browser = await chromium.launch();
  const page = await browser.newPage();


  // Login as the first user and save state
  await loginAndSaveState(page, usersLoginData.userOne, 'QA1');

  // Create a new page for the second user
  const pageForSecondUser = await browser.newPage();

  // Login as the second user and save state
  await loginAndSaveState(pageForSecondUser, usersLoginData.userTwo, 'QA2');

  // Close the browser
  await browser.close();
}

export default globalSetup;