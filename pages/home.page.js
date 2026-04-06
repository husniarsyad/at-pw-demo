/**
 * HomePage - Page Object Model for Playwright website homepage
 *
 * This class encapsulates all interactions with the Playwright homepage,
 * providing a clean interface for test scenarios.
 */
class HomePage {
  // Constants
  static BASE_URL = 'https://playwright.dev/';
  static DROPDOWN_TIMEOUT = 5000;
  static WAIT_BETWEEN_TABS = 1000;

  // Selectors
  static SELECTORS = {
    getStartedLink: 'text=Get started',
    headerSection: 'header',
    nodeJsButton: { role: 'button', name: 'Node.js' },
    navigationLabel: 'Main',
  };

  static LANGUAGES = {
    python: 'Python',
    java: 'Java',
    dotnet: '.NET',
  };

  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
    this.setupLocators();
  }

  /**
   * Initialize all page element locators
   * @private
   */
  setupLocators() {
    this.getStarted = this.page.locator(HomePage.SELECTORS.getStartedLink);
    this.header = this.page.locator(HomePage.SELECTORS.headerSection);
    this.nodeJsButton = this.page.getByRole(HomePage.SELECTORS.nodeJsButton.role, {
      name: HomePage.SELECTORS.nodeJsButton.name,
    });
  }

  /**
   * Get language link locator from dropdown
   * @param {string} languageName - Name of the language (e.g., 'Python', 'Java', '.NET')
   * @returns {import('@playwright/test').Locator}
   * @private
   */
  getLanguageLinkInDropdown(languageName) {
    return this.page
      .getByLabel(HomePage.SELECTORS.navigationLabel, { exact: true })
      .getByRole('link', { name: languageName });
  }

  /**
   * Navigate to the Playwright homepage
   */
  async goto() {
    await this.page.goto(HomePage.BASE_URL);
  }

  /**
   * Click the "Get started" button
   */
  async clickGetStarted() {
    await this.getStarted.click();
  }

  /**
   * Hover over the Node.js language selector button
   * to reveal the language dropdown menu
   */
  async hoverNodeJsButton() {
    await this.nodeJsButton.hover();
  }

  /**
   * Open language version pages in new tabs by Ctrl+clicking
   * each language link. Re-hovers before each click since the
   * dropdown closes after each click.
   *
   * @throws {Error} If dropdown links are not visible within timeout
   */
  async openLanguageVersionsInNewTabs() {
    await this.hoverNodeJsButton();

    // Wait for dropdown to appear
    const pythonLinkDropdown = this.getLanguageLinkInDropdown(HomePage.LANGUAGES.python);
    await pythonLinkDropdown.waitFor({
      state: 'visible',
      timeout: HomePage.DROPDOWN_TIMEOUT,
    });

    // Get all language links from the dropdown
    const javaLink = this.getLanguageLinkInDropdown(HomePage.LANGUAGES.java);
    const dotnetLink = this.getLanguageLinkInDropdown(HomePage.LANGUAGES.dotnet);

    // Ctrl+Click to open each language in new tabs
    // Re-hover before each click to keep dropdown visible
    await pythonLinkDropdown.click({ modifiers: ['Control'] });
    await this.hoverNodeJsButton();

    await javaLink.click({ modifiers: ['Control'] });
    await this.hoverNodeJsButton();

    await dotnetLink.click({ modifiers: ['Control'] });
  }

  /**
   * Get all open pages/tabs in the current context
   * @returns {Promise<import('@playwright/test').Page[]>}
   */
  async getOpenTabs() {
    return this.page.context().pages();
  }
}

module.exports = HomePage;
