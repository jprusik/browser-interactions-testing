"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymmetricCryptoKey = void 0;
const utils_1 = require("../../misc/utils");
const encryptionType_1 = require("../../enums/encryptionType");
class SymmetricCryptoKey {
    key;
    encKey;
    macKey;
    encType;
    keyB64;
    encKeyB64;
    macKeyB64;
    meta;
    constructor(key, encType) {
        if (key == null) {
            throw new Error("Must provide key");
        }
        if (encType == null) {
            if (key.byteLength === 32) {
                encType = encryptionType_1.EncryptionType.AesCbc256_B64;
            }
            else if (key.byteLength === 64) {
                encType = encryptionType_1.EncryptionType.AesCbc256_HmacSha256_B64;
            }
            else {
                throw new Error("Unable to determine encType.");
            }
        }
        this.key = key;
        this.encType = encType;
        if (encType === encryptionType_1.EncryptionType.AesCbc256_B64 && key.byteLength === 32) {
            this.encKey = key;
            this.macKey = null;
        }
        else if (encType === encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64 && key.byteLength === 32) {
            this.encKey = key.slice(0, 16);
            this.macKey = key.slice(16, 32);
        }
        else if (encType === encryptionType_1.EncryptionType.AesCbc256_HmacSha256_B64 && key.byteLength === 64) {
            this.encKey = key.slice(0, 32);
            this.macKey = key.slice(32, 64);
        }
        else {
            throw new Error("Unsupported encType/key length.");
        }
        if (this.key != null) {
            this.keyB64 = utils_1.Utils.fromBufferToB64(this.key);
        }
        if (this.encKey != null) {
            this.encKeyB64 = utils_1.Utils.fromBufferToB64(this.encKey);
        }
        if (this.macKey != null) {
            this.macKeyB64 = utils_1.Utils.fromBufferToB64(this.macKey);
        }
    }
    toJSON() {
        // The whole object is constructed from the initial key, so just store the B64 key
        return { keyB64: this.keyB64 };
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const arrayBuffer = utils_1.Utils.fromB64ToArray(obj.keyB64).buffer;
        return new SymmetricCryptoKey(arrayBuffer);
    }
}
exports.SymmetricCryptoKey = SymmetricCryptoKey;
//# sourceMappingURL=symmetricCryptoKey.js.map