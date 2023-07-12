# Autofill Playwright Tests

This project leverages [Playwright](https://playwright.dev/) to run automated form-fill tests against real builds of the Bitwarden browser extension.

## Limitations

- Extension builds can only be tested with Chromium clients at present

## Requirements

- [git](https://git-scm.com/downloads)
- [node](https://nodejs.org/en)
- [Bitwarden CLI](https://bitwarden.com/help/cli/)
- [OpenSSL](https://www.openssl.org/)
- (optional) [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (otherwise manage your node version to `.nvmrc` manually)

## Setup

- Create an `.env` file in the root directory with values pointing to the vault you want to test against (use `.env.example` as guidance) and populate it with your desired values
- Install node (with `nvm install` if `nvm` is installed)
- Install Bitwarden CLI (with npm: `npm install -g @bitwarden/cli`)
- If targeting a local environment, [generate an SSL certificate for the Web Vault client](https://contributing.bitwarden.com/getting-started/clients/web-vault/#ssl-certificate) named `dev-server.local.pem` and place it in the project root directory
- Do a clean-install with `npm ci` (this will also fetch and set up the Bitwarden clients repo)
  - If prompted, run `npx playwright install` as well
  - (Optional) Checkout the local `clients` to the branch with the version of the extension you want to test with (`master` by default)
- Build the extension to test against with `npm run build:clients`. Other build options:
  - `build:clients:prod`: build the production version of the extension
  - `build:clients:mv3`: build the extension using Manifest v3 (builds otherwise default to v2)
  - `build:clients:autofill`: build the extension with the new (v2) Autofill features
  - `build:clients:autofill:mv3`: build the extensions with both Manifest v3 and Autofill v2
- For the targeted environment, configure the vault with the credentials you put in `.env`
- Login to the vault of the targeted environment, and create items for each of the test credentials (`testPages`) found in `tests/constants.ts`. Note, that the cipher entries for `test-pages` should use exact URI matching.
- (Only once) Generate SSL certificates with `npm run setup:ssl`. These will be used by the web client, Bitwarden CLI, and Docker compose
  - Alternatively, generate your files with OpenSSL:

  ```shell
  openssl req -x509 -newkey rsa:4096 -keyout ssl.key -out ssl.crt -sha256 -days 1826 -nodes \
  -subj "/CN=localhost/O=Bitwarden Autofill Testing" \
  -addext "subjectAltName=DNS:localhost,DNS:bitwarden.test,IP:127.0.0.1"
  ```

- Add the Certificate Authority to your system's secure store:

  **Mac OS**

  ```shell
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ssl.crt
  ```

- You should have two files in the root project folder: `ssl.crt` and `ssl.key`

### Using Docker Compose

Using Docker compose will set up all the services required by the extension for testing. In order to use Docker compose, you'll need to first:

Create and start the containers and volumes with `docker compose up -d --build --remove-orphans`, and teardown with `docker compose down -v`

## Seeding Your Vault

- Ensure that the [Bitwarden CLI](https://bitwarden.com/help/cli/) is installed and configured on your host machine.
  - If you are using a local environment, you should configure the CLI to point to your local vault. This can be done with the following command.
  - `bw config server --api http://localhost:<api-port> --identity http://localhost:<identity-port> --web-vault https://localhost:<web-vault-port> --events http://localhost:<events-port>`
- Log into the Bitwarden CLI using the credentials for the account you'd like to seed.
- In a separate terminal, launch the Vault Management API by running `bw serve --port <api-port> --host <api-host>`
  - Note: running `bw serve` defaults the port to `8087` and the host to `localhost`. This is fine to do as long as you also set the values within your `.env` file (see below).
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
  - Ensure your targeted `API` and `Identity` services are configured and running (either [locally](https://contributing.bitwarden.com/getting-started/server/guide) or via Docker)
  - Ensure the Web Vault client is running (either with `npm run test:webserve` locally or via Docker)
    - If running locally, be sure to [include your SSL key and cert file](https://contributing.bitwarden.com/getting-started/clients/web-vault/) (`dev-server.local.pem`) in the `clients/apps/web` folder
- Run headless testing with `npm run test:autofill`
- Run headed tests in debug mode with `npm run test:autofill:debug`
