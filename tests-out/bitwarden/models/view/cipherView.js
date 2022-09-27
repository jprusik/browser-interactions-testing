"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherView = void 0;
const cipherRepromptType_1 = require("../../enums/cipherRepromptType");
const cipherType_1 = require("../../enums/cipherType");
const attachmentView_1 = require("./attachmentView");
const cardView_1 = require("./cardView");
const fieldView_1 = require("./fieldView");
const identityView_1 = require("./identityView");
const loginView_1 = require("./loginView");
const passwordHistoryView_1 = require("./passwordHistoryView");
const secureNoteView_1 = require("./secureNoteView");
class CipherView {
    id = null;
    organizationId = null;
    folderId = null;
    name = null;
    notes = null;
    type = null;
    favorite = false;
    organizationUseTotp = false;
    edit = false;
    viewPassword = true;
    localData;
    login = new loginView_1.LoginView();
    identity = new identityView_1.IdentityView();
    card = new cardView_1.CardView();
    secureNote = new secureNoteView_1.SecureNoteView();
    attachments = null;
    fields = null;
    passwordHistory = null;
    collectionIds = null;
    revisionDate = null;
    deletedDate = null;
    reprompt = cipherRepromptType_1.CipherRepromptType.None;
    constructor(c) {
        if (!c) {
            return;
        }
        this.id = c.id;
        this.organizationId = c.organizationId;
        this.folderId = c.folderId;
        this.favorite = c.favorite;
        this.organizationUseTotp = c.organizationUseTotp;
        this.edit = c.edit;
        this.viewPassword = c.viewPassword;
        this.type = c.type;
        this.localData = c.localData;
        this.collectionIds = c.collectionIds;
        this.revisionDate = c.revisionDate;
        this.deletedDate = c.deletedDate;
        // Old locally stored ciphers might have reprompt == null. If so set it to None.
        this.reprompt = c.reprompt ?? cipherRepromptType_1.CipherRepromptType.None;
    }
    get item() {
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                return this.login;
            case cipherType_1.CipherType.SecureNote:
                return this.secureNote;
            case cipherType_1.CipherType.Card:
                return this.card;
            case cipherType_1.CipherType.Identity:
                return this.identity;
            default:
                break;
        }
        return null;
    }
    get subTitle() {
        return this.item.subTitle;
    }
    get hasPasswordHistory() {
        return this.passwordHistory && this.passwordHistory.length > 0;
    }
    get hasAttachments() {
        return this.attachments && this.attachments.length > 0;
    }
    get hasOldAttachments() {
        if (this.hasAttachments) {
            for (let i = 0; i < this.attachments.length; i++) {
                if (this.attachments[i].key == null) {
                    return true;
                }
            }
        }
        return false;
    }
    get hasFields() {
        return this.fields && this.fields.length > 0;
    }
    get passwordRevisionDisplayDate() {
        if (this.type !== cipherType_1.CipherType.Login || this.login == null) {
            return null;
        }
        else if (this.login.password == null || this.login.password === "") {
            return null;
        }
        return this.login.passwordRevisionDate;
    }
    get isDeleted() {
        return this.deletedDate != null;
    }
    get linkedFieldOptions() {
        return this.item.linkedFieldOptions;
    }
    linkedFieldValue(id) {
        const linkedFieldOption = this.linkedFieldOptions?.get(id);
        if (linkedFieldOption == null) {
            return null;
        }
        const item = this.item;
        return this.item[linkedFieldOption.propertyKey];
    }
    linkedFieldI18nKey(id) {
        return this.linkedFieldOptions.get(id)?.i18nKey;
    }
    static fromJSON(obj) {
        const view = new CipherView();
        const revisionDate = obj.revisionDate == null ? null : new Date(obj.revisionDate);
        const deletedDate = obj.deletedDate == null ? null : new Date(obj.deletedDate);
        const attachments = obj.attachments?.map((a) => attachmentView_1.AttachmentView.fromJSON(a));
        const fields = obj.fields?.map((f) => fieldView_1.FieldView.fromJSON(f));
        const passwordHistory = obj.passwordHistory?.map((ph) => passwordHistoryView_1.PasswordHistoryView.fromJSON(ph));
        Object.assign(view, obj, {
            revisionDate: revisionDate,
            deletedDate: deletedDate,
            attachments: attachments,
            fields: fields,
            passwordHistory: passwordHistory,
        });
        switch (obj.type) {
            case cipherType_1.CipherType.Card:
                view.card = cardView_1.CardView.fromJSON(obj.card);
                break;
            case cipherType_1.CipherType.Identity:
                view.identity = identityView_1.IdentityView.fromJSON(obj.identity);
                break;
            case cipherType_1.CipherType.Login:
                view.login = loginView_1.LoginView.fromJSON(obj.login);
                break;
            case cipherType_1.CipherType.SecureNote:
                view.secureNote = secureNoteView_1.SecureNoteView.fromJSON(obj.secureNote);
                break;
            default:
                break;
        }
        return view;
    }
}
exports.CipherView = CipherView;
//# sourceMappingURL=cipherView.js.map