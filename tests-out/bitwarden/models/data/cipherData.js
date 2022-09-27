"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherData = void 0;
const cipherType_1 = require("../../enums/cipherType");
const attachmentData_1 = require("./attachmentData");
const cardData_1 = require("./cardData");
const fieldData_1 = require("./fieldData");
const identityData_1 = require("./identityData");
const loginData_1 = require("./loginData");
const passwordHistoryData_1 = require("./passwordHistoryData");
const secureNoteData_1 = require("./secureNoteData");
class CipherData {
    id;
    organizationId;
    folderId;
    edit;
    viewPassword;
    organizationUseTotp;
    favorite;
    revisionDate;
    type;
    name;
    notes;
    login;
    secureNote;
    card;
    identity;
    fields;
    attachments;
    passwordHistory;
    collectionIds;
    deletedDate;
    reprompt;
    constructor(response, collectionIds) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.folderId = response.folderId;
        this.edit = response.edit;
        this.viewPassword = response.viewPassword;
        this.organizationUseTotp = response.organizationUseTotp;
        this.favorite = response.favorite;
        this.revisionDate = response.revisionDate;
        this.type = response.type;
        this.name = response.name;
        this.notes = response.notes;
        this.collectionIds = collectionIds != null ? collectionIds : response.collectionIds;
        this.deletedDate = response.deletedDate;
        this.reprompt = response.reprompt;
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                this.login = new loginData_1.LoginData(response.login);
                break;
            case cipherType_1.CipherType.SecureNote:
                this.secureNote = new secureNoteData_1.SecureNoteData(response.secureNote);
                break;
            case cipherType_1.CipherType.Card:
                this.card = new cardData_1.CardData(response.card);
                break;
            case cipherType_1.CipherType.Identity:
                this.identity = new identityData_1.IdentityData(response.identity);
                break;
            default:
                break;
        }
        if (response.fields != null) {
            this.fields = response.fields.map((f) => new fieldData_1.FieldData(f));
        }
        if (response.attachments != null) {
            this.attachments = response.attachments.map((a) => new attachmentData_1.AttachmentData(a));
        }
        if (response.passwordHistory != null) {
            this.passwordHistory = response.passwordHistory.map((ph) => new passwordHistoryData_1.PasswordHistoryData(ph));
        }
    }
}
exports.CipherData = CipherData;
//# sourceMappingURL=cipherData.js.map