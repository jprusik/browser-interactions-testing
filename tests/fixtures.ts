import path from "path";
import fs from "fs";
import { test as base, chromium, type BrowserContext } from "@playwright/test";

const pathToExtension = path.join(
  __dirname,
  "../../",
  process.env.EXTENSION_BUILD_PATH,
);

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      headless: false, // should always be `false`, even when testing headless Chrome
      args: [
        ...(process.env.HEADLESS === "true"
          ? ["--headless=new"] // use for headless testing on Chrome
          : []),
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled", // navigator.webdriver = false
      ],
      ignoreDefaultArgs: [
        "--disable-component-extensions-with-background-pages",
        "--enable-automation",
      ],
      // Help mitigate automation detection with a known-good userAgent
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      viewport: {
        width: 1000,
        height: 1000,
      },
    });
    await use(context);
  },
  extensionId: async ({ context }, use) => {
    let background;
    const manifest = JSON.parse(
      fs.readFileSync(path.join(pathToExtension, "manifest.json"), "utf8"),
    );

    if (manifest?.manifest_version === 3) {
      background = context.serviceWorkers()[0];

      if (!background) {
        background = await context.waitForEvent("serviceworker");
      }
    } else {
      // for manifest v2:
      background = context.backgroundPages()[0];

      if (!background) {
        background = await context.waitForEvent("backgroundpage");
      }
    }

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
