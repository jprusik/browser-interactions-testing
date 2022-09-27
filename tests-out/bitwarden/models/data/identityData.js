"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityData = void 0;
class IdentityData {
    title;
    firstName;
    middleName;
    lastName;
    address1;
    address2;
    address3;
    city;
    state;
    postalCode;
    country;
    company;
    email;
    phone;
    ssn;
    username;
    passportNumber;
    licenseNumber;
    constructor(data) {
        if (data == null) {
            return;
        }
        this.title = data.title;
        this.firstName = data.firstName;
        this.middleName = data.middleName;
        this.lastName = data.lastName;
        this.address1 = data.address1;
        this.address2 = data.address2;
        this.address3 = data.address3;
        this.city = data.city;
        this.state = data.state;
        this.postalCode = data.postalCode;
        this.country = data.country;
        this.company = data.company;
        this.email = data.email;
        this.phone = data.phone;
        this.ssn = data.ssn;
        this.username = data.username;
        this.passportNumber = data.passportNumber;
        this.licenseNumber = data.licenseNumber;
    }
}
exports.IdentityData = IdentityData;
//# sourceMappingURL=identityData.js.map