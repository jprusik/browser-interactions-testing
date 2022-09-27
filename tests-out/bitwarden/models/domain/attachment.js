"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const utils_1 = require("../../misc/utils");
const attachmentData_1 = require("../data/attachmentData");
const attachmentView_1 = require("../view/attachmentView");
const domainBase_1 = require("./domainBase");
const symmetricCryptoKey_1 = require("./symmetricCryptoKey");
class Attachment extends domainBase_1.default {
    id;
    url;
    size;
    sizeName; // Readable size, ex: "4.2 KB" or "1.43 GB"
    key;
    fileName;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.size = obj.size;
        this.buildDomainModel(this, obj, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
            key: null,
        }, ["id", "url", "sizeName"]);
    }
    async decrypt(orgId, encKey) {
        const view = await this.decryptObj(new attachmentView_1.AttachmentView(this), {
            fileName: null,
        }, orgId, encKey);
        if (this.key != null) {
            view.key = await this.decryptAttachmentKey(orgId, encKey);
        }
        return view;
    }
    async decryptAttachmentKey(orgId, encKey) {
        try {
            if (encKey == null) {
                encKey = await this.getKeyForDecryption(orgId);
            }
            const encryptService = utils_1.Utils.getContainerService().getEncryptService();
            const decValue = await encryptService.decryptToBytes(this.key, encKey);
            return new symmetricCryptoKey_1.SymmetricCryptoKey(decValue);
        }
        catch (e) {
            // TODO: error?
        }
    }
    async getKeyForDecryption(orgId) {
        const cryptoService = utils_1.Utils.getContainerService().getCryptoService();
        return orgId != null
            ? await cryptoService.getOrgKey(orgId)
            : await cryptoService.getKeyForUserEncryption();
    }
    toAttachmentData() {
        const a = new attachmentData_1.AttachmentData();
        a.size = this.size;
        this.buildDataModel(this, a, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
            key: null,
        }, ["id", "url", "sizeName"]);
        return a;
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map