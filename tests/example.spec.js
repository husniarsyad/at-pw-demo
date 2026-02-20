const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/home.page');

test('homepage has title and link (POM)', async ({ page }, testInfo) => {
  const home = new HomePage(page);
  await home.goto();
  await expect(page).toHaveTitle(/Playwright/);
  await expect(home.getStarted).toHaveCount(1);

  // Capture full-page screenshot and attach to test results / Allure
  const screenshotPath = `screenshots/home-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('homepage-screenshot', { path: screenshotPath, contentType: 'image/png' });
});