"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const cardData_1 = require("../data/cardData");
const cardView_1 = require("../view/cardView");
const domainBase_1 = require("./domainBase");
class Card extends domainBase_1.default {
    cardholderName;
    brand;
    number;
    expMonth;
    expYear;
    code;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new cardView_1.CardView(), {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, orgId, encKey);
    }
    toCardData() {
        const c = new cardData_1.CardData();
        this.buildDataModel(this, c, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        });
        return c;
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map