"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriApi = void 0;
const baseResponse_1 = require("../response/baseResponse");
class LoginUriApi extends baseResponse_1.BaseResponse {
    uri;
    match = null;
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.uri = this.getResponseProperty("Uri");
        const match = this.getResponseProperty("Match");
        this.match = match != null ? match : null;
    }
}
exports.LoginUriApi = LoginUriApi;
//# sourceMappingURL=loginUriApi.js.map