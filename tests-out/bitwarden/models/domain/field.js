"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const fieldData_1 = require("../data/fieldData");
const fieldView_1 = require("../view/fieldView");
const domainBase_1 = require("./domainBase");
class Field extends domainBase_1.default {
    name;
    value;
    type;
    linkedId;
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
        this.linkedId = obj.linkedId;
        this.buildDomainModel(this, obj, {
            name: null,
            value: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new fieldView_1.FieldView(this), {
            name: null,
            value: null,
        }, orgId, encKey);
    }
    toFieldData() {
        const f = new fieldData_1.FieldData();
        this.buildDataModel(this, f, {
            name: null,
            value: null,
            type: null,
            linkedId: null,
        }, ["type", "linkedId"]);
        return f;
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map