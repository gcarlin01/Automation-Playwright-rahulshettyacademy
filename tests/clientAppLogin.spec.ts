import { test, expect } from '@playwright/test';
import { usersLoginData } from '../utils/usersLoginData';
import POManager from '../pages/POManager';

test.describe('Client App Login page @smoke', () => {
  
  // test.use({ storageState: "notLoggedInState.json" });
  test(' User is able to log in', async ({ page }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await expect(page).toHaveTitle("Let's Shop");
    await expect(page.getByText("Practice Website for Rahul Shetty Academy Students ")).toBeVisible();
    await expect (page).toHaveURL("https://rahulshettyacademy.com/client/auth/login");
    await loginPage.login(usersLoginData.userOne.email, usersLoginData.userOne.password);
    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/dashboard/dash");
  });
});

