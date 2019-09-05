var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var LogService = /** @class */ (function () {
            function LogService(_$http, _$window) {
                this._$http = _$http;
                this._$window = _$window;
                this._baseUri = '/api/log';
            }
            LogService.prototype.isAlive = function () {
                return this._$http.get(this._baseUri + "/IsAlive")
                    .then(function () {
                    return true;
                }, function () {
                    return false;
                });
            };
            LogService.prototype.logError = function (msg, data, url) {
                var args = new LoggingArgs(this._$window, "Error", msg, data, url);
                return this.sendLog(args);
            };
            LogService.prototype.logInfo = function (msg, data, url) {
                var args = new LoggingArgs(this._$window, "Info", msg, data, url);
                return this.sendLog(args);
            };
            LogService.prototype.logWarning = function (msg, data, url) {
                var args = new LoggingArgs(this._$window, "Warning", msg, data, url);
                return this.sendLog(args);
            };
            LogService.prototype.logCritical = function (msg, data, url) {
                var args = new LoggingArgs(this._$window, "Critical", msg, data, url);
                return this.sendLog(args);
            };
            LogService.prototype.logSecurity = function (msg, data, url) {
                var args = new LoggingArgs(this._$window, "Error", msg, data, url);
                return this.sendLog(args);
            };
            LogService.prototype.log = function (logLevel, msg, data, url) {
                var args = new LoggingArgs(this._$window, logLevel, msg, data, url);
                return this.sendLog(args);
            };
            LogService.prototype.sendLog = function (args) {
                return this._$http.post(this._baseUri + "/write", args)
                    .then(function (response) {
                    return response.data;
                });
            };
            LogService.$inject = [
                '$http',
                '$window'
            ];
            return LogService;
        }());
        var LoggingArgs = /** @class */ (function () {
            function LoggingArgs($window, logLevel, msg, data, url) {
                this.applicationName = LiveMonitor.Constants.applicationName;
                this.logLevel = "Error";
                if (url !== null && url !== undefined && url !== '') {
                    this.url = url;
                }
                else {
                    this.url = $window.location.href;
                }
                var clientInfo = new LiveMonitor.ClientInfo();
                this.userAgent = clientInfo.browserName + " v" + clientInfo.browserVersion + " | " + clientInfo.osName + " v" + clientInfo.osVersion;
                this.shortDescription = msg;
                this.data = data;
                this.logLevel = logLevel;
            }
            return LoggingArgs;
        }());
        Services.LoggingArgs = LoggingArgs;
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.LogService', LogService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=prodigyutilityapi.service.js.map