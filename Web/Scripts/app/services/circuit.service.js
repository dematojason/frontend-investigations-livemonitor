var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var CircuitService = /** @class */ (function () {
            function CircuitService(_$http) {
                this._$http = _$http;
            }
            CircuitService.prototype.getCtrlMsgTypeDisplay = function (type) {
                switch (type) {
                    case LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLSTART:
                        return "Call Start";
                    case LiveMonitor.CtrlMsgType.WM_CTRL_MSG_EVENT_CALLEND:
                        return "Call End";
                    default:
                        return "N/A";
                }
            };
            CircuitService.$inject = ['$http'];
            return CircuitService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.CircuitService', CircuitService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=circuit.service.js.map