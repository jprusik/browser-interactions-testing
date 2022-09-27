"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardView = void 0;
const linkedIdType_1 = require("../../enums/linkedIdType");
const linkedFieldOption_decorator_1 = require("../../misc/linkedFieldOption.decorator");
const itemView_1 = require("./itemView");
class CardView extends itemView_1.ItemView {
    cardholderName = null;
    expMonth = null;
    expYear = null;
    code = null;
    _brand = null;
    _number = null;
    _subTitle = null;
    get maskedCode() {
        return this.code != null ? "•".repeat(this.code.length) : null;
    }
    get maskedNumber() {
        return this.number != null ? "•".repeat(this.number.length) : null;
    }
    get brand() {
        return this._brand;
    }
    set brand(value) {
        this._brand = value;
        this._subTitle = null;
    }
    get number() {
        return this._number;
    }
    set number(value) {
        this._number = value;
        this._subTitle = null;
    }
    get subTitle() {
        if (this._subTitle == null) {
            this._subTitle = this.brand;
            if (this.number != null && this.number.length >= 4) {
                if (this._subTitle != null && this._subTitle !== "") {
                    this._subTitle += ", ";
                }
                else {
                    this._subTitle = "";
                }
                // Show last 5 on amex, last 4 for all others
                const count = this.number.length >= 5 && this.number.match(new RegExp("^3[47]")) != null ? 5 : 4;
                this._subTitle += "*" + this.number.substr(this.number.length - count);
            }
        }
        return this._subTitle;
    }
    get expiration() {
        if (!this.expMonth && !this.expYear) {
            return null;
        }
        let exp = this.expMonth != null ? ("0" + this.expMonth).slice(-2) : "__";
        exp += " / " + (this.expYear != null ? this.formatYear(this.expYear) : "____");
        return exp;
    }
    formatYear(year) {
        return year.length === 2 ? "20" + year : year;
    }
    static fromJSON(obj) {
        return Object.assign(new CardView(), obj);
    }
}
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.CardLinkedId.CardholderName)
], CardView.prototype, "cardholderName", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.CardLinkedId.ExpMonth, "expirationMonth")
], CardView.prototype, "expMonth", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.CardLinkedId.ExpYear, "expirationYear")
], CardView.prototype, "expYear", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.CardLinkedId.Code, "securityCode")
], CardView.prototype, "code", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.CardLinkedId.Brand)
], CardView.prototype, "brand", null);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.CardLinkedId.Number)
], CardView.prototype, "number", null);
exports.CardView = CardView;
//# sourceMappingURL=cardView.js.map