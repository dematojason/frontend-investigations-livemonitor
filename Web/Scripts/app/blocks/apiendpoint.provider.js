var LiveMonitor;
(function (LiveMonitor) {
    var Blocks;
    (function (Blocks) {
        'use strict';
        var ApiEndpointProvider = /** @class */ (function () {
            function ApiEndpointProvider() {
            }
            ApiEndpointProvider.prototype.configure = function (baseUrl) {
                this.config = {
                    baseUrl: baseUrl
                };
            };
            ApiEndpointProvider.prototype.$get = function () {
                return this.config;
            };
            return ApiEndpointProvider;
        }());
        angular
            .module('LiveMonitor.Blocks')
            .provider('LiveMonitor.Blocks.ApiEndpoint', ApiEndpointProvider);
    })(Blocks = LiveMonitor.Blocks || (LiveMonitor.Blocks = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=apiendpoint.provider.js.map