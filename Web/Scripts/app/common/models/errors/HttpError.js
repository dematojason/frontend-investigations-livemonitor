var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LiveMonitor;
(function (LiveMonitor) {
    /**
     * Combines different types of http rejection responses into a single error class.
     */
    var HttpError = /** @class */ (function (_super) {
        __extends(HttpError, _super);
        function HttpError(errObj, httpMethod, userMsg, status, url) {
            var _this = this;
            // Both angularjs rejected promise (for http calls) and Response types have
            // statusText property which is used here for the internal message.
            var internalMsg;
            if (LiveMonitor.CommonHelper.isNullOrUndef(errObj) || LiveMonitor.CommonHelper.isNullOrUndef(errObj.statusText)) {
                internalMsg = 'Unexpected error contacting server';
            }
            else {
                internalMsg = errObj.statusText;
            }
            // Base class properties.
            _this = _super.call(this, internalMsg) || this;
            _this.name = 'HttpError';
            _this._defUserMsg = internalMsg;
            _this._defStatusCode = 500;
            _this._defHttpMethod = 'UNKNOWN';
            _this.userMsg = userMsg === null ? _this._defUserMsg : userMsg;
            if (LiveMonitor.CommonHelper.isNullOrUndef(errObj)) {
                _this.createCustom(httpMethod, status, url);
            }
            else {
                _this.createFromErr(errObj, httpMethod);
            }
            if (errObj instanceof Response) {
                _this.status = errObj.status;
                _this.httpMethod = httpMethod === null ? 'UNKNOWN' : httpMethod;
                _this.url = errObj.url;
            }
            else {
                _this.status = errObj.status;
                _this.httpMethod = errObj.config.method;
                _this.url = errObj.config.url;
            }
            var val = undefined;
            return _this;
        }
        HttpError.prototype.createCustom = function (httpMethod, status, url) {
            this.status = status === null ? this._defStatusCode : status;
            this.httpMethod = httpMethod === null ? this._defHttpMethod : httpMethod;
            this.url = url;
        };
        HttpError.prototype.createFromErr = function (errObj, httpMethod) {
            if (errObj instanceof Response) {
                this.status = errObj.status;
                this.httpMethod = httpMethod === null ? this._defHttpMethod : httpMethod;
                this.url = errObj.url;
            }
            else {
                this.status = errObj.status;
                this.httpMethod = errObj.config.method;
                this.url = errObj.config.url;
            }
        };
        return HttpError;
    }(LiveMonitor.BaseError));
    LiveMonitor.HttpError = HttpError;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=HttpError.js.map