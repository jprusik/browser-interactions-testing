"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const passwordHistoryData_1 = require("../data/passwordHistoryData");
const passwordHistoryView_1 = require("../view/passwordHistoryView");
const domainBase_1 = require("./domainBase");
class Password extends domainBase_1.default {
    password;
    lastUsedDate;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            password: null,
        });
        this.lastUsedDate = new Date(obj.lastUsedDate);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new passwordHistoryView_1.PasswordHistoryView(this), {
            password: null,
        }, orgId, encKey);
    }
    toPasswordHistoryData() {
        const ph = new passwordHistoryData_1.PasswordHistoryData();
        ph.lastUsedDate = this.lastUsedDate.toISOString();
        this.buildDataModel(this, ph, {
            password: null,
        });
        return ph;
    }
}
exports.Password = Password;
//# sourceMappingURL=password.js.map