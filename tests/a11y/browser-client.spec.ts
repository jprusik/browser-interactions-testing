import AxeBuilder from "@axe-core/playwright";
import {
  debugIsActive,
  defaultNavigationTimeout,
  popoutViewPaths,
} from "../../constants";
import { test, expect } from "../fixtures";

const violationColor = {
  minor: "\x1b[1m\x1b[36m%s\x1b[0m", // cyan foreground
  moderate: "\x1b[1m\x1b[33m%s\x1b[0m", // bold, yellow foreground
  serious: "\x1b[1m\x1b[33m%s\x1b[0m", // bold, yellow foreground
  critical: "\x1b[1m\x1b[31m%s\x1b[0m", // bold, red foreground
};

test.describe("Browser client", () => {
  test(`a11y checks should pass`, async ({
    extensionId,
    extensionSetup,
  }, testInfo) => {
    let testPage = await extensionSetup;
    testPage.setDefaultNavigationTimeout(defaultNavigationTimeout);
    let violationsCount = 0;

    for (const viewPath of popoutViewPaths) {
      await test.step(`for ${viewPath}`, async () => {
        await testPage.goto(
          `chrome-extension://${extensionId}/popup/index.html?uilocation=${viewPath}`,
        );
        const accessibilityScanResults = await new AxeBuilder({
          page: testPage,
        }).analyze();

        await testInfo.attach("accessibility-scan-results", {
          body: JSON.stringify(accessibilityScanResults, null, 2),
          contentType: "application/json",
        });

        for (const violation of accessibilityScanResults.violations) {
          violationsCount += violation.nodes.length;

          for (const violatingNode of violation.nodes) {
            const logColor = violatingNode.impact
              ? violationColor[violatingNode.impact]
              : "";

            console.log(
              logColor,
              `\t${violatingNode.impact} issue(s) found with nodes: ${violatingNode.target}\n`,
              `\t${violatingNode.failureSummary.replaceAll("\n", "\n\t")}\n`,
            );
          }
        }
      });
    }

    if (violationsCount) {
      console.warn(
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
