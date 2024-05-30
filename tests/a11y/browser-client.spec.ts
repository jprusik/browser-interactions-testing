import {
  debugIsActive,
  defaultNavigationTimeout,
  browserClientViewPaths,
} from "../../constants";
import { test, expect } from "../fixtures";
import { a11yTestView } from "./a11y-test-view";

test.describe("Browser client", () => {
  test(`a11y checks should pass`, async ({
    extensionId,
    extensionSetup,
  }, testInfo) => {
    const urlBase = `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/`;

    let testPage = await extensionSetup;
    testPage.setDefaultNavigationTimeout(defaultNavigationTimeout);
    let violationsCount = 0;

    violationsCount += await a11yTestView({
      viewPaths: browserClientViewPaths,
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
  });
});
