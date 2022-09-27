"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardApi = void 0;
const baseResponse_1 = require("../response/baseResponse");
class CardApi extends baseResponse_1.BaseResponse {
    cardholderName;
    brand;
    number;
    expMonth;
    expYear;
    code;
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.cardholderName = this.getResponseProperty("CardholderName");
        this.brand = this.getResponseProperty("Brand");
        this.number = this.getResponseProperty("Number");
        this.expMonth = this.getResponseProperty("ExpMonth");
        this.expYear = this.getResponseProperty("ExpYear");
        this.code = this.getResponseProperty("Code");
    }
}
exports.CardApi = CardApi;
//# sourceMappingURL=cardApi.js.map