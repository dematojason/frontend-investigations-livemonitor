var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var CogComponent = /** @class */ (function () {
            function CogComponent() {
                this.bindings = {
                    addClasses: '@?',
                    color: '@?',
                    faSize: '@?'
                };
                this.controller = CogController;
                this.controllerAs = 'vm';
                this.templateUrl = 'Templates/components/cog.html';
            }
            return CogComponent;
        }());
        var CogController = /** @class */ (function () {
            function CogController() {
                this.addClasses = '';
                this.color = 'white';
                this.faSize = '3x';
            }
            CogController.prototype.$onChanges = function (changes) {
                if (changes.color) {
                    this.style = { color: this.color };
                }
            };
            return CogController;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .component('cog', new CogComponent());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=cog.component.js.map