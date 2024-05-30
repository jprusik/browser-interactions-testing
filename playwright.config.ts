import path from "path";

import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

import { testSiteHost } from "./constants";

const config: PlaywrightTestConfig = {
  testDir: "./tests-out",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 3000, // The threshold for which we consider the experience as "failed"
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Limit the number of failures on CI to save resources */
  maxFailures: process.env.CI ? 5 : undefined,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI && process.env.DISABLE_RETRY !== "true" ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  // Note: MV3 build currently requires single worker operation
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    process.env.CI
      ? [
          "@estruyf/github-actions-reporter",
          {
            useDetails: true,
            showError: true,
          },
        ]
      : ["list", { printSteps: true }],
    ["html", { open: "never", outputFolder: "test-summary" }],
    ["json", { outputFile: "test-summary/test-results.json" }],
  ],
  // Do not report slow tests as threshold are expected to be large and varying
  reportSlowTests: null,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testSiteHost,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    permissions: ["clipboard-read", "clipboard-write"],
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",

  /* Run your local static tests server before starting the tests */
  webServer: {
    command: "npm run start:test-site",
    url: testSiteHost,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
