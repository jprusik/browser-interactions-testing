"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardData = void 0;
class CardData {
    cardholderName;
    brand;
    number;
    expMonth;
    expYear;
    code;
    constructor(data) {
        if (data == null) {
            return;
        }
        this.cardholderName = data.cardholderName;
        this.brand = data.brand;
        this.number = data.number;
        this.expMonth = data.expMonth;
        this.expYear = data.expYear;
        this.code = data.code;
    }
}
exports.CardData = CardData;
//# sourceMappingURL=cardData.js.map