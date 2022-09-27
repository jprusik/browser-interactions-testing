"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const test_1 = require("@playwright/test");
const autofill_service_1 = require("../autofill.service");
test_1.test.beforeEach(async ({ context }) => {
    await context.addInitScript({
        path: (0, path_1.resolve)(__dirname, '../../autofill.js'),
    });
});
const autofillService = new autofill_service_1.default();
(0, test_1.test)('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
    await page.goto('https://vault.bitwarden.com/');
    await page.evaluate(() => window.fillForm({
        command: "collectPageDetails",
    }, console.log));
    //const data = await autofillService.getFormsWithPasswordFields()
    // Expect a title "to contain" a substring.
    await (0, test_1.expect)(page).toHaveTitle(/Playwright/);
    // create a locator
    const getStarted = page.locator('text=Get Started');
    // Expect an attribute "to be strictly equal" to the value.
    await (0, test_1.expect)(getStarted).toHaveAttribute('href', '/docs/intro');
    // Click the get started link.
    await getStarted.click();
    // Expects the URL to contain intro.
    await (0, test_1.expect)(page).toHaveURL(/.*intro/);
});
//# sourceMappingURL=example.spec.js.map