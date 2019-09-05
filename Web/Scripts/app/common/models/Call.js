var LiveMonitor;
(function (LiveMonitor) {
    var Call = /** @class */ (function () {
        function Call() {
        }
        Object.defineProperty(Call.prototype, "inmateName", {
            get: function () {
                return LiveMonitor.FormatHelper.getNameDisplay(this.inmateFirstName, this.inmateMiddleName, this.inmateLastName);
            },
            enumerable: true,
            configurable: true
        });
        return Call;
    }());
    LiveMonitor.Call = Call;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=Call.js.map