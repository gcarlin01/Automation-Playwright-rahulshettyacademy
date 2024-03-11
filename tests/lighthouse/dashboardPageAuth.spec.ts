import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import POManager from '../../pages/POManager';
const lighthouseDesktopConfig = require("lighthouse/lighthouse-core/config/lr-desktop-config");


test.use({ storageState: "loggedInStateQA2.json" });

test("Audits dashboard page", async ({ playwright }) => {
  const browser = await playwright.chromium.launch({
  args: ['--remote-debugging-port=9222'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  
  
  await playAudit({
    thresholds: {
      performance: 50,
      accessibility: 50,
      seo: 50,
      'best-practices': 50,
      pwa: 50,
    },
    ignoreError: true,
    port: 9222,
    page: page,
    config: lighthouseDesktopConfig,
    reports: {
      formats: {html: true},
      name: 'lighthouse-report',
      directory: 'lighthouse-reports' + Date.now().toString(),
    },
  });
  await page.close();
  await context.close();
  await browser.close();
});


