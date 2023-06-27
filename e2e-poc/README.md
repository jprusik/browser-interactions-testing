## Install dependencies
1. [Install Playwright](https://playwright.dev/docs/intro#installing-playwright): `npm init playwright@latest`
2. Install jinja2 CLI: `pip install jinja2  # for applying templated sites to an auto-generated test file`
3. Optional: [Install Docker](https://docs.docker.com/get-docker/)

## Populating vars.yml
1. Copy URL column of failed autofill response form
2. Find: `(.*)\n` # get better regex
3. Replace:
    ```yaml

      - name: "$1"
        autofill_method: "loginWithAutofillOnPageLoad"
        failure_text: "some text to look for on the page if logging in fails (it should)"
    ```

## Generating tests
1. `./make-tests.sh`

#### Note
This method doesn't actually produce working tests yet. Someone needs to fix the underlying TypeScript code to make it work.
Additionally, it uses `jinja2` to generate a test template and output them into a `*.ts` file. We would probably be better served if we added a YAML parser to the TypeScript code and figured out a way to loop through the tests while retaining individualized results.

## Prerequisites
- Unzip the extension into `./extensions/bitwarden-chrome` # the path is hard-coded in `example.spec.ts`

## Running tests
- Run tests in VS Code by clicking the "Run" button next to each test in `example.spec.ts`.
- Run tests in Docker: `docker-compose up -d && docker-compose logs` in the `./docker` folder
  - Note: these will only work with `--headless=new` being set in `example.spec.ts`
- Run tests from command line: `npx playwright test`

## Neutralize the onInstall listener
This isn't required, but you can try it out if you want to test the extension's behavior without the onInstall listener:
1. In your unpacked extension folder, find: `.createNewTab("https://bitwarden.com/browser-start/")`
2. Replace: :)
