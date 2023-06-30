# Autofill Playwright Tests

This project leverages [Playwright](https://playwright.dev/) to run automated form-fill tests against real builds of the Bitwarden browser extension.

## Limitations

- Extension builds can only be tested against Chromium clients at present

## Requirements

- [git](https://git-scm.com/downloads)
- (optional) [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (otherwise manage your node version to `.nvmrc` manually)

## Setup

- Install node (with `nvm install` if `nvm` is installed)
- If targeting a local environment, [generate an SSL certificate for the Web Vault client](https://contributing.bitwarden.com/getting-started/clients/web-vault/#ssl-certificate) named `dev-server.local.pem` and place it in the project root directory
- Do a clean-install with `npm ci` (this will also fetch and set up the Bitwarden clients repo)
  - If prompted, run `npx playwright install` as well
  - (Optional) Checkout the local `clients` to the branch you want to test the extension with (`master` by default)
- Build the extension to test against with `npm run build:clients` Other build options:
  - `build:clients:prod`: build the production version of the extension
  - `build:clients:mv3`: build the extension using Manifest V3 (builds otherwise default to V2)
  - `build:clients:autofill`: build the extension with the new (v2) Autofill features
  - `build:clients:autofill:mv3`: build the extensions with both Manifest V3 and Autofill V2

## Running tests

- If targeting a local environment:
  - Ensure your targeted `API` and `Identity` services [are configured and running](https://contributing.bitwarden.com/getting-started/server/guide)
  - Ensure the Web Vault client is running with `npm run test:webserve`
- Run headless testing with `npm run test:autofill`
- Run headed tests in debug mode with `npm run test:autofill:debug`
