class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.getStarted = page.locator('text=Get started');
    this.header = page.locator('header');
  }

  async goto() {
    await this.page.goto('https://playwright.dev/');
  }

  async clickGetStarted() {
    await this.getStarted.click();
  }
}

module.exports = HomePage;
