var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var InmateService = /** @class */ (function () {
            function InmateService(_$http) {
                this._$http = _$http;
                this._baseUrl = '/api/inmates';
            }
            InmateService.prototype.getInmates = function (search, siteList) {
                var args = new GetInmateArgs();
                args.search = search;
                args.siteIds = siteList;
                return this._$http.post(this._baseUrl + "/load", args)
                    .then(function (response) {
                    return response.data;
                });
            };
            InmateService.$inject = ['$http'];
            return InmateService;
        }());
        var GetInmateArgs = /** @class */ (function () {
            function GetInmateArgs() {
            }
            return GetInmateArgs;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.InmateService', InmateService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=inmates.service.js.map