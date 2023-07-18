import { Page } from "@playwright/test";
import path from "path";

import { testPages } from "./constants";
import { test, expect } from "./fixtures";
import {
  LocatorWaitForOptions,
  PageGoToOptions,
} from "./abstractions/test-pages";

export const screenshotsOutput = path.join(__dirname, "../screenshots");

let testPage: Page;

const vaultEmail = process?.env?.VAULT_EMAIL || "";
const vaultPassword = process?.env?.VAULT_PASSWORD || "";
const serverHostURL = process?.env?.SERVER_HOST_URL;
const debugIsActive = ["1", "console"].includes(process.env.PWDEBUG);
const defaultGotoOptions: PageGoToOptions = {
  waitUntil: "domcontentloaded",
  timeout: 60000,
};
const defaultWaitForOptions: LocatorWaitForOptions = {
  state: "visible",
  timeout: 10000,
};

test.describe("Extension autofills forms when triggered", () => {
  test("Log in to the vault, open pages, and autofill forms", async ({
    context,
    extensionId,
  }) => {
    context.setDefaultTimeout(10000);
    context.setDefaultNavigationTimeout(60000);

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
        await welcomePage.close();
      }

      testPage = contextPages[0];
    });

    await test.step("Configure the environment", async () => {
      // @TODO check for and fill other settings
      if (serverHostURL) {
        await testPage.goto(
          `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/environment`,
          defaultGotoOptions,
        );
        const baseUrlInput = await testPage.locator("input#baseUrl");
        await baseUrlInput.waitFor(defaultWaitForOptions);

        await testPage.fill("input#baseUrl", serverHostURL);

        await testPage.screenshot({
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
        "input#masterPassword",
      );
      await masterPasswordInput.waitFor(defaultWaitForOptions);
      await masterPasswordInput.fill(vaultPassword);

      const loginButton = await testPage.getByRole("button", {
        name: "Log in with master password",
      });
      await loginButton.waitFor(defaultWaitForOptions);
      await loginButton.click();

      await testPage.waitForURL(
        `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/tabs/vault`,
        defaultGotoOptions,
      );
      const vaultFilterBox = await testPage
        .locator("app-vault-filter main .box.list")
        .first();
      await vaultFilterBox.waitFor(defaultWaitForOptions);
    });

    for (const page of testPages) {
      const { url, inputs } = page;

      await test.step(`Autofill the form on page ${url}`, async () => {
        testPage.setDefaultNavigationTimeout(60000);
        const navigationPromise =
          testPage.waitForNavigation(defaultGotoOptions);
        await testPage.goto(url);
        await navigationPromise;

        let hiddenFormSelector;
        if (page.hiddenForm) {
          hiddenFormSelector = page.hiddenForm.iframeSource
            ? `iframe[src^="${page.hiddenForm.iframeSource}"]`
            : page.hiddenForm.formSelector;
          if (page.hiddenForm.triggerSelectors?.length) {
            for (const selector of page.hiddenForm.triggerSelectors) {
              const triggerElement = await testPage.locator(selector).first();
              await triggerElement.waitFor(defaultWaitForOptions);
              await triggerElement.click();
            }
          }
          const hiddenForm = await testPage.locator(hiddenFormSelector).first();
          await hiddenForm.waitFor(defaultWaitForOptions);

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

        if (page.formSetupClickSelectors) {
          for (const selector of page.formSetupClickSelectors) {
            await testPage.click(selector);
          }
        }

        if (page.waitForInitialInputKey) {
          const initialInputElement = await testPage
            .locator(inputs[page.waitForInitialInputKey].selector)
            .first();
          await initialInputElement.waitFor(defaultWaitForOptions);
        }

        await doAutofill();

        const inputKeys = Object.keys(inputs);
        const testedFrame = Boolean(page.hiddenForm?.iframeSource)
          ? testPage.frameLocator(hiddenFormSelector)
          : testPage;

        for (const inputKey of inputKeys) {
          const currentInput = inputs[inputKey];
          const currentInputElement = testedFrame.locator(
            currentInput.selector,
          );
          await expect
            // @TODO do not soft expect on local test pages
            .soft(currentInputElement)
            .toHaveValue(currentInput.value);

          await testPage.screenshot({
            path: path.join(
              screenshotsOutput,
              `${url}-${inputKey}-autofill.png`,
            ),
          });

          const nextInputKey = currentInput.multiStepNextInputKey;
          if (nextInputKey && inputs[nextInputKey]) {
            await currentInputElement.press("Enter");

            const nextInputSelector = inputs[nextInputKey].selector;

            const iframeElement = Boolean(page.hiddenForm?.iframeSource)
              ? await testPage.locator(hiddenFormSelector).elementHandle()
              : null;
            const testedFrame = iframeElement
              ? await iframeElement.contentFrame()
              : testPage;

            const nextInputElement = testedFrame
              .locator(nextInputSelector)
              .first();
            await nextInputElement.waitFor(defaultWaitForOptions);

            await doAutofill();
          }
        }
      });
    }
  });
});
