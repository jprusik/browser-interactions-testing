"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldApi = void 0;
const baseResponse_1 = require("../response/baseResponse");
class FieldApi extends baseResponse_1.BaseResponse {
    name;
    value;
    type;
    linkedId;
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.type = this.getResponseProperty("Type");
        this.name = this.getResponseProperty("Name");
        this.value = this.getResponseProperty("Value");
        this.linkedId = this.getResponseProperty("linkedId");
    }
}
exports.FieldApi = FieldApi;
//# sourceMappingURL=fieldApi.js.map