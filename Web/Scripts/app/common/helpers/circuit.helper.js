var LiveMonitor;
(function (LiveMonitor) {
    var CircuitHelper = /** @class */ (function () {
        function CircuitHelper() {
        }
        /**
         * Checks to see if the calls of @param c1 and @param c2 are the same.
         * @param c1 The first LiveCircuitEntry
         * @param c2 The second LiveCircuitEntry
         */
        CircuitHelper.isCallMatch = function (c1, c2) {
            if (LiveMonitor.CommonHelper.isDefined(c1) && LiveMonitor.CommonHelper.isDefined(c2)) {
                if (LiveMonitor.CommonHelper.isDefined(c1.call) && LiveMonitor.CommonHelper.isDefined(c2.call)) {
                    return (c1.call.callId === c2.call.callId && c1.ani === c2.ani && c1.call.unitId === c2.call.unitId && c1.call.lineId === c2.call.lineId);
                }
            }
            return false;
        };
        return CircuitHelper;
    }());
    LiveMonitor.CircuitHelper = CircuitHelper;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=circuit.helper.js.map