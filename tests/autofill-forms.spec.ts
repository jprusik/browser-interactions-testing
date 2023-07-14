import { Page } from "@playwright/test";
import path from "path";

import { testPages } from "./constants";
import { test, expect } from "./fixtures";

export const screenshotsOutput = path.join(__dirname, "../screenshots");

let testPage: Page;

const vaultEmail = process?.env?.VAULT_EMAIL || "";
const vaultPassword = process?.env?.VAULT_PASSWORD || "";
const serverHostURL = process?.env?.SERVER_HOST_URL;
const debugIsActive = ["1", "console"].includes(process.env.PWDEBUG);

test.describe("Extension autofills forms when triggered", () => {
  test("Log in to the vault, open pages, and autofill forms", async ({
    context,
    extensionId,
  }) => {
    const [backgroundPage] = context.backgroundPages();

    function doAutofill() {
      backgroundPage.evaluate(() =>
        chrome.tabs.query(
          { active: true },
          (tabs) =>
            tabs[0] &&
            chrome.tabs.sendMessage(tabs[0]?.id || 0, {
              command: "collectPageDetails",
              tab: tabs[0],
              sender: "autofill_cmd",
            }),
        ),
      );
    }

    await test.step("Close the extension welcome page when it pops up", async () => {
      // If not in debug, wait for the extension to open the welcome page before continuing
      if (!debugIsActive) {
        await context.waitForEvent("page");
      }

      let contextPages = context.pages();
      expect(contextPages.length).toBe(2);

      const welcomePage = contextPages[1];
      if (welcomePage) {
        welcomePage.close();
      }

      testPage = contextPages[0];
    });

    await test.step("Configure the environment", async () => {
      // @TODO check for and fill other settings
      if (serverHostURL) {
        await testPage.goto(
          `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/environment`,
          { waitUntil: "domcontentloaded" },
        );
        await testPage.waitForSelector("input#baseUrl");

        await testPage.fill("input#baseUrl", serverHostURL);

        await testPage.screenshot({
          path: path.join(screenshotsOutput, `environment_configured.png`),
        });

        await testPage.click("button[type='submit']");
      }
    });

    await test.step("Log in to the extension vault", async () => {
      // @TODO temporary workaround for the live URL-encoding not matching output of `encodeURI` or `encodeURIComponent`
      const urlEncodedLoginEmail = encodeURI(vaultEmail).replace("+", "%2B");

      await testPage.goto(
        `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/login?email=${urlEncodedLoginEmail}`,
        { waitUntil: "domcontentloaded" },
      );

      await testPage.waitForSelector("input#masterPassword");
      await testPage.fill("input#masterPassword", vaultPassword);
      await testPage.waitForSelector("form button[type='submit']");
      await testPage.click("form button[type='submit']");

      await testPage.waitForURL(
        `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/tabs/vault`,
        { waitUntil: "domcontentloaded" },
      );
      await testPage.waitForSelector("app-vault-filter main .box.list");
    });

    for (const page of testPages) {
      const { url, inputs } = page;

      await test.step(`Autofill the form on page ${url}`, async () => {
        const navigationPromise = testPage.waitForNavigation({
          waitUntil: "domcontentloaded",
        });
        await testPage.setDefaultNavigationTimeout(0);
        await testPage.goto(url);
        await navigationPromise;

        const hiddenFormSelector = page.hiddenForm.iframeSource
          ? `iframe[src^="${page.hiddenForm.iframeSource}"]`
          : page.hiddenForm.formSelector;
        if (page.hiddenForm && hiddenFormSelector) {
          await testPage.click(page.hiddenForm.triggerSelector);
          await testPage.waitForSelector(hiddenFormSelector, {
            state: "visible",
          });

          if (page.hiddenForm.iframeSource) {
            const iframeElement = await testPage
              .locator(hiddenFormSelector)
              .elementHandle();
            const frame = await iframeElement.contentFrame();
            await frame.waitForURL(
              new RegExp(`.*${page.hiddenForm.iframeSource}.*`, "i"),
            );
          }
        }

        doAutofill();

        const inputKeys = Object.keys(inputs);
        const testedFrame = Boolean(hiddenFormSelector)
          ? testPage.frameLocator(hiddenFormSelector)
          : testPage;

        for (const inputKey of inputKeys) {
          const currentInput = inputs[inputKey];
          await expect
            // @TODO do not soft expect on local test pages
            .soft(testedFrame.locator(currentInput.selector))
            .toHaveValue(currentInput.value);

          await testPage.screenshot({
            path: path.join(
              screenshotsOutput,
              `${url}-${inputKey}-autofill.png`,
            ),
          });

          const nextInputKey = currentInput.multiStepNextInputKey;
          if (nextInputKey && inputs[nextInputKey]) {
            await testPage.keyboard.press("Enter");

            const nextInputSelector = inputs[nextInputKey].selector;
            await testPage.waitForSelector(nextInputSelector, {
              state: "visible",
            });
            await testPage.locator(nextInputSelector);

            doAutofill();
          }
        }
      });
    }

    // Hold the window open (don't close out)
    // await testPage.pause(); // @TODO remove when finished debugging
  });
});
