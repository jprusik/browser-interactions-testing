"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncString = void 0;
const encryptionType_1 = require("../../enums/encryptionType");
const utils_1 = require("../../misc/utils");
class EncString {
    encryptedString;
    encryptionType;
    decryptedValue;
    data;
    iv;
    mac;
    constructor(encryptedStringOrType, data, iv, mac) {
        if (data != null) {
            this.initFromData(encryptedStringOrType, data, iv, mac);
        }
        else {
            this.initFromEncryptedString(encryptedStringOrType);
        }
    }
    get ivBytes() {
        return this.iv == null ? null : utils_1.Utils.fromB64ToArray(this.iv).buffer;
    }
    get macBytes() {
        return this.mac == null ? null : utils_1.Utils.fromB64ToArray(this.mac).buffer;
    }
    get dataBytes() {
        return this.data == null ? null : utils_1.Utils.fromB64ToArray(this.data).buffer;
    }
    toJSON() {
        return this.encryptedString;
    }
    static fromJSON(obj) {
        return new EncString(obj);
    }
    initFromData(encType, data, iv, mac) {
        if (iv != null) {
            this.encryptedString = encType + "." + iv + "|" + data;
        }
        else {
            this.encryptedString = encType + "." + data;
        }
        // mac
        if (mac != null) {
            this.encryptedString += "|" + mac;
        }
        this.encryptionType = encType;
        this.data = data;
        this.iv = iv;
        this.mac = mac;
    }
    initFromEncryptedString(encryptedString) {
        this.encryptedString = encryptedString;
        if (!this.encryptedString) {
            return;
        }
        const { encType, encPieces } = this.parseEncryptedString(this.encryptedString);
        this.encryptionType = encType;
        switch (encType) {
            case encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64:
            case encryptionType_1.EncryptionType.AesCbc256_HmacSha256_B64:
                if (encPieces.length !== 3) {
                    return;
                }
                this.iv = encPieces[0];
                this.data = encPieces[1];
                this.mac = encPieces[2];
                break;
            case encryptionType_1.EncryptionType.AesCbc256_B64:
                if (encPieces.length !== 2) {
                    return;
                }
                this.iv = encPieces[0];
                this.data = encPieces[1];
                break;
            case encryptionType_1.EncryptionType.Rsa2048_OaepSha256_B64:
            case encryptionType_1.EncryptionType.Rsa2048_OaepSha1_B64:
                if (encPieces.length !== 1) {
                    return;
                }
                this.data = encPieces[0];
                break;
            default:
                return;
        }
    }
    parseEncryptedString(encryptedString) {
        const headerPieces = encryptedString.split(".");
        let encType;
        let encPieces = null;
        if (headerPieces.length === 2) {
            try {
                encType = parseInt(headerPieces[0], null);
                encPieces = headerPieces[1].split("|");
            }
            catch (e) {
                return;
            }
        }
        else {
            encPieces = encryptedString.split("|");
            encType =
                encPieces.length === 3
                    ? encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64
                    : encryptionType_1.EncryptionType.AesCbc256_B64;
        }
        return {
            encType,
            encPieces,
        };
    }
    async decrypt(orgId, key = null) {
        if (this.decryptedValue != null) {
            return this.decryptedValue;
        }
        try {
            if (key == null) {
                key = await this.getKeyForDecryption(orgId);
            }
            if (key == null) {
                throw new Error("No key to decrypt EncString with orgId " + orgId);
            }
            const encryptService = utils_1.Utils.getContainerService().getEncryptService();
            this.decryptedValue = await encryptService.decryptToUtf8(this, key);
        }
        catch (e) {
            this.decryptedValue = "[error: cannot decrypt]";
        }
        return this.decryptedValue;
    }
    async getKeyForDecryption(orgId) {
        const cryptoService = utils_1.Utils.getContainerService().getCryptoService();
        return orgId != null
            ? await cryptoService.getOrgKey(orgId)
            : await cryptoService.getKeyForUserEncryption();
    }
}
exports.EncString = EncString;
//# sourceMappingURL=encString.js.map