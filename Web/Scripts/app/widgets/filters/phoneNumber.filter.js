var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        (function () {
            'use strict';
            angular.module('LiveMonitor.Widgets').filter('phoneNumber', function () {
                return function (input) {
                    var result = '';
                    if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(input)) {
                        result = LiveMonitor.FormatHelper.getPhoneDisplay(input);
                    }
                    return result;
                };
            });
        })();
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=phoneNumber.filter.js.map