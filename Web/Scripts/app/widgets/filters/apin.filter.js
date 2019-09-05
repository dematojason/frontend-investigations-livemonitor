var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        (function () {
            'use strict';
            angular.module('LiveMonitor.Widgets').filter('apin', function () {
                return function (input) {
                    var result = '';
                    if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(input)) {
                        result = LiveMonitor.FormatHelper.getApinFromPin(input);
                    }
                    return result;
                };
            });
        })();
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=apin.filter.js.map