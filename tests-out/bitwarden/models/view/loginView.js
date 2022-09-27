"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginView = void 0;
const linkedIdType_1 = require("../../enums/linkedIdType");
const linkedFieldOption_decorator_1 = require("../../misc/linkedFieldOption.decorator");
const utils_1 = require("../../misc/utils");
const itemView_1 = require("./itemView");
const loginUriView_1 = require("./loginUriView");
class LoginView extends itemView_1.ItemView {
    username = null;
    password = null;
    passwordRevisionDate = null;
    totp = null;
    uris = null;
    autofillOnPageLoad = null;
    constructor(l) {
        super();
        if (!l) {
            return;
        }
        this.passwordRevisionDate = l.passwordRevisionDate;
        this.autofillOnPageLoad = l.autofillOnPageLoad;
    }
    get uri() {
        return this.hasUris ? this.uris[0].uri : null;
    }
    get maskedPassword() {
        return this.password != null ? "••••••••" : null;
    }
    get subTitle() {
        return this.username;
    }
    get canLaunch() {
        return this.hasUris && this.uris.some((u) => u.canLaunch);
    }
    get hasTotp() {
        return !utils_1.Utils.isNullOrWhitespace(this.totp);
    }
    get launchUri() {
        if (this.hasUris) {
            const uri = this.uris.find((u) => u.canLaunch);
            if (uri != null) {
                return uri.launchUri;
            }
        }
        return null;
    }
    get hasUris() {
        return this.uris != null && this.uris.length > 0;
    }
    static fromJSON(obj) {
        const passwordRevisionDate = obj.passwordRevisionDate == null ? null : new Date(obj.passwordRevisionDate);
        const uris = obj.uris?.map((uri) => loginUriView_1.LoginUriView.fromJSON(uri));
        return Object.assign(new LoginView(), obj, {
            passwordRevisionDate: passwordRevisionDate,
            uris: uris,
        });
    }
}
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.LoginLinkedId.Username)
], LoginView.prototype, "username", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.LoginLinkedId.Password)
], LoginView.prototype, "password", void 0);
exports.LoginView = LoginView;
//# sourceMappingURL=loginView.js.map