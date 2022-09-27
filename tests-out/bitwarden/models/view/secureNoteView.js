"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNoteView = void 0;
const itemView_1 = require("./itemView");
class SecureNoteView extends itemView_1.ItemView {
    type = null;
    constructor(n) {
        super();
        if (!n) {
            return;
        }
        this.type = n.type;
    }
    get subTitle() {
        return null;
    }
    static fromJSON(obj) {
        return Object.assign(new SecureNoteView(), obj);
    }
}
exports.SecureNoteView = SecureNoteView;
//# sourceMappingURL=secureNoteView.js.map