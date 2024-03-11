import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

const lighthouseDesktopConfig = require("lighthouse/lighthouse-core/config/lr-desktop-config");

const baseUrl = 'https://rahulshettyacademy.com'
test("Audits login page", async ({ playwright }) => {
  const browser = await playwright.chromium.launch({
  args: ['--remote-debugging-port=9222'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(baseUrl);
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
