"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cipher = void 0;
const cipherType_1 = require("../../enums/cipherType");
const cipherData_1 = require("../data/cipherData");
const cipherView_1 = require("../view/cipherView");
const attachment_1 = require("./attachment");
const card_1 = require("./card");
const domainBase_1 = require("./domainBase");
const field_1 = require("./field");
const identity_1 = require("./identity");
const login_1 = require("./login");
const password_1 = require("./password");
const secureNote_1 = require("./secureNote");
class Cipher extends domainBase_1.default {
    id;
    organizationId;
    folderId;
    name;
    notes;
    type;
    favorite;
    organizationUseTotp;
    edit;
    viewPassword;
    revisionDate;
    localData;
    login;
    identity;
    card;
    secureNote;
    attachments;
    fields;
    passwordHistory;
    collectionIds;
    deletedDate;
    reprompt;
    constructor(obj, localData = null) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            organizationId: null,
            folderId: null,
            name: null,
            notes: null,
        }, ["id", "organizationId", "folderId"]);
        this.type = obj.type;
        this.favorite = obj.favorite;
        this.organizationUseTotp = obj.organizationUseTotp;
        this.edit = obj.edit;
        if (obj.viewPassword != null) {
            this.viewPassword = obj.viewPassword;
        }
        else {
            this.viewPassword = true; // Default for already synced Ciphers without viewPassword
        }
        this.revisionDate = obj.revisionDate != null ? new Date(obj.revisionDate) : null;
        this.collectionIds = obj.collectionIds;
        this.localData = localData;
        this.deletedDate = obj.deletedDate != null ? new Date(obj.deletedDate) : null;
        this.reprompt = obj.reprompt;
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                this.login = new login_1.Login(obj.login);
                break;
            case cipherType_1.CipherType.SecureNote:
                this.secureNote = new secureNote_1.SecureNote(obj.secureNote);
                break;
            case cipherType_1.CipherType.Card:
                this.card = new card_1.Card(obj.card);
                break;
            case cipherType_1.CipherType.Identity:
                this.identity = new identity_1.Identity(obj.identity);
                break;
            default:
                break;
        }
        if (obj.attachments != null) {
            this.attachments = obj.attachments.map((a) => new attachment_1.Attachment(a));
        }
        else {
            this.attachments = null;
        }
        if (obj.fields != null) {
            this.fields = obj.fields.map((f) => new field_1.Field(f));
        }
        else {
            this.fields = null;
        }
        if (obj.passwordHistory != null) {
            this.passwordHistory = obj.passwordHistory.map((ph) => new password_1.Password(ph));
        }
        else {
            this.passwordHistory = null;
        }
    }
    async decrypt(encKey) {
        const model = new cipherView_1.CipherView(this);
        await this.decryptObj(model, {
            name: null,
            notes: null,
        }, this.organizationId, encKey);
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                model.login = await this.login.decrypt(this.organizationId, encKey);
                break;
            case cipherType_1.CipherType.SecureNote:
                model.secureNote = await this.secureNote.decrypt(this.organizationId, encKey);
                break;
            case cipherType_1.CipherType.Card:
                model.card = await this.card.decrypt(this.organizationId, encKey);
                break;
            case cipherType_1.CipherType.Identity:
                model.identity = await this.identity.decrypt(this.organizationId, encKey);
                break;
            default:
                break;
        }
        const orgId = this.organizationId;
        if (this.attachments != null && this.attachments.length > 0) {
            const attachments = [];
            await this.attachments.reduce((promise, attachment) => {
                return promise
                    .then(() => {
                    return attachment.decrypt(orgId, encKey);
                })
                    .then((decAttachment) => {
                    attachments.push(decAttachment);
                });
            }, Promise.resolve());
            model.attachments = attachments;
        }
        if (this.fields != null && this.fields.length > 0) {
            const fields = [];
            await this.fields.reduce((promise, field) => {
                return promise
                    .then(() => {
                    return field.decrypt(orgId, encKey);
                })
                    .then((decField) => {
                    fields.push(decField);
                });
            }, Promise.resolve());
            model.fields = fields;
        }
        if (this.passwordHistory != null && this.passwordHistory.length > 0) {
            const passwordHistory = [];
            await this.passwordHistory.reduce((promise, ph) => {
                return promise
                    .then(() => {
                    return ph.decrypt(orgId, encKey);
                })
                    .then((decPh) => {
                    passwordHistory.push(decPh);
                });
            }, Promise.resolve());
            model.passwordHistory = passwordHistory;
        }
        return model;
    }
    toCipherData() {
        const c = new cipherData_1.CipherData();
        c.id = this.id;
        c.organizationId = this.organizationId;
        c.folderId = this.folderId;
        c.edit = this.edit;
        c.viewPassword = this.viewPassword;
        c.organizationUseTotp = this.organizationUseTotp;
        c.favorite = this.favorite;
        c.revisionDate = this.revisionDate != null ? this.revisionDate.toISOString() : null;
        c.type = this.type;
        c.collectionIds = this.collectionIds;
        c.deletedDate = this.deletedDate != null ? this.deletedDate.toISOString() : null;
        c.reprompt = this.reprompt;
        this.buildDataModel(this, c, {
            name: null,
            notes: null,
        });
        switch (c.type) {
            case cipherType_1.CipherType.Login:
                c.login = this.login.toLoginData();
                break;
            case cipherType_1.CipherType.SecureNote:
                c.secureNote = this.secureNote.toSecureNoteData();
                break;
            case cipherType_1.CipherType.Card:
                c.card = this.card.toCardData();
                break;
            case cipherType_1.CipherType.Identity:
                c.identity = this.identity.toIdentityData();
                break;
            default:
                break;
        }
        if (this.fields != null) {
            c.fields = this.fields.map((f) => f.toFieldData());
        }
        if (this.attachments != null) {
            c.attachments = this.attachments.map((a) => a.toAttachmentData());
        }
        if (this.passwordHistory != null) {
            c.passwordHistory = this.passwordHistory.map((ph) => ph.toPasswordHistoryData());
        }
        return c;
    }
}
exports.Cipher = Cipher;
//# sourceMappingURL=cipher.js.map