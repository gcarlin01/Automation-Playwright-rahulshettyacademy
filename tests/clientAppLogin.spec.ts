import { test, expect } from '@playwright/test';
import { usersLoginData } from '../utils/usersLoginData';

test.describe('Client App Login page', () => {
  
  // test.use({ storageState: "notLoggedInState.json" });
  test(' User is able to log in', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");
    // Expects page to have a title and a text.
    await expect(page).toHaveTitle("Let's Shop");
    await expect(page.getByText("Practice Website for Rahul Shetty Academy Students ")).toBeVisible();
    // Expects page to get redirect to login page.
    await expect (page).toHaveURL("https://rahulshettyacademy.com/client/auth/login");
    // User is able to Login to the page.
    await page.locator("#userEmail").fill(usersLoginData.userOne.email);
    await page.locator("#userPassword").fill(usersLoginData.userOne.password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    // Expects page to get redirect to dashboard page upon successful login.
    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/dashboard/dash");
  });
});

