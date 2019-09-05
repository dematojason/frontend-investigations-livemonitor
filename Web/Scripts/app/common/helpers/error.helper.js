var LiveMonitor;
(function (LiveMonitor) {
    var ErrorHelper = /** @class */ (function () {
        function ErrorHelper() {
        }
        /**
         * Workaround for making typescript catch block errors [kind of] type-safe.
         * @param err The error object
         * @param msg [Optional] The user message
         */
        ErrorHelper.getLiveMonitorError = function (err, msg) {
            if (!LiveMonitor.CommonHelper.isNullOrUndef(err) && err instanceof LiveMonitor.BaseError) {
                return err;
            }
            else {
                return new LiveMonitor.UnknownError(err, msg);
            }
        };
        return ErrorHelper;
    }());
    LiveMonitor.ErrorHelper = ErrorHelper;
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=error.helper.js.map