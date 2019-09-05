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
    var Services;
    (function (Services) {
        'use strict';
        var ProdigyApiService = /** @class */ (function () {
            function ProdigyApiService(_$http) {
                this._$http = _$http;
                this._baseUrl = '/api/circuits';
            }
            ProdigyApiService.prototype.getCircuits = function (siteList) {
                var args = new GetCircuitArgs();
                args.siteList = siteList;
                return this._$http.post(this._baseUrl + "/get-circuits", args)
                    .then(function (response) {
                    return response.data;
                });
            };
            ProdigyApiService.$inject = ['$http'];
            return ProdigyApiService;
        }());
        var GetCircuitArgs = /** @class */ (function (_super) {
            __extends(GetCircuitArgs, _super);
            function GetCircuitArgs() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetCircuitArgs;
        }(LiveMonitor.ProdigyApiArgs));
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.ProdigyApiService', ProdigyApiService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=prodigyapi.service.js.map