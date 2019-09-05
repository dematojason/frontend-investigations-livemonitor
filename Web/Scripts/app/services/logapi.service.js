var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var LogApiService = /** @class */ (function () {
            function LogApiService(_$http) {
                this._$http = _$http;
                this._baseUrl = '/api/log';
            }
            LogApiService.prototype.write = function (logLevel, message, data) {
                var args = new WriteLogArgs();
                args.logLevel = logLevel;
                args.message = message;
                args.data = data;
                return this._$http.post(this._baseUrl + "/write", args)
                    .then(function (response) {
                    return response.data;
                });
            };
            LogApiService.$inject = ['$http'];
            return LogApiService;
        }());
        var WriteLogArgs = /** @class */ (function () {
            function WriteLogArgs() {
            }
            return WriteLogArgs;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.LogApiService', LogApiService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=logapi.service.js.map