import {
  browserClientViewPaths,
  debugIsActive,
  messageColor,
} from "../../constants";
import { test, expect } from "../fixtures";
import { a11yTestView } from "./a11y-test-view";

test.describe("Browser client", { tag: ["@browser-client", "@a11y"] }, () => {
  test(`a11y evaluation should pass`, async ({
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

        if (newViolationsCount) {
          await testInfo.annotations.push({
            type: `issue`,
            description: `${newViolationsCount} a11y violations found for popout#/${viewPath}`,
          });
        }

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
        messageColor.yellowForeground,
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
