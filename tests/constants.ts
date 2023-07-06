type TestPage = {
  url: string;
  inputs: {
    username: { value: string; selector: string };
    password: { value: string; selector: string };
  };
  postFillSubmit?: boolean;
};

export const testPages: TestPage[] = [
  {
    url: "tests/test-pages/basic-form.html",
    inputs: {
      username: { value: "jsmith", selector: "#username" },
      password: { value: "areallygoodpassword", selector: "#password" },
    },
  },
  {
    url: "tests/test-pages/multi-step-form.html",
    inputs: {
      username: { value: "ms-smith", selector: "#username" },
      password: { value: "ms-password", selector: "#password" },
    },
    postFillSubmit: true,
  },
  {
    url: "https://fill.dev/form/login-simple",
    inputs: {
      username: { value: "simple-test", selector: "#username" },
      password: { value: "apassword", selector: "#password" },
    },
  },

  // Known failure cases:
  {
    url: "tests/test-pages/many-input-form.html",
    inputs: {
      username: { value: "js", selector: "#username" },
      password: { value: "", selector: "#password" },
    },
  },
  {
    url: "https://auth.max.com/login",
    inputs: {
      username: { value: "maxcom_user", selector: "#username" },
      password: { value: "maxcom_password", selector: "#password" },
    },
  },
  {
    url: "https://login.clear.com.br/",
    inputs: {
      username: { value: "12345678901111", selector: "#username" },
      password: { value: "098765", selector: "#password" },
    },
  },
];
