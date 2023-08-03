import { Page } from "@playwright/test";
import path from "path";

import { localPagesUri, testPages } from "./constants";
import { test, expect } from "./fixtures";
import {
  LocatorWaitForOptions,
  PageGoToOptions,
} from "./abstractions/test-pages";
import { FillProperties } from "./abstractions/constants";

export const screenshotsOutput = path.join(__dirname, "../screenshots");

let testPage: Page;

const vaultEmail = process.env.VAULT_EMAIL || "";
const vaultPassword = process.env.VAULT_PASSWORD || "";
const serverHostURL = process.env.SERVER_HOST_URL;
const startFromTestUrl = process.env.START_FROM_TEST_URL || null;
const debugIsActive = ["1", "console"].includes(process.env.PWDEBUG);
const defaultGotoOptions: PageGoToOptions = {
  waitUntil: "domcontentloaded",
  timeout: 60000,
};
const defaultWaitForOptions: LocatorWaitForOptions = {
  state: "visible",
  timeout: 15000,
};

test.describe("Extension autofills forms when triggered", () => {
  test("Log in to the vault, open pages, and autofill forms", async ({
    context,
    extensionId,
  }) => {
    context.setDefaultTimeout(20000);
    context.setDefaultNavigationTimeout(120000);

    const [backgroundPage] = context.backgroundPages();

    async function doAutofill() {
      await backgroundPage.evaluate(() =>
        chrome.tabs.query(
          { active: true },
          (tabs) =>
            tabs[0] &&
            chrome.tabs.sendMessage(tabs[0]?.id || 0, {
              command: "collectPageDetails",
              tab: tabs[0],
              sender: "autofill_cmd",
            })
        )
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
        await welcomePage.close();
      }

      testPage = contextPages[0];

      if (debugIsActive) {
        console.log(
          (await testPage.evaluate(() => navigator.userAgent)) + "\n"
        );
      }
    });

    await test.step("Configure the environment", async () => {
      // @TODO check for and fill other settings
      if (serverHostURL) {
        const extensionURL = `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/environment`;
        await testPage.goto(extensionURL, defaultGotoOptions);
        const baseUrlInput = await testPage.locator("input#baseUrl");
        await baseUrlInput.waitFor(defaultWaitForOptions);

        await testPage.fill("input#baseUrl", serverHostURL);

        await testPage.screenshot({
          fullPage: true,
          path: path.join(screenshotsOutput, `environment_configured.png`),
        });

        const serverConfigContent = await testPage.locator("#baseUrlHelp");
        await testPage.click("button[type='submit']");
        await serverConfigContent.waitFor({
          ...defaultWaitForOptions,
          state: "detached",
        });
      }
    });

    await test.step("Log in to the extension vault", async () => {
      const emailInput = await testPage.getByLabel("Email address");
      await emailInput.waitFor(defaultWaitForOptions);
      await emailInput.fill(vaultEmail);
      const emailSubmitInput = await testPage.getByRole("button", {
        name: "Continue",
      });
      await emailSubmitInput.click();

      const masterPasswordInput = await testPage.locator(
        "input#masterPassword"
      );
      await masterPasswordInput.waitFor(defaultWaitForOptions);
      await masterPasswordInput.fill(vaultPassword);

      const loginButton = await testPage.getByRole("button", {
        name: "Log in with master password",
      });
      await loginButton.waitFor(defaultWaitForOptions);
      await loginButton.click();

      const extensionURL = `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/tabs/vault`;
      await testPage.waitForURL(extensionURL, defaultGotoOptions);
      const vaultFilterBox = await testPage
        .locator("app-vault-filter main .box.list")
        .first();
      await vaultFilterBox.waitFor(defaultWaitForOptions);
    });

    let pagesToTest = testPages;

    if (debugIsActive) {
      pagesToTest = pagesToTest.filter(({ onlyTest }) => onlyTest);

      if (!pagesToTest.length) {
        pagesToTest = testPages;
      }
    }

    if (startFromTestUrl) {
      const startTestIndex = pagesToTest.findIndex(
        ({ url }) => url === startFromTestUrl
      );

      pagesToTest =
        startTestIndex > 0 ? pagesToTest.slice(startTestIndex) : pagesToTest;
    }

    test.setTimeout(480000);
    testPage.setDefaultNavigationTimeout(60000);

    for (const page of pagesToTest) {
      const { url, inputs } = page;
      const isLocalPage = url.startsWith(localPagesUri);

      await test.step(`Autofill the form on page ${url}`, async () => {
        await testPage.goto(url, defaultGotoOptions);

        const inputKeys = Object.keys(inputs);
        const firstInput = inputs[inputKeys[0]];
        const firstInputPreFill = firstInput.preFillActions;
        if (firstInputPreFill) {
          try {
            await firstInputPreFill(testPage);
          } catch (error) {
            console.log("There was a prefill error:", error);

            if (debugIsActive) {
              await testPage.pause();
            }
          }
        }

        const initialInputElement = await testPage
          .locator(firstInput?.selector)
          .first();
        await initialInputElement.waitFor(defaultWaitForOptions);

        await doAutofill();

        for (const inputKey of inputKeys) {
          const currentInput: FillProperties = inputs[inputKey];
          const currentInputElement = testPage.locator(currentInput.selector);

          // Do not soft expect on local test pages; we want to stop the tests before hitting live pages
          if (isLocalPage) {
            await expect(currentInputElement).toHaveValue(currentInput.value);
          } else {
            await expect
              .soft(currentInputElement)
              .toHaveValue(currentInput.value);
          }

          await testPage.screenshot({
            fullPage: true,
            path: path.join(
              screenshotsOutput,
              `${url}-${inputKey}-autofill.png`
            ),
          });

          const nextStepInput: FillProperties | undefined =
            currentInput.multiStepNextInputKey &&
            inputs[currentInput.multiStepNextInputKey];

          if (nextStepInput) {
            await currentInputElement.press("Enter");

            const nextInputPreFill = nextStepInput.preFillActions;
            if (nextInputPreFill) {
              try {
                nextInputPreFill(testPage);
              } catch (error) {
                console.log("There was a prefill error:", error);

                if (debugIsActive) {
                  await testPage.pause();
                }
              }
            }

            const nextInputSelector = nextStepInput.selector;
            const nextInputElement = testPage
              .locator(nextInputSelector)
              .first();
            await nextInputElement.waitFor(defaultWaitForOptions);

            await doAutofill();
          }

          if (debugIsActive) {
            await testPage.pause();
          }
        }
      });
    }

    // Hold the window open (don't automatically close out) when debugging
    if (debugIsActive) {
      await testPage.pause();
    }
  });
});
