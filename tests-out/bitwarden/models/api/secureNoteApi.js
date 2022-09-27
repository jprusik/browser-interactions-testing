"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNoteApi = void 0;
const baseResponse_1 = require("../response/baseResponse");
class SecureNoteApi extends baseResponse_1.BaseResponse {
    type;
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.type = this.getResponseProperty("Type");
    }
}
exports.SecureNoteApi = SecureNoteApi;
//# sourceMappingURL=secureNoteApi.js.map