var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var DashboardService = /** @class */ (function () {
            function DashboardService(_$http) {
                this._$http = _$http;
            }
            DashboardService.prototype.getRtcmMessages = function () {
                return this._$http.get("/api/circuits/rtcm-messages")
                    .then(function (response) {
                    return response.data;
                });
            };
            DashboardService.$inject = ['$http'];
            return DashboardService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.DashboardService', DashboardService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=dashboard.service.js.map