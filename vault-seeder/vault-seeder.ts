import fetch from "cross-fetch";
import { configDotenv } from "dotenv";
import { FolderItem, ItemTemplate } from "./abstractions/vault-seeder";
import { TestPage, testPages } from "../tests/constants";
import { CipherType } from "../clients/libs/common/src/vault/enums/cipher-type";

configDotenv();

class VaultSeeder {
  constructor() {
    this.runSeeder().then(async () => {
      console.log("Seeding complete, locking vault...");
      await this.lockVault();
    });
  }

  private async runSeeder() {
    const sessionToken = await this.unlockVault();
    if (!sessionToken) {
      console.error("ERROR: Unable to seed vault, no session token found.");
      return;
    }

    await this.syncVault();

    const testsFolder = await this.getPlaywrightCiphersFolder(
      "PlaywrightTestingItems",
    );
    if (!testsFolder) {
      throw new Error("Unable to seed vault, tests folder not found.");
    }

    await this.seedVault(testsFolder);
  }

  private async seedVault(testsFolder: FolderItem): Promise<void> {
    const vaultItems = await this.getAllVaultItems(testsFolder.id);
    for (let index = 0; index < testPages.length; index++) {
      await this.sleep(300 * index);

      const testPage = testPages[index];
      const newItemName = `${index} ${testPage.url}`;
      const existingItem = vaultItems.find((item) => item.name === newItemName);

      if (existingItem) {
        return;
      }

      if (testPage.cipherType === CipherType.Login) {
        await this.createLoginItem({
          testPage,
          newItemName,
          folderId: testsFolder.id,
        });
      }
    }
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
    const { success, message } = await this.queryApi(`/object/item`, "POST", {
      folderId,
      type: CipherType.Login,
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
    });
    if (!success) {
      console.error(
        `ERROR: Unable to create login item for ${testPage.url}, ${message}`,
      );
      return;
    }

    console.log(`Created login item for ${testPage.url}`);
  }

  private async unlockVault(): Promise<string> {
    const { success, data, message } = await this.queryApi(`/unlock`, "POST", {
      password: process.env.VAULT_PASSWORD,
    });
    if (!success) {
      throw new Error(message);
    }

    console.log("Vault unlocked");
    return data?.raw;
  }

  private async lockVault(): Promise<void> {
    const { success, data, message } = await this.queryApi(`/lock`, "POST");
    if (!success) {
      throw new Error(message);
    }
  }

  private async syncVault(): Promise<void> {
    const { success, message } = await this.queryApi(`/sync`, "POST");
    if (!success) {
      throw new Error(message);
    }
  }

  private async getPlaywrightCiphersFolder(
    folderName: string,
  ): Promise<FolderItem | undefined> {
    const { success, data, message } = await this.queryApi(
      `/object/folder/${folderName}`,
    );

    if (success) {
      return data;
    }

    if (message === "Not found.") {
      console.log(
        "Playwright testing items folder not found, creating folder...",
      );
      return await this.createPlaywrightCiphersFolder(folderName);
    }
  }

  private async createPlaywrightCiphersFolder(
    folderName: string,
  ): Promise<FolderItem | undefined> {
    const { success, data, message } = await this.queryApi(
      `/object/folder`,
      "POST",
      { name: folderName },
    );

    if (!success) {
      console.error(`ERROR: Unable to create folder ${folderName}, ${message}`);
      return;
    }

    return data;
  }

  private async getAllVaultItems(folderId: string): Promise<ItemTemplate[]> {
    const { success, data, message } = await this.queryApi(
      `/list/object/items?folderid=${folderId}`,
    );
    if (!success) {
      throw new Error(
        `ERROR: Unable to get vault items for folder ${folderId}, ${message}`,
      );
    }

    return data.data;
  }

  private async queryApi(
    route: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: any = null,
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await fetch(
        `${process.env.BW_SERVE_API_HOST}:${process.env.BW_SERVE_API_PORT}${route}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
        },
      );

      return await response.json();
    } catch (error) {
      console.error(error);
    }

    return { success: false, message: "Error encountered during fetch" };
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

new VaultSeeder();
