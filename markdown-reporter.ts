import fs from "fs";
import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
  TestStatus,
  TestStep,
} from "@playwright/test/reporter";

class MarkdownReporter implements Reporter {
  lines: string[];
  outputFolder: string;
  steps: string;
  totalCompletedTests: number;
  totalFailedTests: number;
  totalSkippedTests: number;

  constructor(options: { outputFolder?: string } = {}) {
    this.lines = [];
    this.outputFolder = options.outputFolder || ".";
    this.steps = "";
    this.totalCompletedTests = 0;
    this.totalFailedTests = 0;
    this.totalSkippedTests = 0;
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    const resultStatus = result.status;

    if (step.category === "test.step") {
      this.steps +=
        "- " +
        getSymbolByStatus(resultStatus) +
        ` (${resultStatus}) ` +
        `${step.title} took ${result.duration}ms` +
        "\n";
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const resultStatus = result.status;

    if (resultStatus === "passed") {
      this.totalCompletedTests++;
    }

    if (resultStatus === "skipped") {
      this.totalSkippedTests++;
    }

    if (["failed", "timedOut", "interrupted"].includes(resultStatus)) {
      this.totalFailedTests++;
    }

    let testSummary =
      "\n<details><summary><h2>" +
      getSymbolByStatus(resultStatus) +
      ` (${resultStatus}) ` +
      `${test.parent.title} > ${test.title}` +
      "</h2></summary>\n" +
      `<h3>${test.parent.parent?.title || ""}</h3>\n\n`;

    if (this.steps !== "") {
      testSummary += this.steps;
    }

    if (test.annotations.length) {
      let isFirstIssueAnnotation = true;
      testSummary += "\n<h3>Details</h3>\n\n";

      for (const { type, description } of test.annotations) {
        if (type === "issue") {
          if (!isFirstIssueAnnotation) {
            testSummary += `</details>`;
          } else {
            isFirstIssueAnnotation = false;
          }

          testSummary += `<details><summary><h4>${description}</h4></summary>\n\n`;
        }

        if (type === "issue-details") {
          testSummary += `- ${description}\n`;
        }
      }
      testSummary += "</details>\n";
    }

    testSummary += "\n</details>";

    this.lines = [...this.lines, testSummary];

    this.steps = "";
  }

  onEnd(result: FullResult) {
    const markdownDoc = [
      "# Test Summary",
      `\nTotal tests: ${this.totalCompletedTests} | Failed: ${this.totalFailedTests}\n`,
      ...this.lines,
    ].join("\n");

    fs.writeFileSync(
      `${__dirname}/${this.outputFolder}/test-summary.md`,
      markdownDoc,
    );
  }
}

function getSymbolByStatus(status: TestStatus) {
  if (status === "skipped") {
    return "⏭";
  }

  if (status === "passed") {
    return "✅";
  }

  // "failed" | "timedOut" | "interrupted"
  else {
    return "❌";
  }
}

export default MarkdownReporter;
