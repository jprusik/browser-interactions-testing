import { configDotenv } from "dotenv";
import { exec } from "child_process";
import { promisify } from "util";
import { FolderItem, ItemTemplate } from "./abstractions/vault-seeder";
import { TestPage, testPages } from "../tests/constants";
import fetch from "cross-fetch";

configDotenv();

class VaultSeeder {
  private execAsync = promisify(exec);
  private sessionToken?: string;
  private bwServeApiUrl = `${process.env.BW_SERVE_API_HOST}:${process.env.BW_SERVE_API_PORT}`;

  constructor() {
    this.runSeeder();
  }

  private async runSeeder() {
    await this.refreshSessionToken();
    if (!this.sessionToken) {
      console.error("ERROR: Unable to seed vault, no session token found.");
      return;
    }

    await this.syncVault();

    // Get or Create Folder
    const testsFolder = await this.getPlaywrightCiphersFolder(
      "PlaywrightTestingItems",
    );
    if (!testsFolder) {
      console.error("ERROR: Unable to seed vault, tests folder not found.");
      return;
    }

    const vaultItems = await this.getAllVaultItems(testsFolder.id);
    testPages.forEach((testPage, index) => {
      const newItemName = `${index} ${testPage.itemName}`;
      const existingItem = vaultItems.find((item) => item.name === newItemName);
      if (existingItem) {
        return;
      }

      if (testPage.cipherType === "login") {
        return this.createLoginItem({
          testPage,
          newItemName,
          folderId: testsFolder.id,
        });
      }
    });
  }

  private async createLoginItem({
    testPage,
    newItemName,
    folderId,
  }: {
    testPage: TestPage;
    newItemName: string;
    folderId: string;
  }): Promise<void> {
    try {
      // const loginExec = await this.execAsync(
      //   `bw get template item.login | jq '.username="${testPage.inputs.username?.value}" | .password="${testPage.inputs.password?.value}" | .uris="[{uri: ${testPage.url}, match: null}]"'`,
      // );
      // console.warn(loginExec.stdout.replace(/(\r\n|\n|\r)/gm, ""));
      // const { stdout, stderr } = await this.execAsync(
      //   `bw get template item | jq ".type = 1 | .name=\"${newItemName}\" | .login=\"${loginExec.stdout.replace(
      //     /(\r\n|\n|\r)/gm,
      //     "",
      //   )}\" | bw encode | bw create item`,
      // );
      // if (stderr) {
      //   console.error(stderr);
      //   return;
      // }

      const response = await fetch(`${this.bwServeApiUrl}/object/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId,
          type: 1,
          name: newItemName,
          login: {
            uris: [
              {
                match: 0,
                uri: testPage.url,
              },
            ],
            username: testPage.inputs.username?.value,
            password: testPage.inputs.password?.value,
            totp: testPage.inputs.totp?.value,
          },
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  private async refreshSessionToken(): Promise<void> {
    if (!(await this.isUserLoggedIn())) {
      throw new Error(
        "ERROR: Bitwarden CLI user is not logged in, unable to seed the vault.",
      );
    }

    await this.unlockVault();
  }

  private async isUserLoggedIn(): Promise<boolean> {
    const userLoggedOutMessage = "You are not logged in.";
    try {
      const { stdout } = await this.execAsync("bw unlock --check");

      return stdout !== userLoggedOutMessage;
    } catch (err) {
      if (err !== userLoggedOutMessage) {
        return true;
      }

      console.error(err);
      return false;
    }
  }

  private async unlockVault(): Promise<void> {
    try {
      const { stdout, stderr } = await this.execAsync(
        `bw unlock --raw ${process.env.VAULT_PASSWORD}`,
      );
      if (stderr) {
        console.error(stderr);
        return;
      }

      this.sessionToken = stdout;
      process.env.BW_SESSION = this.sessionToken;
    } catch (err) {
      console.error(err);
    }
  }

  private async syncVault(): Promise<void> {
    try {
      const { stderr } = await this.execAsync(`bw sync`);
      if (stderr) {
        console.error(stderr);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async getPlaywrightCiphersFolder(
    folderName: string,
  ): Promise<FolderItem | undefined> {
    try {
      const { stdout } = await this.execAsync(`bw get folder ${folderName}`);

      return JSON.parse(stdout);
    } catch (err) {
      console.log(
        "Playwright testing items folder not found, creating folder...",
      );

      return await this.createPlaywrightCiphersFolder(folderName);
    }
  }

  private async createPlaywrightCiphersFolder(
    folderName: string,
  ): Promise<FolderItem | undefined> {
    try {
      const { stdout } = await this.execAsync(
        `bw get template folder | jq '.name="${folderName}"' | bw encode | bw create folder`,
      );

      return JSON.parse(stdout);
    } catch (err) {
      console.error(err);
    }
  }

  private async getAllVaultItems(folderId: string): Promise<ItemTemplate[]> {
    let vaultItems = [];
    try {
      const { stdout, stderr } = await this.execAsync(
        `bw list items --folderid ${folderId}`,
      );
      if (stderr) {
        console.error(stderr);
      }

      vaultItems = JSON.parse(stdout);
    } catch (err) {
      console.error(err);
    }

    if (!vaultItems) {
      return [];
    }

    return vaultItems;
  }
}

new VaultSeeder();
