(function () {
    'use strict';
    angular
        .module('LiveMonitor.Circuits')
        .config(config);
    config.$inject = ['$provide'];
    function config($provide) {
        $provide.decorator('$log', extendLog);
    }
    extendLog.$inject = ['$delegate'];
    function extendLog($delegate) {
        var debugFunc = $delegate.debug;
        $delegate.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var now = (new Date()).toLocaleTimeString();
            args[0] = now + " - " + args[0];
            debugFunc.apply(null, args);
        };
        return $delegate;
    }
})();
//# sourceMappingURL=logdecorator.config.js.map