"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const loginData_1 = require("../data/loginData");
const loginView_1 = require("../view/loginView");
const domainBase_1 = require("./domainBase");
const loginUri_1 = require("./loginUri");
class Login extends domainBase_1.default {
    uris;
    username;
    password;
    passwordRevisionDate;
    totp;
    autofillOnPageLoad;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.passwordRevisionDate =
            obj.passwordRevisionDate != null ? new Date(obj.passwordRevisionDate) : null;
        this.autofillOnPageLoad = obj.autofillOnPageLoad;
        this.buildDomainModel(this, obj, {
            username: null,
            password: null,
            totp: null,
        }, []);
        if (obj.uris) {
            this.uris = [];
            obj.uris.forEach((u) => {
                this.uris.push(new loginUri_1.LoginUri(u));
            });
        }
    }
    async decrypt(orgId, encKey) {
        const view = await this.decryptObj(new loginView_1.LoginView(this), {
            username: null,
            password: null,
            totp: null,
        }, orgId, encKey);
        if (this.uris != null) {
            view.uris = [];
            for (let i = 0; i < this.uris.length; i++) {
                const uri = await this.uris[i].decrypt(orgId, encKey);
                view.uris.push(uri);
            }
        }
        return view;
    }
    toLoginData() {
        const l = new loginData_1.LoginData();
        l.passwordRevisionDate =
            this.passwordRevisionDate != null ? this.passwordRevisionDate.toISOString() : null;
        l.autofillOnPageLoad = this.autofillOnPageLoad;
        this.buildDataModel(this, l, {
            username: null,
            password: null,
            totp: null,
        });
        if (this.uris != null && this.uris.length > 0) {
            l.uris = [];
            this.uris.forEach((u) => {
                l.uris.push(u.toLoginUriData());
            });
        }
        return l;
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map