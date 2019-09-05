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
     * Should be used for when the error data type is unknown.
     */
    var UnknownError = /** @class */ (function (_super) {
        __extends(UnknownError, _super);
        function UnknownError(errObj, userMsg) {
            var _this = _super.call(this) || this;
            if (LiveMonitor.CommonHelper.isNullOrUndef(errObj) || LiveMonitor.CommonHelper.isNullUndefOrBlank(errObj.name)) {
                _this.name = 'UnknownError';
            }
            else {
                _this.name = errObj.name;
            }
            _this.errObj = errObj;
            _this.userMsg = userMsg === null ? 'An unexpected error has occurred' : userMsg;
            return _this;
        }
        return UnknownError;
    }(LiveMonitor.BaseError));
    LiveMonitor.UnknownError = UnknownError;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=UnknownError.js.map