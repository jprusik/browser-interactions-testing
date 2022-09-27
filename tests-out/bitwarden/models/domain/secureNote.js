"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNote = void 0;
const secureNoteData_1 = require("../data/secureNoteData");
const secureNoteView_1 = require("../view/secureNoteView");
const domainBase_1 = require("./domainBase");
class SecureNote extends domainBase_1.default {
    type;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
    }
    decrypt(orgId, encKey) {
        return Promise.resolve(new secureNoteView_1.SecureNoteView(this));
    }
    toSecureNoteData() {
        const n = new secureNoteData_1.SecureNoteData();
        n.type = this.type;
        return n;
    }
}
exports.SecureNote = SecureNote;
//# sourceMappingURL=secureNote.js.map