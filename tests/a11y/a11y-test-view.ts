import { Page, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  defaultGotoOptions,
  messageColor,
  violationColor,
} from "../../constants";

export async function a11yTestView({
  viewPath,
  urlBase,
  testPage,
  testInfo,
}: {
  viewPath: string;
  urlBase: string;
  testPage: Page;
  testInfo: TestInfo;
}): Promise<number> {
  let violationsCount = 0;

  const isBrowserClient = urlBase.startsWith("chrome-extension://");
  const viewUrl = `${urlBase}${viewPath}`;

  await testPage.goto(viewUrl, defaultGotoOptions);

  const accessibilityScanResults = await new AxeBuilder({
    page: testPage,
  })
    .options({
      resultTypes: ["violations"],
      absolutePaths: true,
      selectors: true,
      iframes: true,
    })
    .analyze();

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
        `\t${violatingNode.impact} issue(s) found with '${viewPath}' view nodes:`,
      );
      console.log(
        messageColor.boldForeground,
        `\t${violatingNode.target[0].toLocaleString()}\n\n`,
        `\t${violatingNode.failureSummary.replaceAll("\n", "\n\t")}\n`,
      );
    }
  }

  return violationsCount;
}
