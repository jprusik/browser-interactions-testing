"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHistoryResponse = void 0;
const baseResponse_1 = require("./baseResponse");
class PasswordHistoryResponse extends baseResponse_1.BaseResponse {
    password;
    lastUsedDate;
    constructor(response) {
        super(response);
        this.password = this.getResponseProperty("Password");
        this.lastUsedDate = this.getResponseProperty("LastUsedDate");
    }
}
exports.PasswordHistoryResponse = PasswordHistoryResponse;
//# sourceMappingURL=passwordHistoryResponse.js.map