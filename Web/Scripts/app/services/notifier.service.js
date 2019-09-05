var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        var NotifierService = /** @class */ (function () {
            function NotifierService(_toastr) {
                this._toastr = _toastr;
            }
            NotifierService.prototype.error = function (message, title, options) {
                return this._toastr.error(message, title, options);
            };
            NotifierService.prototype.info = function (message, title, options) {
                return this._toastr.info(message, title, options);
            };
            NotifierService.prototype.success = function (message, title, options) {
                return this._toastr.success(message, title, options);
            };
            NotifierService.prototype.warning = function (message, title, options) {
                return this._toastr.warning(message, title, options);
            };
            NotifierService.$inject = [
                'toastr'
            ];
            return NotifierService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.NotifierService', NotifierService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=notifier.service.js.map