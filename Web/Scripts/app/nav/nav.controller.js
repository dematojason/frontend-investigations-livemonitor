var LiveMonitor;
(function (LiveMonitor) {
    var Nav;
    (function (Nav) {
        'use strict';
        var NavController = /** @class */ (function () {
            function NavController(_$rootScope) {
                this._$rootScope = _$rootScope;
                this.$onInit = function () { };
            }
            NavController.prototype.logout = function () {
                this._$rootScope.logout();
            };
            NavController.prototype.hasPermission = function (permission) {
                return this._$rootScope.hasPermission(permission);
            };
            NavController.$inject = [
                '$rootScope'
            ];
            return NavController;
        }());
        Nav.NavController = NavController;
        angular
            .module('LiveMonitor.Nav')
            .controller('NavController', NavController);
    })(Nav = LiveMonitor.Nav || (LiveMonitor.Nav = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=nav.controller.js.map