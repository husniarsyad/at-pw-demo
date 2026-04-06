const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/home.page');

// Constants
const SCREENSHOT_DIR = 'screenshots';
const PLAYWRIGHT_TITLE_REGEX = /Playwright/;
const DOCS_URL_REGEX = /docs/;
const EXPECTED_TABS_COUNT = 3; // Original + 3 language versions
const LANGUAGE_URLS = {
  python: '/python/',
  java: '/java/',
  dotnet: '/dotnet/',
};

/**
 * Helper function to capture and attach screenshots
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {import('@playwright/test').TestInfo} testInfo - Test info
 * @param {string} screenshotName - Name for the screenshot (without extension)
 * @param {string} attachmentName - Allure attachment name
 */
async function captureScreenshot(page, testInfo, screenshotName, attachmentName) {
  const timestamp = Date.now();
  const screenshotPath = `${SCREENSHOT_DIR}/${screenshotName}-${timestamp}.png`;

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(attachmentName, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}

// Test Suite
test.describe('Playwright Homepage Tests (POM)', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should display homepage with title and get started link', async ({ page }, testInfo) => {
    // Arrange & Act
    await homePage.goto();

    // Assert
    await expect(page).toHaveTitle(PLAYWRIGHT_TITLE_REGEX);
    await expect(homePage.getStarted).toHaveCount(1);

    // Capture evidence
    await captureScreenshot(page, testInfo, 'home', 'homepage-screenshot');
  });

  test('should verify there are clickable buttons on homepage', async ({ page }, testInfo) => {
    // Arrange & Act
    await homePage.goto();
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    // Assert
    expect(buttonCount).toBeGreaterThan(0);

    // Capture evidence
    await captureScreenshot(page, testInfo, 'buttons', 'buttons-screenshot');
  });

  test('should navigate to docs when clicking get started button', async ({ page }, testInfo) => {
    // Arrange & Act
    await homePage.goto();
    await homePage.clickGetStarted();

    // Assert
    await expect(page).toHaveURL(DOCS_URL_REGEX);

    // Capture evidence
    await captureScreenshot(page, testInfo, 'get-started', 'get-started-screenshot');
  });

  test('should open all language versions in new tabs', async ({ page, context }, testInfo) => {
    // Arrange
    await homePage.goto();
    await captureScreenshot(page, testInfo, 'language-switcher-before', 'language-switcher-before');

    // Act
    await expect(page).toHaveTitle(PLAYWRIGHT_TITLE_REGEX);
    await homePage.openLanguageVersionsInNewTabs();

    // Give tabs time to open
    await page.waitForTimeout(1000);

    // Assert - Verify multiple tabs are open
    const allPages = context.pages();
    expect(allPages.length).toBeGreaterThanOrEqual(EXPECTED_TABS_COUNT);

    // Assert - Verify each language version tab exists
    const pythonTab = allPages.find((p) => p.url().includes(LANGUAGE_URLS.python));
    const javaTab = allPages.find((p) => p.url().includes(LANGUAGE_URLS.java));
    const dotnetTab = allPages.find((p) => p.url().includes(LANGUAGE_URLS.dotnet));

    expect(pythonTab).toBeDefined();
    expect(javaTab).toBeDefined();
    expect(dotnetTab).toBeDefined();

    // Capture evidence - Python tab
    if (pythonTab) {
      await pythonTab.waitForLoadState('load');
      const pythonTitle = await pythonTab.title();
      expect(pythonTitle).toContain('Python');

      const timestamp = Date.now();
      const pythonScreenshotPath = `${SCREENSHOT_DIR}/python-tab-${timestamp}.png`;
      await pythonTab.screenshot({ path: pythonScreenshotPath, fullPage: true });
      await testInfo.attach('python-tab-screenshot', {
        path: pythonScreenshotPath,
        contentType: 'image/png',
      });
    }

    // Capture evidence - Java tab
    if (javaTab) {
      await javaTab.waitForLoadState('load');
      const javaTitle = await javaTab.title();
      expect(javaTitle).toContain('Java');

      const timestamp = Date.now();
      const javaScreenshotPath = `${SCREENSHOT_DIR}/java-tab-${timestamp}.png`;
      await javaTab.screenshot({ path: javaScreenshotPath, fullPage: true });
      await testInfo.attach('java-tab-screenshot', {
        path: javaScreenshotPath,
        contentType: 'image/png',
      });
    }

    // Capture evidence - .NET tab
    if (dotnetTab) {
      await dotnetTab.waitForLoadState('load');
      const dotnetTitle = await dotnetTab.title();
      expect(dotnetTitle).toContain('NET') || expect(dotnetTitle).toContain('.NET');

      const timestamp = Date.now();
      const dotnetScreenshotPath = `${SCREENSHOT_DIR}/dotnet-tab-${timestamp}.png`;
      await dotnetTab.screenshot({ path: dotnetScreenshotPath, fullPage: true });
      await testInfo.attach('dotnet-tab-screenshot', {
        path: dotnetScreenshotPath,
        contentType: 'image/png',
      });
    }

    // Capture evidence - Final state
    await captureScreenshot(page, testInfo, 'language-switcher-after', 'language-switcher-after');
  });
});
