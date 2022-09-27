"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encString_1 = require("./encString");
class Domain {
    buildDomainModel(domain, dataObj, map, notEncList = []) {
        for (const prop in map) {
            // eslint-disable-next-line
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = dataObj[map[prop] || prop];
            if (notEncList.indexOf(prop) > -1) {
                domain[prop] = objProp ? objProp : null;
            }
            else {
                domain[prop] = objProp ? new encString_1.EncString(objProp) : null;
            }
        }
    }
    buildDataModel(domain, dataObj, map, notEncStringList = []) {
        for (const prop in map) {
            // eslint-disable-next-line
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = domain[map[prop] || prop];
            if (notEncStringList.indexOf(prop) > -1) {
                dataObj[prop] = objProp != null ? objProp : null;
            }
            else {
                dataObj[prop] = objProp != null ? objProp.encryptedString : null;
            }
        }
    }
    async decryptObj(viewModel, map, orgId, key = null) {
        const promises = [];
        const self = this;
        for (const prop in map) {
            // eslint-disable-next-line
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            (function (theProp) {
                const p = Promise.resolve()
                    .then(() => {
                    const mapProp = map[theProp] || theProp;
                    if (self[mapProp]) {
                        return self[mapProp].decrypt(orgId, key);
                    }
                    return null;
                })
                    .then((val) => {
                    viewModel[theProp] = val;
                });
                promises.push(p);
            })(prop);
        }
        await Promise.all(promises);
        return viewModel;
    }
}
exports.default = Domain;
//# sourceMappingURL=domainBase.js.map