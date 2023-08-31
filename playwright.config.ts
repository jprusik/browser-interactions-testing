import path from "path";

import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

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
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list", { printSteps: true }],
    ["html", { open: "never", outputFolder: "test-summary" }],
    ["json", { outputFile: "test-summary/test-results.json" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `${process.env.PAGES_HOST}:${process.env.PAGES_HOST_PORT}`,

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

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npx http-server -p ${process.env.PAGES_HOST_PORT} --no-dotfiles`,
    url: `${process.env.PAGES_HOST}:${process.env.PAGES_HOST_PORT}`,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
