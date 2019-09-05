var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var LocalStorageService = /** @class */ (function () {
            function LocalStorageService(_$window) {
                this._$window = _$window;
            }
            LocalStorageService.prototype.getIsMilitaryDisplay = function () {
                var isMilitaryDisplay = this._$window.localStorage.getItem('liveMonitor.isMilitaryDisplay');
                if (isMilitaryDisplay === undefined || isMilitaryDisplay === null) {
                    return false;
                }
                return (isMilitaryDisplay.toLowerCase() === 'true');
            };
            LocalStorageService.prototype.getIsLoggedIn = function () {
                var loggedIn = this._$window.localStorage.getItem('liveMonitor.loggedIn');
                if (loggedIn === undefined || loggedIn === null) {
                    return false;
                }
                return (loggedIn.toLowerCase() === 'true');
            };
            LocalStorageService.prototype.getPermissions = function () {
                var permissionStr = this._$window.localStorage.getItem('liveMonitor.permissions');
                if (LiveMonitor.CommonHelper.isNullUndefOrBlank(permissionStr)) {
                    return [];
                }
                return JSON.parse(permissionStr);
            };
            LocalStorageService.prototype.hasPermission = function (permission) {
                var permissions = this.getPermissions();
                for (var i = 0; i < permissions.length; i++) {
                    if (permissions[i] === permission) {
                        return true;
                    }
                }
                return false;
            };
            LocalStorageService.$inject = [
                '$window'
            ];
            return LocalStorageService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.LocalStorageService', LocalStorageService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=localstorage.service.js.map