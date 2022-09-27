"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUri = void 0;
const loginUriData_1 = require("../data/loginUriData");
const loginUriView_1 = require("../view/loginUriView");
const domainBase_1 = require("./domainBase");
class LoginUri extends domainBase_1.default {
    uri;
    match;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.match = obj.match;
        this.buildDomainModel(this, obj, {
            uri: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new loginUriView_1.LoginUriView(this), {
            uri: null,
        }, orgId, encKey);
    }
    toLoginUriData() {
        const u = new loginUriData_1.LoginUriData();
        this.buildDataModel(this, u, {
            uri: null,
            match: null,
        }, ["match"]);
        return u;
    }
}
exports.LoginUri = LoginUri;
//# sourceMappingURL=loginUri.js.map