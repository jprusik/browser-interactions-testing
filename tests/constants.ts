import { configDotenv } from "dotenv";
configDotenv();

type FillProperties = {
  value: string;
  selector: string;
};

export type TestPage = {
  cipherType?: "login" | "card" | "identity";
  itemName: string;
  url: string;
  postFillSubmit?: boolean;
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

const localPagesUri = `${process.env.PAGES_HOST}:${process.env.PAGES_HOST_PORT}`;

export const testPages: TestPage[] = [
  {
    cipherType: "login",
    itemName: "Basic Form",
    url: `${localPagesUri}/tests/test-pages/basic-form.html`,
    inputs: {
      username: { value: "jsmith", selector: "#username" },
      password: { value: "areallygoodpassword", selector: "#password" },
    },
  },
  {
    cipherType: "login",
    itemName: "Multi-Step Form",
    url: `${localPagesUri}/tests/test-pages/multi-step-form.html`,
    postFillSubmit: true,
    inputs: {
      username: { value: "ms-smith", selector: "#username" },
      password: { value: "ms-password", selector: "#password" },
    },
  },
  {
    cipherType: "login",
    itemName: "Fill.dev Login",
    url: "https://fill.dev/form/login-simple",
    inputs: {
      username: { value: "simple-test", selector: "#username" },
      password: { value: "apassword", selector: "#password" },
    },
  },

  // Known failure cases:
  {
    cipherType: "login",
    itemName: "Many Input Form",
    url: `${localPagesUri}/tests/test-pages/many-input-form.html`,
    inputs: {
      username: { value: "js", selector: "#username" },
      password: { value: "", selector: "#password" },
    },
  },
  {
    cipherType: "login",
    itemName: "Max.com Login",
    url: "https://auth.max.com/login",
    inputs: {
      username: { value: "maxcom_user", selector: "#username" },
      password: { value: "maxcom_password", selector: "#password" },
    },
  },
  {
    cipherType: "login",
    itemName: "Clear.com.br Login",
    url: "https://login.clear.com.br/",
    inputs: {
      username: { value: "12345678901111", selector: "#username" },
      password: { value: "098765", selector: "#password" },
    },
  },
];
