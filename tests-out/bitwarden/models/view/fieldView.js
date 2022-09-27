"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldView = void 0;
class FieldView {
    name = null;
    value = null;
    type = null;
    newField = false; // Marks if the field is new and hasn't been saved
    showValue = false;
    showCount = false;
    linkedId = null;
    constructor(f) {
        if (!f) {
            return;
        }
        this.type = f.type;
        this.linkedId = f.linkedId;
    }
    get maskedValue() {
        return this.value != null ? "••••••••" : null;
    }
    static fromJSON(obj) {
        return Object.assign(new FieldView(), obj);
    }
}
exports.FieldView = FieldView;
//# sourceMappingURL=fieldView.js.map