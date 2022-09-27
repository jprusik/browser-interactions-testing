"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = void 0;
const identityData_1 = require("../data/identityData");
const identityView_1 = require("../view/identityView");
const domainBase_1 = require("./domainBase");
class Identity extends domainBase_1.default {
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
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new identityView_1.IdentityView(), {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        }, orgId, encKey);
    }
    toIdentityData() {
        const i = new identityData_1.IdentityData();
        this.buildDataModel(this, i, {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        });
        return i;
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map