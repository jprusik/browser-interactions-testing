# Autofill Playwright Tests

This project leverages [Playwright](https://playwright.dev/) to run automated form-fill tests against real builds of the Bitwarden browser extension.

- [Autofill Playwright Tests](#autofill-playwright-tests)
  - [Goals and Intent](#goals-and-intent)
  - [Limitations](#limitations)
  - [Requirements](#requirements)
  - [Setup](#setup)
    - [Seeding Your Vault](#seeding-your-vault)
    - [Using Docker Compose](#using-docker-compose)
  - [Running Tests](#running-tests)
  - [Debugging and Updating Tests](#debugging-and-updating-tests)
    - [Debug Mode](#debug-mode)
    - [Headless Mode](#headless-mode)
    - [Execute only selected page tests](#execute-only-selected-page-tests)
    - [Start tests from a specific point](#start-tests-from-a-specific-point)

## Goals and Intent

The aim of this project is to track and anticipate the compatibility of the Bitwarden extension autofill feature in controlled, static test scenarios as well as popular live scenarios. To that end, this project should:

- incur requests against live sites as little as possible (no signing in, traversing deeply in the site, etc.)
- use the same login portals and experiences that users would
- test the span of likely login experiences
- enable regular reporting and early notification on site breakages and code regressions with the Bitwarden extension
- as a secondary concern, enable testing of other extension experiences related to the autofill feature

## Limitations

- Extension builds can only be tested with Chromium clients at present.
- Some sites can be inconsistently flaky due to factors such as live experiments changing the received experience, external dependencies taking too long to load, ads/trackers, and general network instability.
- Some site prequalify emails/usernames before allowing password entry and/or use captchas in multi-step login flows. In these cases we're typically only testing that the username/email was filled out properly.

## Requirements

- [git](https://git-scm.com/downloads)
- [node](https://nodejs.org/en)
- [Bitwarden CLI](https://bitwarden.com/help/cli/)
- [OpenSSL](https://www.openssl.org/)
- [jq](https://github.com/jqlang/jq/wiki/Installation) (optional if not using the account creation script)
- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (optional if not using nvm; manually manage your node version to `.nvmrc`)

## Setup

- Create an `.env` file in the root directory with values pointing to the vault you want to test against (use `.env.example` as guidance) and populate it with your desired values
- Install node (with `nvm install` if `nvm` is installed)
- Install Bitwarden CLI (with npm: `npm install -g @bitwarden/cli`)
- Do a clean-install with `npm ci` (this will also fetch and set up the Bitwarden clients repo)
  - If prompted, run `npx playwright install` as well
  - (Optional) Checkout the local `clients` to the branch with the version of the extension you want to test with (`master` by default)
- Build the extension to test against with `npm run build:extension`. Other build options:
  - `build:extension:prod`: build the production version of the extension
  - `build:extension:mv3`: build the extension using Manifest v3 (builds otherwise default to v2)
  - `build:extension:autofill`: build the extension with the new (v2) Autofill features
  - `build:extension:autofill:mv3`: build the extensions with both Manifest v3 and Autofill v2
- For the targeted environment, configure the vault with the credentials you put in `.env`
- (Only once) Generate SSL certificates with `npm run setup:ssl`. These will be used by the web client, Bitwarden CLI, and Docker compose
  - You should have two files in the root project folder: `ssl.crt` and `ssl.key`
- Add the Certificate Authority to your system's secure store:

  **Mac OS**

  ```shell
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ssl.crt
  ```

  **Linux**

  ```shell
  sudo cp ssl.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates
  ```

### Seeding Your Vault

> If using docker compose to host the server environment (as described in the later section), you may need to wait for the services within the `bitwarden` container to enter a running state before running any seeding scripts.

- Ensure that the [Bitwarden CLI](https://bitwarden.com/help/cli/) is installed and configured on your host machine.
  - Use `npm run setup:vault` to set up your running, targeted vault (e.g. docker container)
    - This command will handle creating a test account, logging in, setting up the CLI, running the Vault Management Server, seeding the vault with any new test credentials, and updating values that have changed. It will place those test credentials within a folder named `AutofillPlaywrightTestItems` in your vault.
  - If you have already created the test account in the vault, use `npm run seed:vault:ciphers` to only seed the vault with the test credentials.
  - If you need to completely delete/refresh any previously loaded test credentials run the command `npm run seed:vault:ciphers:refresh`

### Using Docker Compose

Using Docker compose will set up all the services required by the extension for testing. In order to use Docker compose, you'll need to first:

Create and start the containers and volumes with `docker compose up -d --build --remove-orphans`, and teardown with `docker compose down -v`

## Running Tests

- If targeting a local environment:
  - Ensure your targeted `API` and `Identity` services are configured and running (either [locally](https://contributing.bitwarden.com/getting-started/server/guide) or via Docker)
  - Ensure the Web Vault client is running (either with `npm run test:webserve` locally or via Docker)
    - Don't forget to [include your SSL key and cert file](https://contributing.bitwarden.com/getting-started/clients/web-vault/) in the `clients/apps/web` folder
- Run headless testing with `npm run test:all:headless`
- Run headed tests in debug mode with `npm run test:all:debug`
- Run only the static pages testing with `npm run test:static:debug`
- Run only the public pages testing with `npm run test:public:debug`

## Debugging and Updating Tests

Several features are available for ease of testing/debugging

### Debug Mode

Pass the playwright flag `--debug` or use the provided npm scripts to run your tests in Debug Mode. While Debug Mode is active, additional information will be returned to console, tests will pause at various points until [the user selects the play button to continue](https://playwright.dev/docs/debug#stepping-through-your-tests).

### Headless Mode

Pass the environment variable `HEADLESS=true` or use the provided npm scripts to run your tests in headless mode. Note, Debug Mode can be used with Headless Mode to debug behaviour differences between headed and headless tests.

### Execute only selected page tests

Each test page entry in the `testPages` constant of `tests/constants.ts` can take the optional property `onlyTest`. If debug mode is active and one or more pages has a truthy `onlyTest` value, only those pages will be tested.

If debug mode is not active, `onlyTest` values will be ignored.

### Start tests from a specific point

Passing the environment variable `START_FROM_TEST_URL` with the url of the test you wish to start with can help avoid re-running "known good" tests, when using `onlyTest` is impractical (e.g. `START_FROM_TEST_URL=https://www.pinterest.com/login/ npm run test:all:debug`)
