import { resolve } from 'path';
import { test, expect } from '@playwright/test';
import AutofillService from '../autofill.service';
import { BrowserApi } from '../browserApi';

test.beforeEach(async ({ context }) => {
  await context.addInitScript({
    path: resolve(__dirname, '../../autofill.js'),
  });
});

const autofillService = new AutofillService();

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {


  await page.goto('https://vault.bitwarden.com/');

  await page.evaluate(() => (window as any).fillForm({
    command: "collectPageDetails",
  }, console.log));

  //const data = await autofillService.getFormsWithPasswordFields()

 

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator
  const getStarted = page.locator('text=Get Started');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
