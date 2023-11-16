import { CipherType } from "../../clients/libs/common/src/vault/enums/cipher-type";
import { UriMatchType } from "../../clients/libs/common/src/enums";
import { TestPage } from "../abstractions/constants";
import { localPagesUri } from "./server";

const testUserName = "bwplaywright";

export const testPages: TestPage[] = [
  /**
   * Local webpages
   */
  {
    cipherType: CipherType.Login,
    url: `${localPagesUri}/tests/test-pages/basic-form.html`,
    uriMatchType: UriMatchType.Exact,
    inputs: {
      username: { selector: "#username", value: testUserName },
      password: { selector: "#password", value: "fakeBasicFormPassword" },
    },
  },
];
