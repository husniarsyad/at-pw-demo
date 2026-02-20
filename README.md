# Playwright Test Template

Quick scaffold for Playwright Test (JavaScript).

Setup:

```bash
npm install
npx playwright install
npm test

# generate Allure report (after tests finish)
npm run allure:generate
npm run allure:open
```

Files:
- `playwright.config.js` - config
- `tests/example.spec.js` - sample test

Page Object Model (POM)

This template includes a simple Page Object for the Playwright site:

- `pages/home.page.js` — exposes `goto()` and `getStarted` locator.

Example usage is in `tests/example.spec.js` which constructs the page object and uses it in assertions.

Screenshots

- Tests will capture screenshots on failure (configured in `playwright.config.js`).
- The example test also saves and attaches a full-page screenshot to the test results and Allure.

Generated artifacts to view:
- Playwright HTML report: `playwright-report/index.html`
- Allure report: generate with `npm run allure:generate` and open with `npm run allure:open`
- Clear Allure artifacts: `npm run allure:clear`
- Full Allure run (clear → test → generate): `npm run test:allure`
- Full Allure run and open: `npm run test:allure:open`
