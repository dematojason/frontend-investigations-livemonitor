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
    var ValidationError = /** @class */ (function (_super) {
        __extends(ValidationError, _super);
        function ValidationError(internalMsg, userMsg) {
            var _this = _super.call(this, internalMsg) || this;
            _this.name = 'ValidationError';
            _this.userMsg = userMsg;
            return _this;
        }
        return ValidationError;
    }(LiveMonitor.BaseError));
    LiveMonitor.ValidationError = ValidationError;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=ValidationError.js.map