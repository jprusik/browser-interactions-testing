"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserApi = void 0;
class BrowserApi {
    static isWebExtensionsApi = typeof browser !== "undefined";
    static isSafariApi = false;
    static isChromeApi = false;
    static isFirefoxOnAndroid = false;
    static async getTabFromCurrentWindowId() {
        return await BrowserApi.tabsQueryFirst({
            active: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT,
        });
    }
    static async getTabFromCurrentWindow() {
        return await BrowserApi.tabsQueryFirst({
            active: true,
            currentWindow: true,
        });
    }
    static async getActiveTabs() {
        return await BrowserApi.tabsQuery({
            active: true,
        });
    }
    static async tabsQuery(options) {
        return new Promise((resolve) => {
            chrome.tabs.query(options, (tabs) => {
                resolve(tabs);
            });
        });
    }
    static async tabsQueryFirst(options) {
        const tabs = await BrowserApi.tabsQuery(options);
        if (tabs.length > 0) {
            return tabs[0];
        }
        return null;
    }
    static tabSendMessageData(tab, command, data = null) {
        const obj = {
            command: command,
        };
        if (data != null) {
            obj.data = data;
        }
        return BrowserApi.tabSendMessage(tab, obj);
    }
    static async tabSendMessage(tab, obj, options = null) {
        if (!tab || !tab.id) {
            return;
        }
        return new Promise((resolve) => {
            window.fillForm(obj);
            resolve();
        });
    }
    static async getPrivateModeWindows() {
        return (await browser.windows.getAll()).filter((win) => win.incognito);
    }
    static async onWindowCreated(callback) {
        return chrome.windows.onCreated.addListener(callback);
    }
    static getBackgroundPage() {
        return chrome.extension.getBackgroundPage();
    }
    static getApplicationVersion() {
        return chrome.runtime.getManifest().version;
    }
    static async isPopupOpen() {
        return Promise.resolve(chrome.extension.getViews({ type: "popup" }).length > 0);
    }
    static createNewTab(url, extensionPage = false, active = true) {
        chrome.tabs.create({ url: url, active: active });
    }
    static messageListener(name, callback) {
        chrome.runtime.onMessage.addListener((msg, sender, response) => {
            callback(msg, sender, response);
        });
    }
    static sendMessage(subscriber, arg = {}) {
        const message = Object.assign({}, { command: subscriber }, arg);
        return chrome.runtime.sendMessage(message);
    }
    static async closeLoginTab() {
        const tabs = await BrowserApi.tabsQuery({
            active: true,
            title: "Bitwarden",
            windowType: "normal",
            currentWindow: true,
        });
        if (tabs.length === 0) {
            return;
        }
        const tabToClose = tabs[tabs.length - 1].id;
        chrome.tabs.remove(tabToClose);
    }
    static async focusSpecifiedTab(tabId) {
        chrome.tabs.update(tabId, { active: true, highlighted: true });
    }
    static closePopup(win) {
        if (BrowserApi.isWebExtensionsApi && BrowserApi.isFirefoxOnAndroid) {
            // Reactivating the active tab dismisses the popup tab. The promise final
            // condition is only called if the popup wasn't already dismissed (future proofing).
            // ref: https://bugzilla.mozilla.org/show_bug.cgi?id=1433604
            browser.tabs.update({ active: true }).finally(win.close);
        }
        else {
            win.close();
        }
    }
    static gaFilter() {
        return process.env.ENV !== "production";
    }
    static getUILanguage(win) {
        return chrome.i18n.getUILanguage();
    }
    static reloadExtension(win) {
        if (win != null) {
            return win.location.reload(true);
        }
        else {
            return chrome.runtime.reload();
        }
    }
    static reloadOpenWindows() {
        const views = chrome.extension.getViews();
        views
            .filter((w) => w.location.href != null)
            .forEach((w) => {
            w.location.reload();
        });
    }
    static connectNative(application) {
        if (BrowserApi.isWebExtensionsApi) {
            return browser.runtime.connectNative(application);
        }
        else if (BrowserApi.isChromeApi) {
            return chrome.runtime.connectNative(application);
        }
    }
    static requestPermission(permission) {
        if (BrowserApi.isWebExtensionsApi) {
            return browser.permissions.request(permission);
        }
        return new Promise((resolve, reject) => {
            chrome.permissions.request(permission, resolve);
        });
    }
    static getPlatformInfo() {
        if (BrowserApi.isWebExtensionsApi) {
            return browser.runtime.getPlatformInfo();
        }
        return new Promise((resolve) => {
            chrome.runtime.getPlatformInfo(resolve);
        });
    }
}
exports.BrowserApi = BrowserApi;
//# sourceMappingURL=browserApi.js.map