"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriData = void 0;
class LoginUriData {
    uri;
    match = null;
    constructor(data) {
        if (data == null) {
            return;
        }
        this.uri = data.uri;
        this.match = data.match;
    }
}
exports.LoginUriData = LoginUriData;
//# sourceMappingURL=loginUriData.js.map