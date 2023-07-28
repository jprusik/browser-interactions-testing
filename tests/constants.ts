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
  // Google currently complains about insecurity and refuses to show the password input on the subsequent screen
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
      triggerSelectors: ['header a[role="button"]'],
      iframeSource: "https://www.reddit.com/login/",
    },
    inputs: {
      username: {
        value: "bwplaywright",
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
        value: "bwplaywright",
        selector: "#loginUsername",
      },
      password: {
        value: "fakePassword",
        selector: "#loginPassword",
      },
    },
  },
  // Amazon sometimes adds an intermediate captcha step, skip testing password fill
  {
    cipherType: CipherType.Login,
    url: "https://www.amazon.com/gp/sign-in.html",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#ap_email",
        // multiStepNextInputKey: "password",
      },
      // password: {
      //   value: "fakePassword",
      //   selector: "#ap_password",
      // },
    },
  },
  // When Twitter sees "unusual login activity", it requests the username or phone number in an intermediate step
  {
    cipherType: CipherType.Login,
    url: "https://twitter.com/login?lang=en",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[autocomplete='username']",
        // multiStepNextInputKey: "password",
      },
      // password: {
      //   value: "areallygoodpassword",
      //   selector: "input[name='password']",
      // },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://login.yahoo.com/",
    inputs: {
      username: {
        value: "bwplaywright",
        selector: "#login-username",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "ayahoopassword",
        selector: "input#login-passwd",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page/",
    inputs: {
      username: {
        value: "bwplaywright",
        selector: "#wpName1",
      },
      password: {
        value: "fakePassword",
        selector: "#wpPassword1",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.instagram.com/accounts/login/",
    inputs: {
      username: {
        value: "bwplaywright",
        selector: "input[name='username']",
      },
      password: {
        value: "fakePassword",
        selector: "input[name='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://auth.fandom.com/signin/",
    inputs: {
      username: {
        value: "Bwplaywright",
        selector: "input[data-test='signin-username-field']",
      },
      password: {
        value: "fakePassword",
        selector: "input[data-test='signin-password-field']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://weather.com/login",
    inputs: {
      username: {
        value: "bwplaywright",
        selector: "#loginEmail",
      },
      password: {
        value: "fakePassword",
        selector: "#loginPassword",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://login.live.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[type='email']",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector:
          "input[aria-label='Enter the password for bwplaywright@gmail.com']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://login.microsoftonline.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[type='email']",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector:
          "input[aria-label='Enter the password for bwplaywright@gmail.com']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.tiktok.com/en/",
    hiddenForm: {
      formSelector: "#login-modal",
    },
    formSetupClickSelectors: [
      "a[href^='/login/phone-or-email']",
      "a[href^='/login/phone-or-email/email']",
    ],
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[placeholder='Email or username']",
      },
      password: {
        value: "fakePassword",
        selector: "input[placeholder='Password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://authentication.taboola.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#j_username[placeholder='Type Email...']",
      },
      password: {
        value: "fakePassword",
        selector: "#j_password[placeholder='Type Password...']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.cnn.com/account/log-in/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login-email-input",
      },
      password: {
        value: "fakePassword",
        selector: "#login-password-input",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://signin.ebay.com/signin/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#userid",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector: "#pass",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.twitch.tv/",
    hiddenForm: {
      triggerSelectors: ["button[data-a-target='login-button']"],
      formSelector: "div[data-a-target='passport-modal']",
    },
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login-username",
      },
      password: {
        value: "fakePassword",
        selector: "#password-input",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.linkedin.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#session_key",
      },
      password: {
        value: "fakePassword",
        selector: "#session_password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  /**
   * Note: walmart.com has some pretty aggressive bot detection,
   * so we're only testing the username autofill for now. */
  {
    cipherType: CipherType.Login,
    url: "https://www.walmart.com/account/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: 'input[name="Email Address"]',
        multiStepNextInputKey: "password",
      },
      password: {
        value: "aWalmartPassword",
        selector: "input[name='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.quora.com/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://myaccount.nytimes.com/auth/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://my.foxnews.com/",
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
    url: "https://www.espn.com/",
    additionalLoginUrls: [
      "https://cdn.registerdisney.go.com/v4/bundle/web/ESPN-ONESITE.WEB/",
    ],
    hiddenForm: {
      triggerSelectors: [
        "#global-user-trigger",
        '#global-viewport > .global-user a[tref="/members/v3_1/login"]',
      ],
      iframeSource:
        "https://cdn.registerdisney.go.com/v4/bundle/web/ESPN-ONESITE.WEB",
    },
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "[data-testid='InputIdentityFlowValue']",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector: "#InputPassword",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://reg.usps.com/entreg/LoginAction_input",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.imdb.com/registration/signin",
    formSetupClickSelectors: ["a[href^='https://www.imdb.com/ap/signin']"],
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#ap_email",
      },
      password: {
        value: "fakePassword",
        selector: "#ap_password",
      },
    },
  },
  // Indeed is sometimes requiring a captcha to make it to the second (password) screen
  {
    cipherType: CipherType.Login,
    url: "https://secure.indeed.com/auth",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[type='email']",
        multiStepNextInputKey: "password",
      },
      password: {
        preFillActions: async (page) =>
          await page.locator("#auth-page-google-password-fallback").click(),
        value: "anIndeedPassword",
        selector: "input[name='__password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.paypal.com/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://zoom.us/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://discord.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[aria-label='Email or Phone Number']",
      },
      password: {
        value: "fakePassword",
        selector: "input[aria-label='Password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.netflix.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#id_userLoginId",
      },
      password: {
        value: "fakePassword",
        selector: "#id_password",
      },
    },
  },
  // Zillow has a bot/detection "press & hold" test that pariodically triggers
  {
    cipherType: CipherType.Login,
    url: "https://www.zillow.com/",
    hiddenForm: {
      triggerSelectors: [
        'header nav > div:nth-child(2) a[href^="/user/acct/login/?cid=pf"]',
      ],
      formSelector: 'section[role="dialog"]',
    },
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#reg-login-email",
      },
      password: {
        value: "fakePassword",
        selector: "#inputs-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.etsy.com/",
    hiddenForm: {
      triggerSelectors: ["button.signin-header-action"],
      formSelector: "#join-neu-overlay > .wt-overlay__modal",
    },
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#join_neu_email_field",
      },
      password: {
        value: "fakePassword",
        selector: "#join_neu_password_field",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.pinterest.com/",
    hiddenForm: {
      triggerSelectors: ['div[data-test-id="simple-login-button"]'],
      formSelector: 'div[data-test-id="login-modal-default"]',
    },
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.pinterest.com/login/",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  // dailymail sometimes stalls waiting for the page load event
  // Note: dailymail also fires a notification permissions request. If you accept, it automatically downloads an executable called `MailOnlineSetup.exe`.
  {
    cipherType: CipherType.Login,
    url: "https://www.dailymail.co.uk/registration/login.html",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[name='j_username']",
      },
      password: {
        value: "fakePassword",
        selector: "input[name='j_password']",
      },
    },
  },
  // Home Depot's login requires an intermediate step of selecting a login with password option after entering an email
  // Additionally, the email login sometimes fails on the first step (presumably due to automation detection)
  {
    cipherType: CipherType.Login,
    url: "https://www.homedepot.com/auth/view/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
        multiStepNextInputKey: "password",
      },
      password: {
        preFillActions: async (page) => {
          const dismissButton = await page
            .locator("button.u__default-link")
            .filter({ hasText: "No Thanks" });
          dismissButton?.click();
        },
        value: "aHomeDepotPassword",
        selector: "input#password-input-field",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://github.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login_field",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://nypost.com/account/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://wwwl.accuweather.com/premium_login.php",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakePassword",
        selector: "#password",
      },
    },
  },
  //
  //
  //
  //
  //
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
