"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentResponse = void 0;
const baseResponse_1 = require("./baseResponse");
class AttachmentResponse extends baseResponse_1.BaseResponse {
    id;
    url;
    fileName;
    key;
    size;
    sizeName;
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.url = this.getResponseProperty("Url");
        this.fileName = this.getResponseProperty("FileName");
        this.key = this.getResponseProperty("Key");
        this.size = this.getResponseProperty("Size");
        this.sizeName = this.getResponseProperty("SizeName");
    }
}
exports.AttachmentResponse = AttachmentResponse;
//# sourceMappingURL=attachmentResponse.js.map