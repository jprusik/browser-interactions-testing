import { Page, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { defaultGotoOptions } from "../../constants";
import { test } from "../fixtures";

const violationColor = {
  minor: "\x1b[1m\x1b[36m%s\x1b[0m", // cyan foreground
  moderate: "\x1b[1m\x1b[33m%s\x1b[0m", // bold, yellow foreground
  serious: "\x1b[1m\x1b[33m%s\x1b[0m", // bold, yellow foreground
  critical: "\x1b[1m\x1b[31m%s\x1b[0m", // bold, red foreground
};

export async function a11yTestView({
  viewPaths,
  urlBase,
  testPage,
  testInfo,
}: {
  viewPaths: string[];
  urlBase: string;
  testPage: Page;
  testInfo: TestInfo;
}): Promise<number> {
  let violationsCount = 0;

  for (const viewPath of viewPaths) {
    const isBrowserClient = urlBase.startsWith("chrome-extension://");
    const viewUrl = `${urlBase}${viewPath}`;
    await test.step(`for ${viewPath}`, async () => {
      await testPage.goto(viewUrl, defaultGotoOptions);

      const accessibilityScanResults = await new AxeBuilder({
        page: testPage,
      }).analyze();

      const scanResultsSuffix = encodeURIComponent(
        isBrowserClient ? `browser-client_${viewPath}` : viewUrl,
      );
      await testInfo.attach(`a11y-scan-results_${scanResultsSuffix}`, {
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

  return violationsCount;
}
