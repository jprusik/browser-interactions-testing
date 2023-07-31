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
    url: "https://accounts.google.com",
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
    url: "https://www.facebook.com",
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
    url: "https://www.reddit.com",
    hiddenForm: {
      triggerSelectors: ['header a[role="button"]'],
      iframeSource: "https://www.reddit.com/login",
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
    url: "https://www.reddit.com/login",
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
    url: "https://login.yahoo.com",
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
    url: "https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page",
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
    url: "https://www.instagram.com/accounts/login",
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
    url: "https://auth.fandom.com/signin",
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
    url: "https://login.live.com",
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
    url: "https://login.microsoftonline.com",
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
    url: "https://www.tiktok.com/en",
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
    url: "https://authentication.taboola.com",
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
    url: "https://www.cnn.com/account/log-in",
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
    url: "https://signin.ebay.com/signin",
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
    url: "https://www.twitch.tv",
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
    url: "https://www.linkedin.com",
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
    url: "https://www.quora.com",
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
    url: "https://my.foxnews.com",
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
    url: "https://www.espn.com",
    additionalLoginUrls: [
      "https://cdn.registerdisney.go.com/v4/bundle/web/ESPN-ONESITE.WEB",
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
    url: "https://www.zillow.com",
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
    url: "https://www.etsy.com",
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
    url: "https://www.pinterest.com",
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
    url: "https://www.pinterest.com/login",
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
  {
    cipherType: CipherType.Login,
    url: "https://character.ai",
    additionalLoginUrls: ["https://character-ai.us.auth0.com"],
    uriMatchType: UriMatchType.Host,
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Close the pop-up prompting you to use the mobile app
          await page.locator("#mobile-app-modal-close").click();
          // Accept the cookie policy
          await page
            .locator("button")
            .filter({ hasText: "Accept" })
            .first()
            .click();
          // Go to the login page (cannot go directly to the login page)
          await page
            .locator("button")
            .filter({ hasText: "Log In" })
            .first()
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakeCharacterAIPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://platform.openai.com/login?launch",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeOpenAIPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.ups.com/lasso/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeUPSPassword",
        selector: "#pwd",
      },
    },
  },
  // Patreon will sometimes send login links to the email
  // Patreon prequalifies the email and starts account creation workflow if it isn't recognized as an existing account
  {
    cipherType: CipherType.Login,
    url: "https://www.patreon.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[name='email']",
        multiStepNextInputKey: "password",
      },
      // @TODO create Patreon account with test email in order to test password auto-fill
      // password: {
      //   value: "fakePatreonPassword",
      //   selector: "input[placeholder='Your name']",
      // },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://imgur.com/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakeImgurPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://ign.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Open user account menu
          await page.locator("button.login-avatar").click();
          // Open login modal
          await page
            .locator("button")
            .filter({ hasText: "Login" })
            .first()
            .click();
          // Open the login form
          await page
            .locator("button")
            .filter({ hasText: "Log in with an email or username" })
            .first()
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakeIGNPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://aws.amazon.com",
    additionalLoginUrls: ["https://signin.aws.amazon.com"],
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the login link to get redirected to the login domain/page
          await page
            .locator("#aws-page-header a")
            .filter({ hasText: "Sign In" })
            .first()
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "input#resolving_input[type='email']",
        // multiStepNextInputKey: "password",
      },
      // @TODO create Amazon AWS account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.roblox.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login-username",
      },
      password: {
        value: "fakeRobloxPassword",
        selector: "#login-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://accounts.spotify.com/en/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login-username",
      },
      password: {
        value: "fakeSpotifyPassword",
        selector: "#login-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.instructure.com/canvas/login/free-for-teacher",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#edit-email",
      },
      password: {
        value: "fakeInstructurePassword",
        selector: "#edit-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://badgr.com/auth/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakeBadgrPassword",
        selector: "#enter-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://portfolium.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#pf-simple-sign-in--field--identity",
      },
      password: {
        value: "fakePortfoliumPassword",
        selector: "#pf-simple-sign-in--field--password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://app.masteryconnect.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login",
      },
      password: {
        value: "fakeMasteryPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://identity.us2.kimonocloud.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeElevateDSPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://app.learnplatform.com/users/sign_in",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeLearnPlatformPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.target.com/account",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakeTargetPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://accounts.craigslist.org/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#inputEmailHandle",
      },
      password: {
        value: "fakeCraigsListPassword",
        selector: "#inputPassword",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.capitalone.com",
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input.login-username",
      },
      password: {
        value: "fakeCapitalOneWidgetPassword",
        selector: "input.login-password[type='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://verified.capitalone.com/auth/signin",
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[aria-describedby='label-username-input']",
      },
      password: {
        value: "fakeCapitalOnePassword",
        selector: "input[aria-describedby='label-password-input']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.fedex.com/secure-login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#userId",
      },
      password: {
        value: "fakeFedExPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.tumblr.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the login button to bring up the account modal
          await page.locator("a").filter({ hasText: "Log In" }).first().click();
          // Click the "Continue with email" button
          await page
            .locator('button[aria-label="Continue with email"]')
            .first()
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "input[name='email']",
        // multiStepNextInputKey: "password",
      },
      // @TODO create tumblr account with test email in order to test password auto-fill
    },
  },
  // Samsung has aggressive automation-blocking, captcha step after email entry
  {
    cipherType: CipherType.Login,
    url: "https://account.samsung.com/membership/auth/sign-in",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#iptLgnPlnID",
        // multiStepNextInputKey: "password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://seguro.marca.com/registro/v3/?view=login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#inputEmailLogin",
      },
      // @TODO create marca account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.bestbuy.com/identity/global/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#fld-e",
      },
      password: {
        value: "fakeBestBuyPassword",
        selector: "#fld-p1",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.adobe.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the login button to get redirected to the login page (with token)
          await page
            .locator("span.feds-login-text")
            .filter({ hasText: "Sign In" })
            .first()
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#EmailPage-EmailField",
        // multiStepNextInputKey: "password",
      },
      // @TODO create an adobe account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://auth.hulu.com/web/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "input[data-automationid='email-field']",
      },
      password: {
        value: "fakeHuluPassword",
        selector: "input[data-automationid='password-field']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://account.bbc.com/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#user-identifier-input",
      },
      password: {
        value: "fakeBBCPassword",
        selector: "#password-input",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://steamcommunity.com/login/home",
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector:
          "form div:has-text('Sign in with account name') input[type='text']",
      },
      password: {
        value: "fakeSteamCommunityPassword",
        selector: "form input[type='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://store.steampowered.com/login",
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector:
          "form div:has-text('Sign in with account name') input[type='text']",
      },
      password: {
        value: "fakeSteamStorePassword",
        selector: "form input[type='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.lowes.com/u/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#email",
      },
      password: {
        value: "fakeLowesPassword",
        selector: "#user-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://login.xfinity.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#user",
        // multiStepNextInputKey: "password",
      },
      // @TODO create an xfinity account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.bezzypsa.com/signin/SIGNIN",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#signin-email",
      },
      password: {
        value: "fakeBezzyPassword",
        selector: "#signin-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.yelp.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: ".login form #email",
      },
      password: {
        value: "fakeYelpPassword",
        selector: ".login form #password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://wordpress.com/log-in",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#usernameOrEmail",
        // multiStepNextInputKey: "password",
      },
      // @TODO create a Wordpress account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://nextdoor.com/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#id_email",
      },
      password: {
        value: "fakeNextdoorPassword",
        selector: "#id_password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://linktr.ee/login",
    inputs: {
      username: {
        value: "bwplaywright",
        selector: "input[name='username']",
      },
      password: {
        value: "fakeLinktreePassword",
        selector: "input[name='password']",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://quizlet.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the log in button to trigger the login modal
          await page.locator("button").filter({ hasText: "Log in" }).click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#username",
      },
      password: {
        value: "fakeQuizletPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://realtor.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the log in button to trigger the login modal
          await page
            .locator(".user-profile_header-login")
            .filter({ hasText: "Log in" })
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#raas_email",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeRealtorPassword",
        selector: "#raas_password",
      },
    },
  },
  // Canva prequalifies the email and starts account creation workflow if it isn't recognized as an existing account
  {
    cipherType: CipherType.Login,
    url: "https://www.canva.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the log in button to trigger the login modal
          await page
            .locator("header button span")
            .filter({ hasText: "Log in" })
            .first()
            .click();
          // Select Continue with email option
          await page
            .locator("button")
            .filter({ hasText: "Continue with email" })
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "input[name='email']",
        // multiStepNextInputKey: "password",
      },
      // @TODO create a Canva account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.att.com/acctmgmt/login",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#userID",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeATTPassword",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://auth0.com/api/auth/login",
    additionalLoginUrls: ["https://auth0.auth0.com/"],
    uriMatchType: UriMatchType.Host,
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeAuth0Password",
        selector: "#password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.washingtonpost.com/subscribe/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#username",
        // multiStepNextInputKey: "password",
      },
      // @TODO create a Washington Post account with test email in order to test password auto-fill
    },
  },
  // AOL uses a captcha between username entry and password entry
  {
    cipherType: CipherType.Login,
    url: "https://login.aol.com",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#login-username",
        // multiStepNextInputKey: "password",
      },
      // @TODO create a Washington Post account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.t-mobile.com",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the reject button on the interaction analysis modal
          await page.locator("#onetrust-reject-all-handler").click();
          // Click the log in button to trigger the login modal
          await page
            .locator("button")
            .filter({ hasText: "Log in" })
            .first()
            .click();
          // Select Continue with email option
          await page
            .locator(".unav-account__dropdown a")
            .filter({ hasText: "Log in" })
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#usernameTextBox",
        // multiStepNextInputKey: "password",
      },
      // @TODO create a t-mobile account with test email in order to test password auto-fill
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://login.okta.com/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#okta-signin-username",
      },
      password: {
        value: "fakeOktaSupportPassword",
        selector: "#okta-signin-password",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://bethesda.net",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the LOG IN / SIGN UP button to bring up the login modal
          await page
            .locator("button span")
            .filter({ hasText: "Log In / Sign Up" })
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#username-input",
      },
      password: {
        value: "fakeBethesdaPassword",
        selector: "#password-input",
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
    url: "https://login.clear.com.br",
    inputs: {
      username: { value: "12345678901111", selector: "#username" },
      password: { value: "098765", selector: "#password" },
    },
  },
  // Auto-fill is targeting the registration form (on the same page) over the login form which appears after
  {
    cipherType: CipherType.Login,
    url: "https://www.gamespot.com/login-signup",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#form__username",
      },
      password: {
        value: "fakeGamespotPassword",
        selector: "#form__password",
      },
    },
  },
  // Temu sometimes has a captcha challenge before showing the password field.
  {
    cipherType: CipherType.Login,
    url: "https://temu.com",
    inputs: {
      username: {
        preFillActions: async (page) => {

          // Await and dismiss promo modals
          await page.locator('div[role="dialog"]');
          await page.locator('div[role="dialog"] img[alt="close icon"]').click();
          // Click the login/account button to trigger the login modal
          await page
            .locator('#mainHeader .mainContent div[role="button"]')
            .filter({ hasText: "Sign in / Register" })
            .first()
            .click();
        },
        value: "bwplaywright@gmail.com",
        selector: "#user-account",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeTemuPassword",
        selector: "#pwdInputInLoginDialog",
      },
    },
  },
  {
    cipherType: CipherType.Login,
    url: "https://www.temu.com/login.html",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#user-account",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeTemuLoginPagePassword",
        selector: "#pwdInputInLoginDialog",
      },
    },
  },
  // Apple sign in form is within an iframe
  {
    cipherType: CipherType.Login,
    url: "https://www.apple.com/",
    inputs: {
      username: {
        preFillActions: async (page) => {
          // Click the store button to get the dropdown menu which includes the link to the login page
          await page.locator('a#globalnav-menubutton-link-bag').click();
          // Click the log in link to be redirected to the login page
          await page
            .locator('a[data-autom="sign-in"]')
            .first()
            .click();
        },
        multiStepNextInputKey: "password",
        value: "bwplaywright@gmail.com",
        selector: "#account_name_text_field",
      },
      password: {
        value: "fakeApplePassword",
        selector: "#password_text_field",
      },
    },
  },
  // Marvel sign in form is within an iframe
  // Note; marvel.com has it's own login but checks against the existence of a Disney account before allowing password entry
  {
    cipherType: CipherType.Login,
    url: "https://www.marvel.com/signin",
    inputs: {
      username: {
        value: "bwplaywright@gmail.com",
        selector: "#InputIdentityFlowValue",
        multiStepNextInputKey: "password",
      },
      password: {
        value: "fakeMarvelPassword",
        selector: "#InputPassword",
      },
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
