var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var UserApiService = /** @class */ (function () {
            function UserApiService(_$http) {
                this._$http = _$http;
                this._baseUrl = '/api/users';
            }
            UserApiService.prototype.getFacilities = function () {
                return this._$http.get(this._baseUrl + "/facilities")
                    .then(function (response) {
                    return response.data;
                });
            };
            UserApiService.$inject = ['$http'];
            return UserApiService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.UserApiService', UserApiService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=user.service.js.map