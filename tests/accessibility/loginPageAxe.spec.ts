import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';


// Automated accessibility tests can detect some common accessibility problems such as missing or invalid properties. But many accessibility problems can only be discovered through manual testing. It is recommended using a combination of automated testing, manual accessibility assessments, and inclusive user testing. For manual assessments, it is recommended Accessibility Insights for Web, a free and open source dev tool that walks you through assessing a website for WCAG 2.1 AA coverage.
test.describe('Accessibility tests on Login page', () => {
  test('Login page should not have any automatically detectable WCAG accessibility issues', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("[value='Login']").waitFor();

    // Checks the whole page
    const axeBuilder = await new AxeBuilder({page}).analyze();
    expect(axeBuilder.violations).toEqual([]);
    // Test fails because it finds +475 accessibility issues including best practice and contrast issues
  })

  test.only('Login button should not have any WCAG accessibility issues', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("[value='Login']").waitFor();

    // Checks an specific selector
    const axeBuilder = await new AxeBuilder({page}).include("[value='Login']").analyze();
    expect(axeBuilder.violations).toEqual([]);
  })

  test('Login page should not have any WCAG accessibility issues excluding the anchor tags', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("[value='Login']").waitFor();

    // Checks the whole page excluding anchor tags
    const axeBuilder = await new AxeBuilder({page}).exclude("a").analyze();
    expect(axeBuilder.violations).toEqual([]);
    // Test fails because it continues to find +202 accessibility issues
  })

  test('Login page should not have any automatically detectable accessibility issues based on Axe tags', async ({ page }) => {
    //Each rule in axe-core has a number of tags. These provide metadata about the rule. Each rule has one tag that indicates which WCAG version / level it belongs to.
    // To know more about Axe tags, visit https://www.deque.com/axe/core-documentation/api-documentation/#tag
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("[value='Login']").waitFor();

    // Checks the whole page
    const axeBuilder = await new AxeBuilder({page}).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(axeBuilder.violations).toEqual([]);
    // Test fails because it finds +253 accessibility issues within the tags success criteria
  })

  test('Login page should not have any automatically detectable WCAG accessibility issues by disabling some rules', async ({ page }) => {
    // For better context on how to disable rules, visit this repo: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("[value='Login']").waitFor();

    // Checks the whole page with disabled rules
    // Dissabling these rules:
    // 1. Ensures links have discernible text = "link-name"
    // 2. Ensures the document has a main landmark = "landmark-one-main"

    const axeBuilder = await new AxeBuilder({page}).disableRules(["link-name", "landmark-one-main"]).analyze();
    expect(axeBuilder.violations).toEqual([]);
    // Test fails because it finds +191 accessibility issues with this page after disabling the rules
  })


});