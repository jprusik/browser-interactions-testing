import { CipherType } from "../../clients/libs/common/src/vault/enums/cipher-type";
import {
  FieldType,
  LinkedIdType,
  UriMatchType,
} from "../../clients/libs/common/src/enums";

type FillProperties = {
  value: string;
  selector: string;
  multiStepNextInputKey?: string;
};

type TestPage = {
  cipherType: CipherType;
  url: string;
  additionalLoginUrls?: string[];
  uriMatchType?: UriMatchType;
  hiddenForm?: {
    triggerSelectors?: string[];
    formSelector?: string;
    iframeSource?: string;
  };
  formSetupClickSelectors?: string[];
  inputs: {
    // Login fields
    username?: FillProperties;
    password?: FillProperties;
    totp?: FillProperties;

    // Card fields
    cardholderName?: FillProperties;
    brand?: FillProperties;
    number?: FillProperties;
    expMonth?: FillProperties;
    expYear?: FillProperties;
    code?: FillProperties;

    // Identity fields
    title?: FillProperties;
    firstName?: FillProperties;
    middleName?: FillProperties;
    lastName?: FillProperties;
    address1?: FillProperties;
    address2?: FillProperties;
    address3?: FillProperties;
    city?: FillProperties;
    state?: FillProperties;
    postalCode?: FillProperties;
    country?: FillProperties;
    company?: FillProperties;
    email?: FillProperties;
    phone?: FillProperties;
    ssn?: FillProperties;
    passportNumber?: FillProperties;
    licenseNumber?: FillProperties;
  };
};

export { FillProperties, TestPage };
