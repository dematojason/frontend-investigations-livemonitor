var LiveMonitor;
(function (LiveMonitor) {
    var Home;
    (function (Home) {
        'use strict';
        var HomeController = /** @class */ (function () {
            function HomeController(_$rootScope) {
                this._$rootScope = _$rootScope;
                this.title = 'Home';
                this.showNoPermissionMsg = false;
                this.$onInit = function () { };
                if (!this.hasPermission('Live_Monitor_View')) {
                    this.showNoPermissionMsg = true;
                }
            }
            HomeController.prototype.hasPermission = function (permission) {
                return this._$rootScope.hasPermission(permission);
            };
            HomeController.$inject = [
                '$rootScope'
            ];
            return HomeController;
        }());
        Home.HomeController = HomeController;
        angular
            .module('LiveMonitor.Home')
            .controller('HomeController', HomeController);
    })(Home = LiveMonitor.Home || (LiveMonitor.Home = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=home.controller.js.map