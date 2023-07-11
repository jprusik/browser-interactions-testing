# Autofill Playwright Tests

This project leverages [Playwright](https://playwright.dev/) to run automated form-fill tests against real builds of the Bitwarden browser extension.

## Limitations

- Extension builds can only be tested with Chromium clients at present

## Requirements

- [git](https://git-scm.com/downloads)
- (optional) [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (otherwise manage your node version to `.nvmrc` manually)

## Setup

- Create an `.env` file in the root directory with values pointing to the vault you want to test against (use `.env.example` as guidance)
- Install node (with `nvm install` if `nvm` is installed)
- If targeting a local environment, [generate an SSL certificate for the Web Vault client](https://contributing.bitwarden.com/getting-started/clients/web-vault/#ssl-certificate) named `dev-server.local.pem` and place it in the project root directory
- Do a clean-install with `npm ci` (this will also fetch and set up the Bitwarden clients repo)
  - If prompted, run `npx playwright install` as well
  - (Optional) Checkout the local `clients` to the branch you want to test the extension with (`master` by default)
- Build the extension to test against with `npm run build:clients` Other build options:
  - `build:clients:prod`: build the production version of the extension
  - `build:clients:mv3`: build the extension using Manifest v3 (builds otherwise default to v2)
  - `build:clients:autofill`: build the extension with the new (v2) Autofill features
  - `build:clients:autofill:mv3`: build the extensions with both Manifest v3 and Autofill v2
- For the targeted environment, configure the vault with the credentials you put in `.env`
- Login to the vault of the targeted environment, and create items for each of the test credentials (`testPages`) found in `tests/constants.ts`. Note, that the cipher entries for `test-pages` should use exact URI matching.

## Seeding Your Vault

- Ensure that the [Bitwarden CLI](https://bitwarden.com/help/cli/) is installed on your machine.
- Ensure that the following variables are set in your `.env`
  - `VAULT_EMAIL=<your-email>`
  - `VAULT_PASSWORD=<your-password>`
  - `BW_SERVE_API_HOST=<api-host>` (do not include http://)
  - `BW_SERVE_API_PORT=<api-port>`
- Run `npm run seed:vault` to seed the vault with the test credentials found in `tests/constants.ts`
  - This command will handle logging in, setting up the CLI, running the Vault Management Server, seeding the vault with any new test credentials, and updating values that have changed.
  - It will place those test credentials within a folder named `AutofillPlaywrightTestItems` in your vault.
- If you need to completely delete/refresh any previously loaded test credentials run the command `npm run seed:vault:refresh`

## Running Tests

- If targeting a local environment:
  - Ensure your targeted `API` and `Identity` services [are configured and running](https://contributing.bitwarden.com/getting-started/server/guide)
  - Ensure the Web Vault client is running with `npm run test:webserve`
- Run headless testing with `npm run test:autofill`
- Run headed tests in debug mode with `npm run test:autofill:debug`
