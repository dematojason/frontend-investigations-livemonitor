var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        var AudioService = /** @class */ (function () {
            function AudioService(_$http) {
                this._$http = _$http;
                this._baseUri = '/api/audio';
            }
            AudioService.prototype.disconnectCall = function (ani) {
                return this._$http.post(this._baseUri + "/disconnect-call?ani=" + ani, null)
                    .then(function (response) {
                    return response.data;
                });
            };
            //public requestMonitorStart(args: MonitorRequestArgs): ng.IPromise<void> {
            //	return this._$http.post(`${this._baseUri}/live-stream/request-monitor-start`, args)
            //		.then((response: any): void => {
            //			return response.data;
            //		});
            //}
            AudioService.prototype.requestMonitorEnd = function (args) {
                return this._$http.post(this._baseUri + "/live-stream/request-monitor-end", args)
                    .then(function (response) {
                    return response.data;
                });
            };
            AudioService.prototype.stopLiveStream = function () {
                return this._$http.post(this._baseUri + "/live-stream/stop", null)
                    .then(function (response) {
                    return response.data;
                });
            };
            AudioService.$inject = ['$http'];
            return AudioService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.AudioService', AudioService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=audio.service.js.map