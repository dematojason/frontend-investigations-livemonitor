var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var ScrollToController = /** @class */ (function () {
            function ScrollToController() {
                this.scrollToId = '';
                this.txtBtn = 'Scroll to Top';
            }
            return ScrollToController;
        }());
        var ScrollToComponent = /** @class */ (function () {
            function ScrollToComponent() {
                this.bindings = {
                    scrollToId: '@',
                    txtBtn: '@?'
                };
                this.controller = ScrollToController;
                this.controllerAs = 'vm';
                this.templateUrl = 'Templates/components/scrollto.html';
            }
            return ScrollToComponent;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .component('scrollTo', new ScrollToComponent());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=scrollTo.component.js.map