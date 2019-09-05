var LiveMonitor;
(function (LiveMonitor) {
    var HttpRequestInterceptor = /** @class */ (function () {
        function HttpRequestInterceptor(_$q, _$rootScope, _$window) {
            var _this = this;
            this._$q = _$q;
            this._$rootScope = _$rootScope;
            this._$window = _$window;
            this.request = function (requestConfig) {
                return requestConfig;
            };
            this.response = function (response) {
                // Hacky way of handling this...
                // This should determine whether or not the response from the server is a redirect response to the login page.
                if (typeof response.data === 'string' && response.data.indexOf('ng-controller="AccountController as vm"') !== -1) {
                    // Handle the redirect to the login page through calling logout function.
                    _this._$rootScope.logout();
                    return _this._$q.reject(response);
                }
                return _this._$q.when(response);
            };
        }
        HttpRequestInterceptor.factory = function ($q, $rootScope, $window) {
            return new HttpRequestInterceptor($q, $rootScope, $window);
        };
        return HttpRequestInterceptor;
    }());
    LiveMonitor.HttpRequestInterceptor = HttpRequestInterceptor;
    angular
        .module('LiveMonitor')
        .factory('LiveMonitor.HttpRequestInterceptor', HttpRequestInterceptor);
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=httprequestinterceptor.factory.js.map