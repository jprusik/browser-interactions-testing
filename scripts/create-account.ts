import fetch from "cross-fetch";
import { configDotenv } from "dotenv";

configDotenv();

type AccountCreationResponseData = {
  captchaBypassToken?: string;
  message?: string | "The model state is invalid.";
  validationErrors?: {
    [key: string]: string[];
  };
  exceptionMessage?: string | null;
  exceptionStackTrace?: string | null;
  innerExceptionMessage?: string | null;
  object?: "register" | "error";
};

let failedAttemptsCount = 0;

async function createAccount() {
  const {
    GENERATED_RSA_KEY_PAIR_PROTECTED_PRIVATE_KEY,
    GENERATED_RSA_KEY_PAIR_PUBLIC_KEY,
    KDF_ITERATIONS,
    MASTER_PASSWORD_HASH,
    PROTECTED_SYMMETRIC_KEY,
    VAULT_EMAIL,
    VAULT_HOST_URL,
    VAULT_HOST_PORT,
  } = process.env;
  const vaultHost = `${VAULT_HOST_URL}:${VAULT_HOST_PORT}`;

  try {
    const response = await fetch(`${vaultHost}/identity/accounts/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${VAULT_EMAIL}`,
        name: null,
        masterPasswordHash: `${MASTER_PASSWORD_HASH}`,
        key: `${PROTECTED_SYMMETRIC_KEY}`,
        kdf: 0,
        kdfIterations: `${KDF_ITERATIONS}`,
        referenceData: { id: null },
        captchaResponse: null,
        masterPasswordHint: null,
        keys: {
          publicKey: `${GENERATED_RSA_KEY_PAIR_PUBLIC_KEY}`,
          encryptedPrivateKey: `${GENERATED_RSA_KEY_PAIR_PROTECTED_PRIVATE_KEY}`,
        },
      }),
      method: "POST",
    });

    const responseData = (await response.json()) as AccountCreationResponseData;

    let emailIsTaken = false;

    const responseErrors =
      Object.values(responseData?.validationErrors || {})[0] || [];

    for (let error of responseErrors) {
      if (emailIsTaken) {
        break;
      }

      emailIsTaken = !!error.match(/^Email \'.*\' is already taken\.$/g)
        ?.length;
    }

    if (emailIsTaken) {
      console.log(
        "\x1b[1m\x1b[32m%s\x1b[0m", // bold, light green foreground
        `Account has been created successfully at ${vaultHost}!\n`,
      );

      return;
    }
  } catch (error) {
    // Server isn't ready yet
  }

  if (failedAttemptsCount > 60) {
    throw new Error("The account was unable to be created.");
  }

  console.log(`Retrying account creation at ${vaultHost}...`);

  failedAttemptsCount++;
  setTimeout(createAccount, 3000);
}

createAccount();
