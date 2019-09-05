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
    var LmDomError = /** @class */ (function (_super) {
        __extends(LmDomError, _super);
        function LmDomError(domException, userMsg) {
            var _this = this;
            //let internalMsg: string | null = CommonHelper.isNullOrUndef(domException) ? userMsg : domException.message;
            var internalMsg;
            if (LiveMonitor.CommonHelper.isNullOrUndef(domException) || LiveMonitor.CommonHelper.isNullUndefOrBlank(domException.message)) {
                internalMsg = userMsg === null ? 'DOM Error thrown' : userMsg;
            }
            else {
                internalMsg = domException.message;
            }
            _this = _super.call(this, internalMsg) || this;
            _this.name = LiveMonitor.CommonHelper.isNullOrUndef(domException) ? 'LogicError' : domException.name;
            _this.userMsg = userMsg === null ? internalMsg : userMsg;
            return _this;
        }
        return LmDomError;
    }(LiveMonitor.BaseError));
    LiveMonitor.LmDomError = LmDomError;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=LmDomError.js.map