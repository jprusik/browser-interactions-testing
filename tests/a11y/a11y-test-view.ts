import { Page, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  defaultGotoOptions,
  messageColor,
  violationColor,
} from "../../constants";

export async function a11yTestView({
  testInfo,
  testPage,
  urlBase,
  urlSharedPathBase,
  viewPath,
}: {
  testInfo: TestInfo;
  testPage: Page;
  urlBase: string;
  urlSharedPathBase: string;
  viewPath: string;
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

  let annotationMessages: string[][] = [];

  for (const violation of accessibilityScanResults.violations) {
    violationsCount += violation.nodes.length;

    for (const violatingNode of violation.nodes) {
      const logColor = violatingNode.impact
        ? violationColor[violatingNode.impact]
        : "";

      // Some hacky whitespace formatting for shared spacing between stout and markdown-reporter
      const annotationMessage = [
        `${violatingNode.impact} issue(s) found with \`${viewPath}\` view nodes:\n`,
        `  \`${violatingNode.target[0].toLocaleString()}\`\n`,
        `  ${violatingNode.failureSummary.replaceAll("\n", "\n\n      ")}\n`,
      ];

      annotationMessages = [...annotationMessages, annotationMessage];

      console.log(logColor, `     ${annotationMessage[0]}`);
      console.log(
        messageColor.boldForeground,
        `     ${annotationMessage[1]}\n`,
        `     ${annotationMessage[2]}`,
      );
    }
  }

  if (violationsCount) {
    await testInfo.annotations.push({
      type: `issue`,
      description: `${violationsCount} a11y violations found for \`${urlSharedPathBase + viewPath}\``,
    });

    await annotationMessages.forEach(async (violationMessage) => {
      await testInfo.annotations.push({
        type: `issue-details`,
        description: violationMessage.join("\n  "),
      });
    });
  }

  return violationsCount;
}
