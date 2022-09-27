"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginApi = void 0;
const baseResponse_1 = require("../response/baseResponse");
const loginUriApi_1 = require("./loginUriApi");
class LoginApi extends baseResponse_1.BaseResponse {
    uris;
    username;
    password;
    passwordRevisionDate;
    totp;
    autofillOnPageLoad;
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.username = this.getResponseProperty("Username");
        this.password = this.getResponseProperty("Password");
        this.passwordRevisionDate = this.getResponseProperty("PasswordRevisionDate");
        this.totp = this.getResponseProperty("Totp");
        this.autofillOnPageLoad = this.getResponseProperty("AutofillOnPageLoad");
        const uris = this.getResponseProperty("Uris");
        if (uris != null) {
            this.uris = uris.map((u) => new loginUriApi_1.LoginUriApi(u));
        }
    }
}
exports.LoginApi = LoginApi;
//# sourceMappingURL=loginApi.js.map