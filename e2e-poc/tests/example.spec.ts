import {
  test as base,
  chromium,
  expect,
  type BrowserContext,
  Page,
} from "@playwright/test";
import path from "path";
require("dotenv").config({ path: "./.env" });

let sharedContext: BrowserContext;

// Create the shared context outside of the test object
base.beforeAll(async () => {
  const pathToBitwarden = path.join(
    __dirname,
    "../extensions/bitwarden-chrome"
  );
  const userDataDir = path.join(__dirname, "../user-data");

  sharedContext = await chromium.launchPersistentContext("", {
    headless: false,
    colorScheme: "dark",
    args: [
      // `--headless=new`,
      `--disable-extensions-except=${pathToBitwarden}`,
      `--load-extension=${pathToBitwarden}`,
    ],
  });

  // Perform the necessary setup and login steps using the shared context
  // const page = sharedContext.pages()[0];
});

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    await use(sharedContext); // Use the shared context in each test
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.backgroundPages();
    if (!background) background = await context.waitForEvent("backgroundpage");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});

export { expect } from "@playwright/test"; // fix: export expect instead of redeclaring it

export const baseUrl = process.env.BASE_URL;
export const userEmail = process.env.USER_EMAIL;
export const userPassword = process.env.USER_PASSWORD;

export const bitwardenExtensionPage =
  "chrome-extension://apnlgjjklaonppebdmgeboagafdlmlgl/popup/index.html";
export const screenshotsDir = path.join(__dirname, "../screenshots");

test.beforeAll(async ({ context }) => {
  // open bitwarden extension popup
  const page = context.pages()[0];

  // configure environment
  await page.waitForTimeout(500);
  // await context.pages()[1].close(); // close the onInstall page
  await page.bringToFront();
  await page.pause();
  await page.goto(bitwardenExtensionPage + "#/environment");
  await page.waitForSelector("input[id='baseUrl']");
  // @ts-ignore
  await page.fill("input[id='baseUrl']", baseUrl);
  await page.screenshot({
    path: path.join(screenshotsDir, `environment_configured.png`),
  });
  await page.click("button[type='submit']");

  // login
  await page.waitForSelector("input[id='email']");
  // @ts-ignore
  await page.fill("input[id='email']", userEmail);
  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");

  await page.waitForSelector("input[id='masterPassword']");

  await page.waitForTimeout(1000); // bad, I know; not sure what selector to wait for
  // @ts-ignore
  await page.fill("input[id='masterPassword']", userPassword);
  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");
  // await page.pause(); // captcha :(
  await page.waitForSelector("h2[class='box-header']");

  // // configure autofill-on-page-load
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Auto-fill" }).click();
  await page.getByLabel("Auto-fill on page load").check();
  // await page.pause();
});

test.afterAll(async ({ context }) => {
  // delete user data;
});

export const loginWithKeyboardShortcut = async ({ page }) => {
  await page.locator("body").press("Meta+Shift+l"); // doesn't autofill for some reason; manual key presses work though?
  await page.pause();
  // press command+shift+9
  // await page.keyboard.press("Meta+Shift+9");
  // paste
  await page.fill(
    "input[id='email']",
    "Use the Ctrl/Cmd+Shift+L to autofill this field"
  );
  await page.pause(); // manually press Ctrl/Cmd+Shift+L ¯\_(ツ)_/¯
};

export const loginWithAutofillOnPageLoad = async ({ page }) => {
  await page.waitForTimeout(1000); // waiting for bitwarden to populate creds
  // await page.click("button[type='submit']");
  await page.keyboard.press("Enter");
};

export const loginTest = async (
  page: Page,
  url: string,
  loginFunction: { (page: any): Promise<void>; (arg0: any): void },
  loginSuccess: string
) => {
  try {
    await page.goto(url);
  } catch (error) {
    console.error("Error occurred during page navigation:", error);
  }
  await loginFunction(page);
  await page.screenshot({
    path: path.join(screenshotsDir, `${url}-autofill.png`),
  });
  const loginFailedMessage = page.getByText(loginSuccess);
  expect(loginFailedMessage).toBeTruthy();
};

// test("bitwarden", async ({ page }) => {
//   // this is how I'd like the tests to look, eventually
//   loginTest(
//     page,
//     "https://vault.example.com",
//     loginWithKeyboardShortcut,
//     "Invalid credentials"
//   );
//   // some assertion statement; might be cool to have the assertion as a param for loginTest
// });

test("kbin", async ({ page }) => {
  // this is how it currently works
  await page.bringToFront();
  await page.goto("https://kbin.social/login");
  loginWithAutofillOnPageLoad({ page }); // function name is a lie; actually just submits the form
  await page.screenshot({
    // asserting with your eyes :p
    path: path.join(screenshotsDir, `kbin-autofill.png`),
  });
  await expect(page.getByText("Invalid credentials")).toBeVisible();
});
