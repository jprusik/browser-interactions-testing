"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentView = void 0;
const symmetricCryptoKey_1 = require("../domain/symmetricCryptoKey");
class AttachmentView {
    id = null;
    url = null;
    size = null;
    sizeName = null;
    fileName = null;
    key = null;
    constructor(a) {
        if (!a) {
            return;
        }
        this.id = a.id;
        this.url = a.url;
        this.size = a.size;
        this.sizeName = a.sizeName;
    }
    get fileSize() {
        try {
            if (this.size != null) {
                return parseInt(this.size, null);
            }
        }
        catch {
            // Invalid file size.
        }
        return 0;
    }
    static fromJSON(obj) {
        const key = obj.key == null ? null : symmetricCryptoKey_1.SymmetricCryptoKey.fromJSON(obj.key);
        return Object.assign(new AttachmentView(), obj, { key: key });
    }
}
exports.AttachmentView = AttachmentView;
//# sourceMappingURL=attachmentView.js.map