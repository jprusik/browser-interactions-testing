"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriView = void 0;
const uriMatchType_1 = require("../../enums/uriMatchType");
const utils_1 = require("../../misc/utils");
const CanLaunchWhitelist = [
    "https://",
    "http://",
    "ssh://",
    "ftp://",
    "sftp://",
    "irc://",
    "vnc://",
    // https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-uri
    "rdp://",
    "ms-rd:",
    "chrome://",
    "iosapp://",
    "androidapp://",
];
class LoginUriView {
    match = null;
    _uri = null;
    _domain = null;
    _hostname = null;
    _host = null;
    _canLaunch = null;
    constructor(u) {
        if (!u) {
            return;
        }
        this.match = u.match;
    }
    get uri() {
        return this._uri;
    }
    set uri(value) {
        this._uri = value;
        this._domain = null;
        this._canLaunch = null;
    }
    get domain() {
        if (this._domain == null && this.uri != null) {
            this._domain = utils_1.Utils.getDomain(this.uri);
            if (this._domain === "") {
                this._domain = null;
            }
        }
        return this._domain;
    }
    get hostname() {
        if (this.match === uriMatchType_1.UriMatchType.RegularExpression) {
            return null;
        }
        if (this._hostname == null && this.uri != null) {
            this._hostname = utils_1.Utils.getHostname(this.uri);
            if (this._hostname === "") {
                this._hostname = null;
            }
        }
        return this._hostname;
    }
    get host() {
        if (this.match === uriMatchType_1.UriMatchType.RegularExpression) {
            return null;
        }
        if (this._host == null && this.uri != null) {
            this._host = utils_1.Utils.getHost(this.uri);
            if (this._host === "") {
                this._host = null;
            }
        }
        return this._host;
    }
    get hostnameOrUri() {
        return this.hostname != null ? this.hostname : this.uri;
    }
    get hostOrUri() {
        return this.host != null ? this.host : this.uri;
    }
    get isWebsite() {
        return (this.uri != null &&
            (this.uri.indexOf("http://") === 0 ||
                this.uri.indexOf("https://") === 0 ||
                (this.uri.indexOf("://") < 0 && utils_1.Utils.tldEndingRegex.test(this.uri))));
    }
    get canLaunch() {
        if (this._canLaunch != null) {
            return this._canLaunch;
        }
        if (this.uri != null && this.match !== uriMatchType_1.UriMatchType.RegularExpression) {
            const uri = this.launchUri;
            for (let i = 0; i < CanLaunchWhitelist.length; i++) {
                if (uri.indexOf(CanLaunchWhitelist[i]) === 0) {
                    this._canLaunch = true;
                    return this._canLaunch;
                }
            }
        }
        this._canLaunch = false;
        return this._canLaunch;
    }
    get launchUri() {
        return this.uri.indexOf("://") < 0 && utils_1.Utils.tldEndingRegex.test(this.uri)
            ? "http://" + this.uri
            : this.uri;
    }
    static fromJSON(obj) {
        return Object.assign(new LoginUriView(), obj);
    }
}
exports.LoginUriView = LoginUriView;
//# sourceMappingURL=loginUriView.js.map