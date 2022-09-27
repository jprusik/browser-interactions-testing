"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherRepromptType_1 = require("./bitwarden/enums/cipherRepromptType");
const cipherType_1 = require("./bitwarden/enums/cipherType");
const fieldType_1 = require("./bitwarden/enums/fieldType");
const browserApi_1 = require("./browserApi");
const autofillScript_1 = require("./models/autofillScript");
const autofillConstants_1 = require("./autofillConstants");
class AutofillService {
    constructor() { }
    getFormsWithPasswordFields(pageDetails) {
        const formData = [];
        const passwordFields = AutofillService.loadPasswordFields(pageDetails, true, true, false, false);
        if (passwordFields.length === 0) {
            return formData;
        }
        for (const formKey in pageDetails.forms) {
            // eslint-disable-next-line
            if (!pageDetails.forms.hasOwnProperty(formKey)) {
                continue;
            }
            const formPasswordFields = passwordFields.filter((pf) => formKey === pf.form);
            if (formPasswordFields.length > 0) {
                let uf = this.findUsernameField(pageDetails, formPasswordFields[0], false, false, false);
                if (uf == null) {
                    // not able to find any viewable username fields. maybe there are some "hidden" ones?
                    uf = this.findUsernameField(pageDetails, formPasswordFields[0], true, true, false);
                }
                formData.push({
                    form: pageDetails.forms[formKey],
                    password: formPasswordFields[0],
                    username: uf,
                    passwords: formPasswordFields,
                });
            }
        }
        return formData;
    }
    async doAutoFill(options) {
        const tab = options.tab;
        if (!tab || !options.cipher || !options.pageDetails || !options.pageDetails.length) {
            throw new Error("Nothing to auto-fill.");
        }
        let totpPromise = null;
        const canAccessPremium = false;
        let didAutofill = false;
        options.pageDetails.forEach((pd) => {
            // make sure we're still on correct tab
            if (pd.tab.id !== tab.id || pd.tab.url !== tab.url) {
                return;
            }
            const fillScript = this.generateFillScript(pd.details, {
                skipUsernameOnlyFill: options.skipUsernameOnlyFill || false,
                onlyEmptyFields: options.onlyEmptyFields || false,
                onlyVisibleFields: options.onlyVisibleFields || false,
                fillNewPassword: options.fillNewPassword || false,
                cipher: options.cipher,
            });
            if (!fillScript || !fillScript.script || !fillScript.script.length) {
                return;
            }
            // Add a small delay between operations
            fillScript.properties.delay_between_operations = 20;
            didAutofill = true;
            if (!options.skipLastUsed) {
                //this.cipherService.updateLastUsedDate(options.cipher.id);
            }
            browserApi_1.BrowserApi.tabSendMessage(tab, {
                command: "fillForm",
                fillScript: fillScript,
                url: tab.url,
            }, { frameId: pd.frameId });
            if (options.cipher.type !== cipherType_1.CipherType.Login ||
                totpPromise ||
                !options.cipher.login.totp ||
                (!canAccessPremium && !options.cipher.organizationUseTotp)) {
                return;
            }
            /*
            totpPromise = this.stateService.getDisableAutoTotpCopy().then((disabled) => {
              if (!disabled) {
                return this.totpService.getCode(options.cipher.login.totp);
              }
              return null;
            });
            */
        });
        if (didAutofill) {
            //this.eventService.collect(EventType.Cipher_ClientAutofilled, options.cipher.id);
            if (totpPromise != null) {
                return await totpPromise;
            }
            else {
                return null;
            }
        }
        else {
            throw new Error("Did not auto-fill.");
        }
    }
    async doAutoFillOnTab(pageDetails, tab, fromCommand) {
        let cipher;
        if (fromCommand) {
            //cipher = await this.cipherService.getNextCipherForUrl(tab.url);
        }
        else {
            /*const lastLaunchedCipher = await this.cipherService.getLastLaunchedForUrl(tab.url, true);
            if (
              lastLaunchedCipher &&
              Date.now().valueOf() - lastLaunchedCipher.localData?.lastLaunched?.valueOf() < 30000
            ) {
              cipher = lastLaunchedCipher;
            } else {
              cipher = await this.cipherService.getLastUsedForUrl(tab.url, true);
            }
            */
            if (cipher == null) {
                return null;
            }
        }
        if (cipher.reprompt !== cipherRepromptType_1.CipherRepromptType.None) {
            return;
        }
        const totpCode = await this.doAutoFill({
            tab: tab,
            cipher: cipher,
            pageDetails: pageDetails,
            skipLastUsed: !fromCommand,
            skipUsernameOnlyFill: !fromCommand,
            onlyEmptyFields: !fromCommand,
            onlyVisibleFields: !fromCommand,
            fillNewPassword: fromCommand,
        });
        // Update last used index as autofill has succeed
        if (fromCommand) {
            //this.cipherService.updateLastUsedIndexForUrl(tab.url);
        }
        return totpCode;
    }
    async doAutoFillActiveTab(pageDetails, fromCommand) {
        const tab = await this.getActiveTab();
        if (!tab || !tab.url) {
            return;
        }
        return await this.doAutoFillOnTab(pageDetails, tab, fromCommand);
    }
    // Helpers
    async getActiveTab() {
        const tab = await browserApi_1.BrowserApi.getTabFromCurrentWindow();
        if (!tab) {
            throw new Error("No tab found.");
        }
        return tab;
    }
    generateFillScript(pageDetails, options) {
        if (!pageDetails || !options.cipher) {
            return null;
        }
        let fillScript = new autofillScript_1.default(pageDetails.documentUUID);
        const filledFields = {};
        const fields = options.cipher.fields;
        if (fields && fields.length) {
            const fieldNames = [];
            fields.forEach((f) => {
                if (AutofillService.hasValue(f.name)) {
                    fieldNames.push(f.name.toLowerCase());
                }
            });
            pageDetails.fields.forEach((field) => {
                // eslint-disable-next-line
                if (filledFields.hasOwnProperty(field.opid)) {
                    return;
                }
                if (!field.viewable && field.tagName !== "span") {
                    return;
                }
                const matchingIndex = this.findMatchingFieldIndex(field, fieldNames);
                if (matchingIndex > -1) {
                    const matchingField = fields[matchingIndex];
                    let val;
                    if (matchingField.type === fieldType_1.FieldType.Linked) {
                        // Assumption: Linked Field is not being used to autofill a boolean value
                        val = options.cipher.linkedFieldValue(matchingField.linkedId);
                    }
                    else {
                        val = matchingField.value;
                        if (val == null && matchingField.type === fieldType_1.FieldType.Boolean) {
                            val = "false";
                        }
                    }
                    filledFields[field.opid] = field;
                    AutofillService.fillByOpid(fillScript, field, val);
                }
            });
        }
        switch (options.cipher.type) {
            case cipherType_1.CipherType.Login:
                fillScript = this.generateLoginFillScript(fillScript, pageDetails, filledFields, options);
                break;
            case cipherType_1.CipherType.Card:
                fillScript = this.generateCardFillScript(fillScript, pageDetails, filledFields, options);
                break;
            case cipherType_1.CipherType.Identity:
                fillScript = this.generateIdentityFillScript(fillScript, pageDetails, filledFields, options);
                break;
            default:
                return null;
        }
        return fillScript;
    }
    generateLoginFillScript(fillScript, pageDetails, filledFields, options) {
        if (!options.cipher.login) {
            return null;
        }
        const passwords = [];
        const usernames = [];
        let pf = null;
        let username = null;
        const login = options.cipher.login;
        if (!login.password || login.password === "") {
            // No password for this login. Maybe they just wanted to auto-fill some custom fields?
            fillScript = AutofillService.setFillScriptForFocus(filledFields, fillScript);
            return fillScript;
        }
        let passwordFields = AutofillService.loadPasswordFields(pageDetails, false, false, options.onlyEmptyFields, options.fillNewPassword);
        if (!passwordFields.length && !options.onlyVisibleFields) {
            // not able to find any viewable password fields. maybe there are some "hidden" ones?
            passwordFields = AutofillService.loadPasswordFields(pageDetails, true, true, options.onlyEmptyFields, options.fillNewPassword);
        }
        for (const formKey in pageDetails.forms) {
            // eslint-disable-next-line
            if (!pageDetails.forms.hasOwnProperty(formKey)) {
                continue;
            }
            const passwordFieldsForForm = [];
            passwordFields.forEach((passField) => {
                if (formKey === passField.form) {
                    passwordFieldsForForm.push(passField);
                }
            });
            passwordFields.forEach((passField) => {
                pf = passField;
                passwords.push(pf);
                if (login.username) {
                    username = this.findUsernameField(pageDetails, pf, false, false, false);
                    if (!username && !options.onlyVisibleFields) {
                        // not able to find any viewable username fields. maybe there are some "hidden" ones?
                        username = this.findUsernameField(pageDetails, pf, true, true, false);
                    }
                    if (username) {
                        usernames.push(username);
                    }
                }
            });
        }
        if (passwordFields.length && !passwords.length) {
            // The page does not have any forms with password fields. Use the first password field on the page and the
            // input field just before it as the username.
            pf = passwordFields[0];
            passwords.push(pf);
            if (login.username && pf.elementNumber > 0) {
                username = this.findUsernameField(pageDetails, pf, false, false, true);
                if (!username && !options.onlyVisibleFields) {
                    // not able to find any viewable username fields. maybe there are some "hidden" ones?
                    username = this.findUsernameField(pageDetails, pf, true, true, true);
                }
                if (username) {
                    usernames.push(username);
                }
            }
        }
        if (!passwordFields.length && !options.skipUsernameOnlyFill) {
            // No password fields on this page. Let's try to just fuzzy fill the username.
            pageDetails.fields.forEach((f) => {
                if (f.viewable &&
                    (f.type === "text" || f.type === "email" || f.type === "tel") &&
                    AutofillService.fieldIsFuzzyMatch(f, autofillConstants_1.AutoFillConstants.UsernameFieldNames)) {
                    usernames.push(f);
                }
            });
        }
        usernames.forEach((u) => {
            // eslint-disable-next-line
            if (filledFields.hasOwnProperty(u.opid)) {
                return;
            }
            filledFields[u.opid] = u;
            AutofillService.fillByOpid(fillScript, u, login.username);
        });
        passwords.forEach((p) => {
            // eslint-disable-next-line
            if (filledFields.hasOwnProperty(p.opid)) {
                return;
            }
            filledFields[p.opid] = p;
            AutofillService.fillByOpid(fillScript, p, login.password);
        });
        fillScript = AutofillService.setFillScriptForFocus(filledFields, fillScript);
        return fillScript;
    }
    generateCardFillScript(fillScript, pageDetails, filledFields, options) {
        if (!options.cipher.card) {
            return null;
        }
        const fillFields = {};
        pageDetails.fields.forEach((f) => {
            if (AutofillService.forCustomFieldsOnly(f)) {
                return;
            }
            if (this.isExcludedType(f.type, autofillConstants_1.AutoFillConstants.ExcludedAutofillTypes)) {
                return;
            }
            for (let i = 0; i < autofillConstants_1.CreditCardAutoFillConstants.CardAttributes.length; i++) {
                const attr = autofillConstants_1.CreditCardAutoFillConstants.CardAttributes[i];
                // eslint-disable-next-line
                if (!f.hasOwnProperty(attr) || !f[attr] || !f.viewable) {
                    continue;
                }
                // ref https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
                // ref https://developers.google.com/web/fundamentals/design-and-ux/input/forms/
                if (!fillFields.cardholderName &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.CardHolderFieldNames, autofillConstants_1.CreditCardAutoFillConstants.CardHolderFieldNameValues)) {
                    fillFields.cardholderName = f;
                    break;
                }
                else if (!fillFields.number &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.CardNumberFieldNames, autofillConstants_1.CreditCardAutoFillConstants.CardNumberFieldNameValues)) {
                    fillFields.number = f;
                    break;
                }
                else if (!fillFields.exp &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.CardExpiryFieldNames, autofillConstants_1.CreditCardAutoFillConstants.CardExpiryFieldNameValues)) {
                    fillFields.exp = f;
                    break;
                }
                else if (!fillFields.expMonth &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.ExpiryMonthFieldNames)) {
                    fillFields.expMonth = f;
                    break;
                }
                else if (!fillFields.expYear &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.ExpiryYearFieldNames)) {
                    fillFields.expYear = f;
                    break;
                }
                else if (!fillFields.code &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.CVVFieldNames)) {
                    fillFields.code = f;
                    break;
                }
                else if (!fillFields.brand &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.CreditCardAutoFillConstants.CardBrandFieldNames)) {
                    fillFields.brand = f;
                    break;
                }
            }
        });
        const card = options.cipher.card;
        this.makeScriptAction(fillScript, card, fillFields, filledFields, "cardholderName");
        this.makeScriptAction(fillScript, card, fillFields, filledFields, "number");
        this.makeScriptAction(fillScript, card, fillFields, filledFields, "code");
        this.makeScriptAction(fillScript, card, fillFields, filledFields, "brand");
        if (fillFields.expMonth && AutofillService.hasValue(card.expMonth)) {
            let expMonth = card.expMonth;
            if (fillFields.expMonth.selectInfo && fillFields.expMonth.selectInfo.options) {
                let index = null;
                const siOptions = fillFields.expMonth.selectInfo.options;
                if (siOptions.length === 12) {
                    index = parseInt(card.expMonth, null) - 1;
                }
                else if (siOptions.length === 13) {
                    if (siOptions[0][0] != null &&
                        siOptions[0][0] !== "" &&
                        (siOptions[12][0] == null || siOptions[12][0] === "")) {
                        index = parseInt(card.expMonth, null) - 1;
                    }
                    else {
                        index = parseInt(card.expMonth, null);
                    }
                }
                if (index != null) {
                    const option = siOptions[index];
                    if (option.length > 1) {
                        expMonth = option[1];
                    }
                }
            }
            else if ((this.fieldAttrsContain(fillFields.expMonth, "mm") ||
                fillFields.expMonth.maxLength === 2) &&
                expMonth.length === 1) {
                expMonth = "0" + expMonth;
            }
            filledFields[fillFields.expMonth.opid] = fillFields.expMonth;
            AutofillService.fillByOpid(fillScript, fillFields.expMonth, expMonth);
        }
        if (fillFields.expYear && AutofillService.hasValue(card.expYear)) {
            let expYear = card.expYear;
            if (fillFields.expYear.selectInfo && fillFields.expYear.selectInfo.options) {
                for (let i = 0; i < fillFields.expYear.selectInfo.options.length; i++) {
                    const o = fillFields.expYear.selectInfo.options[i];
                    if (o[0] === card.expYear || o[1] === card.expYear) {
                        expYear = o[1];
                        break;
                    }
                    if (o[1].length === 2 &&
                        card.expYear.length === 4 &&
                        o[1] === card.expYear.substring(2)) {
                        expYear = o[1];
                        break;
                    }
                    const colonIndex = o[1].indexOf(":");
                    if (colonIndex > -1 && o[1].length > colonIndex + 1) {
                        const val = o[1].substring(colonIndex + 2);
                        if (val != null && val.trim() !== "" && val === card.expYear) {
                            expYear = o[1];
                            break;
                        }
                    }
                }
            }
            else if (this.fieldAttrsContain(fillFields.expYear, "yyyy") ||
                fillFields.expYear.maxLength === 4) {
                if (expYear.length === 2) {
                    expYear = "20" + expYear;
                }
            }
            else if (this.fieldAttrsContain(fillFields.expYear, "yy") ||
                fillFields.expYear.maxLength === 2) {
                if (expYear.length === 4) {
                    expYear = expYear.substr(2);
                }
            }
            filledFields[fillFields.expYear.opid] = fillFields.expYear;
            AutofillService.fillByOpid(fillScript, fillFields.expYear, expYear);
        }
        if (fillFields.exp &&
            AutofillService.hasValue(card.expMonth) &&
            AutofillService.hasValue(card.expYear)) {
            const fullMonth = ("0" + card.expMonth).slice(-2);
            let fullYear = card.expYear;
            let partYear = null;
            if (fullYear.length === 2) {
                partYear = fullYear;
                fullYear = "20" + fullYear;
            }
            else if (fullYear.length === 4) {
                partYear = fullYear.substr(2, 2);
            }
            let exp = null;
            for (let i = 0; i < autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr.length; i++) {
                if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i] +
                    "/" +
                    autofillConstants_1.CreditCardAutoFillConstants.YearAbbrShort[i]) &&
                    partYear != null) {
                    exp = fullMonth + "/" + partYear;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i] +
                    "/" +
                    autofillConstants_1.CreditCardAutoFillConstants.YearAbbrLong[i])) {
                    exp = fullMonth + "/" + fullYear;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.YearAbbrShort[i] +
                    "/" +
                    autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i]) &&
                    partYear != null) {
                    exp = partYear + "/" + fullMonth;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.YearAbbrLong[i] +
                    "/" +
                    autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i])) {
                    exp = fullYear + "/" + fullMonth;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i] +
                    "-" +
                    autofillConstants_1.CreditCardAutoFillConstants.YearAbbrShort[i]) &&
                    partYear != null) {
                    exp = fullMonth + "-" + partYear;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i] +
                    "-" +
                    autofillConstants_1.CreditCardAutoFillConstants.YearAbbrLong[i])) {
                    exp = fullMonth + "-" + fullYear;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.YearAbbrShort[i] +
                    "-" +
                    autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i]) &&
                    partYear != null) {
                    exp = partYear + "-" + fullMonth;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.YearAbbrLong[i] +
                    "-" +
                    autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i])) {
                    exp = fullYear + "-" + fullMonth;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.YearAbbrShort[i] + autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i]) &&
                    partYear != null) {
                    exp = partYear + fullMonth;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.YearAbbrLong[i] + autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i])) {
                    exp = fullYear + fullMonth;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i] + autofillConstants_1.CreditCardAutoFillConstants.YearAbbrShort[i]) &&
                    partYear != null) {
                    exp = fullMonth + partYear;
                }
                else if (this.fieldAttrsContain(fillFields.exp, autofillConstants_1.CreditCardAutoFillConstants.MonthAbbr[i] + autofillConstants_1.CreditCardAutoFillConstants.YearAbbrLong[i])) {
                    exp = fullMonth + fullYear;
                }
                if (exp != null) {
                    break;
                }
            }
            if (exp == null) {
                exp = fullYear + "-" + fullMonth;
            }
            this.makeScriptActionWithValue(fillScript, exp, fillFields.exp, filledFields);
        }
        return fillScript;
    }
    fieldAttrsContain(field, containsVal) {
        if (!field) {
            return false;
        }
        let doesContain = false;
        autofillConstants_1.CreditCardAutoFillConstants.CardAttributesExtended.forEach((attr) => {
            // eslint-disable-next-line
            if (doesContain || !field.hasOwnProperty(attr) || !field[attr]) {
                return;
            }
            let val = field[attr];
            val = val.replace(/ /g, "").toLowerCase();
            doesContain = val.indexOf(containsVal) > -1;
        });
        return doesContain;
    }
    generateIdentityFillScript(fillScript, pageDetails, filledFields, options) {
        if (!options.cipher.identity) {
            return null;
        }
        const fillFields = {};
        pageDetails.fields.forEach((f) => {
            if (AutofillService.forCustomFieldsOnly(f)) {
                return;
            }
            if (this.isExcludedType(f.type, autofillConstants_1.AutoFillConstants.ExcludedAutofillTypes)) {
                return;
            }
            for (let i = 0; i < autofillConstants_1.IdentityAutoFillConstants.IdentityAttributes.length; i++) {
                const attr = autofillConstants_1.IdentityAutoFillConstants.IdentityAttributes[i];
                // eslint-disable-next-line
                if (!f.hasOwnProperty(attr) || !f[attr] || !f.viewable) {
                    continue;
                }
                // ref https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
                // ref https://developers.google.com/web/fundamentals/design-and-ux/input/forms/
                if (!fillFields.name &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.FullNameFieldNames, autofillConstants_1.IdentityAutoFillConstants.FullNameFieldNameValues)) {
                    fillFields.name = f;
                    break;
                }
                else if (!fillFields.firstName &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.FirstnameFieldNames)) {
                    fillFields.firstName = f;
                    break;
                }
                else if (!fillFields.middleName &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.MiddlenameFieldNames)) {
                    fillFields.middleName = f;
                    break;
                }
                else if (!fillFields.lastName &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.LastnameFieldNames)) {
                    fillFields.lastName = f;
                    break;
                }
                else if (!fillFields.title &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.TitleFieldNames)) {
                    fillFields.title = f;
                    break;
                }
                else if (!fillFields.email &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.EmailFieldNames)) {
                    fillFields.email = f;
                    break;
                }
                else if (!fillFields.address &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.AddressFieldNames, autofillConstants_1.IdentityAutoFillConstants.AddressFieldNameValues)) {
                    fillFields.address = f;
                    break;
                }
                else if (!fillFields.address1 &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.Address1FieldNames)) {
                    fillFields.address1 = f;
                    break;
                }
                else if (!fillFields.address2 &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.Address2FieldNames)) {
                    fillFields.address2 = f;
                    break;
                }
                else if (!fillFields.address3 &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.Address3FieldNames)) {
                    fillFields.address3 = f;
                    break;
                }
                else if (!fillFields.postalCode &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.PostalCodeFieldNames)) {
                    fillFields.postalCode = f;
                    break;
                }
                else if (!fillFields.city &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.CityFieldNames)) {
                    fillFields.city = f;
                    break;
                }
                else if (!fillFields.state &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.StateFieldNames)) {
                    fillFields.state = f;
                    break;
                }
                else if (!fillFields.country &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.CountryFieldNames)) {
                    fillFields.country = f;
                    break;
                }
                else if (!fillFields.phone &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.PhoneFieldNames)) {
                    fillFields.phone = f;
                    break;
                }
                else if (!fillFields.username &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.UserNameFieldNames)) {
                    fillFields.username = f;
                    break;
                }
                else if (!fillFields.company &&
                    AutofillService.isFieldMatch(f[attr], autofillConstants_1.IdentityAutoFillConstants.CompanyFieldNames)) {
                    fillFields.company = f;
                    break;
                }
            }
        });
        const identity = options.cipher.identity;
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "title");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "firstName");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "middleName");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "lastName");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "address1");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "address2");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "address3");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "city");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "postalCode");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "company");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "email");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "phone");
        this.makeScriptAction(fillScript, identity, fillFields, filledFields, "username");
        let filledState = false;
        if (fillFields.state && identity.state && identity.state.length > 2) {
            const stateLower = identity.state.toLowerCase();
            const isoState = autofillConstants_1.IdentityAutoFillConstants.IsoStates[stateLower] ||
                autofillConstants_1.IdentityAutoFillConstants.IsoProvinces[stateLower];
            if (isoState) {
                filledState = true;
                this.makeScriptActionWithValue(fillScript, isoState, fillFields.state, filledFields);
            }
        }
        if (!filledState) {
            this.makeScriptAction(fillScript, identity, fillFields, filledFields, "state");
        }
        let filledCountry = false;
        if (fillFields.country && identity.country && identity.country.length > 2) {
            const countryLower = identity.country.toLowerCase();
            const isoCountry = autofillConstants_1.IdentityAutoFillConstants.IsoCountries[countryLower];
            if (isoCountry) {
                filledCountry = true;
                this.makeScriptActionWithValue(fillScript, isoCountry, fillFields.country, filledFields);
            }
        }
        if (!filledCountry) {
            this.makeScriptAction(fillScript, identity, fillFields, filledFields, "country");
        }
        if (fillFields.name && (identity.firstName || identity.lastName)) {
            let fullName = "";
            if (AutofillService.hasValue(identity.firstName)) {
                fullName = identity.firstName;
            }
            if (AutofillService.hasValue(identity.middleName)) {
                if (fullName !== "") {
                    fullName += " ";
                }
                fullName += identity.middleName;
            }
            if (AutofillService.hasValue(identity.lastName)) {
                if (fullName !== "") {
                    fullName += " ";
                }
                fullName += identity.lastName;
            }
            this.makeScriptActionWithValue(fillScript, fullName, fillFields.name, filledFields);
        }
        if (fillFields.address && AutofillService.hasValue(identity.address1)) {
            let address = "";
            if (AutofillService.hasValue(identity.address1)) {
                address = identity.address1;
            }
            if (AutofillService.hasValue(identity.address2)) {
                if (address !== "") {
                    address += ", ";
                }
                address += identity.address2;
            }
            if (AutofillService.hasValue(identity.address3)) {
                if (address !== "") {
                    address += ", ";
                }
                address += identity.address3;
            }
            this.makeScriptActionWithValue(fillScript, address, fillFields.address, filledFields);
        }
        return fillScript;
    }
    isExcludedType(type, excludedTypes) {
        return excludedTypes.indexOf(type) > -1;
    }
    static isFieldMatch(value, options, containsOptions) {
        value = value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, "");
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            const checkValueContains = containsOptions == null || containsOptions.indexOf(option) > -1;
            option = option.toLowerCase().replace(/-/g, "");
            if (value === option || (checkValueContains && value.indexOf(option) > -1)) {
                return true;
            }
        }
        return false;
    }
    makeScriptAction(fillScript, cipherData, fillFields, filledFields, dataProp, fieldProp) {
        fieldProp = fieldProp || dataProp;
        this.makeScriptActionWithValue(fillScript, cipherData[dataProp], fillFields[fieldProp], filledFields);
    }
    makeScriptActionWithValue(fillScript, dataValue, field, filledFields) {
        let doFill = false;
        if (AutofillService.hasValue(dataValue) && field) {
            if (field.type === "select-one" && field.selectInfo && field.selectInfo.options) {
                for (let i = 0; i < field.selectInfo.options.length; i++) {
                    const option = field.selectInfo.options[i];
                    for (let j = 0; j < option.length; j++) {
                        if (AutofillService.hasValue(option[j]) &&
                            option[j].toLowerCase() === dataValue.toLowerCase()) {
                            doFill = true;
                            if (option.length > 1) {
                                dataValue = option[1];
                            }
                            break;
                        }
                    }
                    if (doFill) {
                        break;
                    }
                }
            }
            else {
                doFill = true;
            }
        }
        if (doFill) {
            filledFields[field.opid] = field;
            AutofillService.fillByOpid(fillScript, field, dataValue);
        }
    }
    static loadPasswordFields(pageDetails, canBeHidden, canBeReadOnly, mustBeEmpty, fillNewPassword) {
        const arr = [];
        pageDetails.fields.forEach((f) => {
            if (AutofillService.forCustomFieldsOnly(f)) {
                return;
            }
            const isPassword = f.type === "password";
            const valueIsLikePassword = (value) => {
                if (value == null) {
                    return false;
                }
                // Removes all whitespace, _ and - characters
                // eslint-disable-next-line
                const cleanedValue = value.toLowerCase().replace(/[\s_\-]/g, "");
                if (cleanedValue.indexOf("password") < 0) {
                    return false;
                }
                if (autofillConstants_1.AutoFillConstants.PasswordFieldIgnoreList.some((i) => cleanedValue.indexOf(i) > -1)) {
                    return false;
                }
                return true;
            };
            const isLikePassword = () => {
                if (f.type !== "text") {
                    return false;
                }
                if (valueIsLikePassword(f.htmlID)) {
                    return true;
                }
                if (valueIsLikePassword(f.htmlName)) {
                    return true;
                }
                if (valueIsLikePassword(f.placeholder)) {
                    return true;
                }
                return false;
            };
            if (!f.disabled &&
                (canBeReadOnly || !f.readonly) &&
                (isPassword || isLikePassword()) &&
                (canBeHidden || f.viewable) &&
                (!mustBeEmpty || f.value == null || f.value.trim() === "") &&
                (fillNewPassword || f.autoCompleteType !== "new-password")) {
                arr.push(f);
            }
        });
        return arr;
    }
    findUsernameField(pageDetails, passwordField, canBeHidden, canBeReadOnly, withoutForm) {
        let usernameField = null;
        for (let i = 0; i < pageDetails.fields.length; i++) {
            const f = pageDetails.fields[i];
            if (AutofillService.forCustomFieldsOnly(f)) {
                continue;
            }
            if (f.elementNumber >= passwordField.elementNumber) {
                break;
            }
            if (!f.disabled &&
                (canBeReadOnly || !f.readonly) &&
                (withoutForm || f.form === passwordField.form) &&
                (canBeHidden || f.viewable) &&
                (f.type === "text" || f.type === "email" || f.type === "tel")) {
                usernameField = f;
                if (this.findMatchingFieldIndex(f, autofillConstants_1.AutoFillConstants.UsernameFieldNames) > -1) {
                    // We found an exact match. No need to keep looking.
                    break;
                }
            }
        }
        return usernameField;
    }
    findMatchingFieldIndex(field, names) {
        for (let i = 0; i < names.length; i++) {
            if (names[i].indexOf("=") > -1) {
                if (this.fieldPropertyIsPrefixMatch(field, "htmlID", names[i], "id")) {
                    return i;
                }
                if (this.fieldPropertyIsPrefixMatch(field, "htmlName", names[i], "name")) {
                    return i;
                }
                if (this.fieldPropertyIsPrefixMatch(field, "label-tag", names[i], "label")) {
                    return i;
                }
                if (this.fieldPropertyIsPrefixMatch(field, "label-aria", names[i], "label")) {
                    return i;
                }
                if (this.fieldPropertyIsPrefixMatch(field, "placeholder", names[i], "placeholder")) {
                    return i;
                }
            }
            if (this.fieldPropertyIsMatch(field, "htmlID", names[i])) {
                return i;
            }
            if (this.fieldPropertyIsMatch(field, "htmlName", names[i])) {
                return i;
            }
            if (this.fieldPropertyIsMatch(field, "label-tag", names[i])) {
                return i;
            }
            if (this.fieldPropertyIsMatch(field, "label-aria", names[i])) {
                return i;
            }
            if (this.fieldPropertyIsMatch(field, "placeholder", names[i])) {
                return i;
            }
        }
        return -1;
    }
    fieldPropertyIsPrefixMatch(field, property, name, prefix, separator = "=") {
        if (name.indexOf(prefix + separator) === 0) {
            const sepIndex = name.indexOf(separator);
            const val = name.substring(sepIndex + 1);
            return val != null && this.fieldPropertyIsMatch(field, property, val);
        }
        return false;
    }
    fieldPropertyIsMatch(field, property, name) {
        let fieldVal = field[property];
        if (!AutofillService.hasValue(fieldVal)) {
            return false;
        }
        fieldVal = fieldVal.trim().replace(/(?:\r\n|\r|\n)/g, "");
        if (name.startsWith("regex=")) {
            try {
                const regexParts = name.split("=", 2);
                if (regexParts.length === 2) {
                    const regex = new RegExp(regexParts[1], "i");
                    return regex.test(fieldVal);
                }
            }
            catch (e) {
                //this.logService.error(e);
            }
        }
        else if (name.startsWith("csv=")) {
            const csvParts = name.split("=", 2);
            if (csvParts.length === 2) {
                const csvVals = csvParts[1].split(",");
                for (let i = 0; i < csvVals.length; i++) {
                    const val = csvVals[i];
                    if (val != null && val.trim().toLowerCase() === fieldVal.toLowerCase()) {
                        return true;
                    }
                }
                return false;
            }
        }
        return fieldVal.toLowerCase() === name;
    }
    static fieldIsFuzzyMatch(field, names) {
        if (AutofillService.hasValue(field.htmlID) && this.fuzzyMatch(names, field.htmlID)) {
            return true;
        }
        if (AutofillService.hasValue(field.htmlName) && this.fuzzyMatch(names, field.htmlName)) {
            return true;
        }
        if (AutofillService.hasValue(field["label-tag"]) &&
            this.fuzzyMatch(names, field["label-tag"])) {
            return true;
        }
        if (AutofillService.hasValue(field.placeholder) && this.fuzzyMatch(names, field.placeholder)) {
            return true;
        }
        if (AutofillService.hasValue(field["label-left"]) &&
            this.fuzzyMatch(names, field["label-left"])) {
            return true;
        }
        if (AutofillService.hasValue(field["label-top"]) &&
            this.fuzzyMatch(names, field["label-top"])) {
            return true;
        }
        if (AutofillService.hasValue(field["label-aria"]) &&
            this.fuzzyMatch(names, field["label-aria"])) {
            return true;
        }
        return false;
    }
    static fuzzyMatch(options, value) {
        if (options == null || options.length === 0 || value == null || value === "") {
            return false;
        }
        value = value
            .replace(/(?:\r\n|\r|\n)/g, "")
            .trim()
            .toLowerCase();
        for (let i = 0; i < options.length; i++) {
            if (value.indexOf(options[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    static hasValue(str) {
        return str && str !== "";
    }
    static setFillScriptForFocus(filledFields, fillScript) {
        let lastField = null;
        let lastPasswordField = null;
        for (const opid in filledFields) {
            // eslint-disable-next-line
            if (filledFields.hasOwnProperty(opid) && filledFields[opid].viewable) {
                lastField = filledFields[opid];
                if (filledFields[opid].type === "password") {
                    lastPasswordField = filledFields[opid];
                }
            }
        }
        // Prioritize password field over others.
        if (lastPasswordField) {
            fillScript.script.push(["focus_by_opid", lastPasswordField.opid]);
        }
        else if (lastField) {
            fillScript.script.push(["focus_by_opid", lastField.opid]);
        }
        return fillScript;
    }
    static fillByOpid(fillScript, field, value) {
        if (field.maxLength && value && value.length > field.maxLength) {
            value = value.substr(0, value.length);
        }
        if (field.tagName !== "span") {
            fillScript.script.push(["click_on_opid", field.opid]);
            fillScript.script.push(["focus_by_opid", field.opid]);
        }
        fillScript.script.push(["fill_by_opid", field.opid, value]);
    }
    static forCustomFieldsOnly(field) {
        return field.tagName === "span";
    }
}
exports.default = AutofillService;
//# sourceMappingURL=autofill.service.js.map