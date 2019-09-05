var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var ScrollTo = /** @class */ (function () {
            function ScrollTo() {
                this.restrict = 'A';
                this.link = function (scope, element, attrs, ngModelCtrl) {
                    var idToScroll = attrs.scrollTo;
                    element.on('click', function () {
                        $("" + idToScroll)[0].scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
                    });
                };
            }
            ScrollTo.factory = function () {
                var directive = function () { return new ScrollTo(); };
                directive.$inject = [];
                return directive;
            };
            return ScrollTo;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .directive('scrollTo', ScrollTo.factory());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=scrollTo.directive.js.map