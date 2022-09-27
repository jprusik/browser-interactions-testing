"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityView = void 0;
const linkedIdType_1 = require("../../enums/linkedIdType");
const linkedFieldOption_decorator_1 = require("../../misc/linkedFieldOption.decorator");
const utils_1 = require("../../misc/utils");
const itemView_1 = require("./itemView");
class IdentityView extends itemView_1.ItemView {
    title = null;
    middleName = null;
    address1 = null;
    address2 = null;
    address3 = null;
    city = null;
    state = null;
    postalCode = null;
    country = null;
    company = null;
    email = null;
    phone = null;
    ssn = null;
    username = null;
    passportNumber = null;
    licenseNumber = null;
    _firstName = null;
    _lastName = null;
    _subTitle = null;
    constructor() {
        super();
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
        this._subTitle = null;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
        this._subTitle = null;
    }
    get subTitle() {
        if (this._subTitle == null && (this.firstName != null || this.lastName != null)) {
            this._subTitle = "";
            if (this.firstName != null) {
                this._subTitle = this.firstName;
            }
            if (this.lastName != null) {
                if (this._subTitle !== "") {
                    this._subTitle += " ";
                }
                this._subTitle += this.lastName;
            }
        }
        return this._subTitle;
    }
    get fullName() {
        if (this.title != null ||
            this.firstName != null ||
            this.middleName != null ||
            this.lastName != null) {
            let name = "";
            if (this.title != null) {
                name += this.title + " ";
            }
            if (this.firstName != null) {
                name += this.firstName + " ";
            }
            if (this.middleName != null) {
                name += this.middleName + " ";
            }
            if (this.lastName != null) {
                name += this.lastName;
            }
            return name.trim();
        }
        return null;
    }
    get fullAddress() {
        let address = this.address1;
        if (!utils_1.Utils.isNullOrWhitespace(this.address2)) {
            if (!utils_1.Utils.isNullOrWhitespace(address)) {
                address += ", ";
            }
            address += this.address2;
        }
        if (!utils_1.Utils.isNullOrWhitespace(this.address3)) {
            if (!utils_1.Utils.isNullOrWhitespace(address)) {
                address += ", ";
            }
            address += this.address3;
        }
        return address;
    }
    get fullAddressPart2() {
        if (this.city == null && this.state == null && this.postalCode == null) {
            return null;
        }
        const city = this.city || "-";
        const state = this.state;
        const postalCode = this.postalCode || "-";
        let addressPart2 = city;
        if (!utils_1.Utils.isNullOrWhitespace(state)) {
            addressPart2 += ", " + state;
        }
        addressPart2 += ", " + postalCode;
        return addressPart2;
    }
    static fromJSON(obj) {
        return Object.assign(new IdentityView(), obj);
    }
}
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Title)
], IdentityView.prototype, "title", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.MiddleName)
], IdentityView.prototype, "middleName", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Address1)
], IdentityView.prototype, "address1", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Address2)
], IdentityView.prototype, "address2", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Address3)
], IdentityView.prototype, "address3", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.City, "cityTown")
], IdentityView.prototype, "city", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.State, "stateProvince")
], IdentityView.prototype, "state", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.PostalCode, "zipPostalCode")
], IdentityView.prototype, "postalCode", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Country)
], IdentityView.prototype, "country", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Company)
], IdentityView.prototype, "company", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Email)
], IdentityView.prototype, "email", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Phone)
], IdentityView.prototype, "phone", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Ssn)
], IdentityView.prototype, "ssn", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.Username)
], IdentityView.prototype, "username", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.PassportNumber)
], IdentityView.prototype, "passportNumber", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.LicenseNumber)
], IdentityView.prototype, "licenseNumber", void 0);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.FirstName)
], IdentityView.prototype, "firstName", null);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.LastName)
], IdentityView.prototype, "lastName", null);
__decorate([
    (0, linkedFieldOption_decorator_1.linkedFieldOption)(linkedIdType_1.IdentityLinkedId.FullName)
], IdentityView.prototype, "fullName", null);
exports.IdentityView = IdentityView;
//# sourceMappingURL=identityView.js.map