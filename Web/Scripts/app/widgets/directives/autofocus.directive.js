var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var Autofocus = /** @class */ (function () {
            function Autofocus(_$timeout) {
                var _this = this;
                this._$timeout = _$timeout;
                this.restrict = 'A';
                this.link = function (scope, element, attrs, ngModelCtrl) {
                    _this._$timeout(function () {
                        element[0].focus();
                    }, 200);
                };
            }
            Autofocus.factory = function () {
                var directive = function ($timeout) { return new Autofocus($timeout); };
                directive.$inject = ['$timeout'];
                return directive;
            };
            Autofocus.$inject = ['$timeout'];
            return Autofocus;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .directive('autofocus', Autofocus.factory());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=autofocus.directive.js.map