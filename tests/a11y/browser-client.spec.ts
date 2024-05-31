import { browserClientViewPaths, debugIsActive } from "../../constants";
import { test, expect } from "../fixtures";
import { a11yTestView } from "./a11y-test-view";

test.describe("Browser client", () => {
  test(`a11y checks should pass`, async ({
    extensionId,
    extensionSetup,
  }, testInfo) => {
    const urlBase = `chrome-extension://${extensionId}/popup/index.html?uilocation=popout#/`;

    let testPage = await extensionSetup;
    let violationsCount = 0;

    for (const viewPath of browserClientViewPaths) {
      await test.step(`for path: popout#/${viewPath}`, async () => {
        const newViolationsCount = await a11yTestView({
          viewPath,
          urlBase,
          testPage,
          testInfo,
        });

        await expect
          .soft(
            newViolationsCount,
            `view for \`popout#/${viewPath}\` should yield 0 violations`,
          )
          .toEqual(0);

        violationsCount += newViolationsCount;
      });
    }

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
