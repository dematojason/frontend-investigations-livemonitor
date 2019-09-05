var ALiveMonitorpp;
(function (ALiveMonitorpp) {
    var Blocks;
    (function (Blocks) {
        'use strict';
        var ErrorBroker = /** @class */ (function () {
            function ErrorBroker() {
            }
            ErrorBroker.prototype.log = function (error) {
                throw new Error("Method not implemented");
            };
            ErrorBroker.prototype.registerLogger = function (errorLogger) {
                throw new Error("Method not implemented");
            };
            return ErrorBroker;
        }());
        angular
            .module('LiveMonitor.Blocks')
            .service('LiveMonitor.Blocks.ErrorBroker', ErrorBroker);
    })(Blocks = ALiveMonitorpp.Blocks || (ALiveMonitorpp.Blocks = {}));
})(ALiveMonitorpp || (ALiveMonitorpp = {}));
//# sourceMappingURL=errorbroker.service.js.map