(function () {
    'use strict';
    angular
        .module('LiveMonitor.Blocks')
        .config(config);
    config.$inject = ['LiveMonitor.Blocks.ApiEndpointProvider'];
    function config(apiEndpointProvider) {
        apiEndpointProvider.configure('/api');
    }
})();
//# sourceMappingURL=apiendpoint.config.js.map