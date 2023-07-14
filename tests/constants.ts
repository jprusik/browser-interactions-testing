import { CipherType } from "../clients/libs/common/src/vault/enums/cipher-type";
import { UriMatchType } from "../clients/libs/common/src/enums";
import { configDotenv } from "dotenv";
import { TestPage } from "./abstractions/constants";
configDotenv();

const localPagesUri = `${process.env.PAGES_HOST}:${process.env.PAGES_HOST_PORT}`;

export const testPages: TestPage[] = [
  {
    cipherType: CipherType.Login,
    url: `${localPagesUri}/tests/test-pages/basic-form.html`,
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: { value: "jsmith", selector: "#username" },
      password: { value: "areallygoodpassword", selector: "#password" },
    },
  },
  {
    cipherType: CipherType.Login,
    url: `${localPagesUri}/tests/test-pages/multi-step-form.html`,
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: {
        value: "ms-smith",
        selector: "#username",
        multiStepNextInputKey: "password",
      },
      password: { value: "ms-password", selector: "#password" },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://fill.dev/form/login-simple",
    inputs: {
      username: { value: "simple-test", selector: "#username" },
      password: { value: "apassword", selector: "#password" },
    },
  },

  /**
   * Top 100 websites in the US per SEM Rush as of May 2023
   * @see https://www.semrush.com/blog/most-visited-websites/
   */
  {
    cipherType: CipherType.Login,
    url: "https://accounts.google.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[type='email']",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector: "input[type='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.facebook.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakePassword",
        selector: "#pass",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.reddit.com/",
    hiddenForm: {
      triggerSelector: 'header a[role="button"]',
      iframeSource: "https://www.reddit.com/login/",
    },
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#loginUsername",
      },
      password: {
        value: "fakePassword",
        selector: "#loginPassword",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.reddit.com/login/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#loginUsername",
      },
      password: {
        value: "fakePassword",
        selector: "#loginPassword",
      },
    },
  },

  /**
   * Commenting out known failure cases for now
   *

  // Known failure cases:
  {
    cipherType: CipherType.Login,
    url: `${localPagesUri}/tests/test-pages/many-input-form.html`,
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: { value: "js", selector: "#username" },
      password: { value: "", selector: "#password" },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://auth.max.com/login",
    inputs: {
      username: { value: "maxcom_user", selector: "#username" },
      password: { value: "maxcom_password", selector: "#password" },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://login.clear.com.br/",
    inputs: {
      username: { value: "12345678901111", selector: "#username" },
      password: { value: "098765", selector: "#password" },
    },
  },

  // Card and Identity Ciphers currently cannot be autofilled through the same mechanism that Login Ciphers are. This is because of how we handle messaging the background for autofilling login items. The extension will need to be updated to handle these types of Ciphers.
  {
    cipherType: CipherType.Card,
    url: "https://fill.dev/form/credit-card-simple",
    uriMatchType: UriMatchType.Exact,
    inputs: {
      cardholderName: { value: "John Smith", selector: "#cc-name" },
      brand: { value: "Visa", selector: "#cc-type" },
      number: { value: "4111111111111111", selector: "#cc-number" },
      expMonth: { value: "12", selector: "#cc-exp-month" },
      expYear: { value: "2025", selector: "#cc-exp-year" },
      code: { value: "123", selector: "#cc-csc" },
    },
  },
  {
    cipherType: CipherType.Identity,
    url: "https://fill.dev/form/identity-simple",
    uriMatchType: UriMatchType.Exact,
    inputs: {
      firstName: { value: "John", selector: "#given-name" },
      middleName: { value: "M", selector: "#additional-name" },
      lastName: { value: "Smith", selector: "#family-name" },
      address1: { value: "123 Main St", selector: "#address-line1" },
      address2: { value: "Apt 1", selector: "#address-line2" },
      city: { value: "New York", selector: "city" },
      state: { value: "NY", selector: "#address-level1" },
      postalCode: { value: "10001", selector: "#postal-code" },
      country: { value: "USA", selector: "#country" },
    },
  },

   **/
];
