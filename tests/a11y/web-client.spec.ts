import {
  authenticatedWebClientViewPaths,
  debugIsActive,
  defaultGotoOptions,
  defaultNavigationTimeout,
  unauthenticatedWebClientViewPaths,
  vaultEmail,
  vaultHostURL,
} from "../../constants";
import { test, expect } from "../fixtures";
import { a11yTestView } from "./a11y-test-view";

test.describe("Web client", { tag: ["@web-client", "@a11y"] }, () => {
  test(`a11y checks should pass`, async ({ webClientSetup }, testInfo) => {
    const urlSharedPathBase = "/#/";
    const urlBase = `${vaultHostURL}${urlSharedPathBase}`;

    let testPage = await webClientSetup;
    testPage.setDefaultNavigationTimeout(defaultNavigationTimeout);
    let violationsCount = 0;

    violationsCount += await a11yTestView({
      viewPaths: authenticatedWebClientViewPaths,
      urlBase,
      testPage,
      testInfo,
    });

    await test.step("Log out of the web client in order to test the unauthenticated views", async () => {
      await testPage.getByRole("button", { name: vaultEmail }).click();
      await testPage.getByRole("menuitem", { name: "Log out" }).click();
      await testPage.waitForURL(`${urlBase}login`, defaultGotoOptions);
    });

    violationsCount += await a11yTestView({
      viewPaths: unauthenticatedWebClientViewPaths,
      urlBase,
      testPage,
      testInfo,
    });

    if (violationsCount) {
      console.warn(
        "\x1b[1m\x1b[33m%s\x1b[0m", // bold, yellow foreground
        `${violationsCount} a11y issues were discovered. See log output and attached report for details.`,
      );
    }

    expect.soft(violationsCount).toEqual(0);

    // Add some buffer at the end of testing so any animations/transitions have a chance to
    // complete before the recording is ended
    await testPage.waitForTimeout(2000);

    // Hold the window open (don't automatically close out) when debugging
    if (debugIsActive) {
      await testPage.pause();
    }

    await testPage.close();
  });
});
