"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldData = void 0;
class FieldData {
    type;
    name;
    value;
    linkedId;
    constructor(response) {
        if (response == null) {
            return;
        }
        this.type = response.type;
        this.name = response.name;
        this.value = response.value;
        this.linkedId = response.linkedId;
    }
}
exports.FieldData = FieldData;
//# sourceMappingURL=fieldData.js.map