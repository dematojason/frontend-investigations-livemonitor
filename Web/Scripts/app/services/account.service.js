var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        var AccountService = /** @class */ (function () {
            function AccountService(_$http, _$window) {
                this._$http = _$http;
                this._$window = _$window;
                this._baseUri = '/api/account';
            }
            AccountService.prototype.authenticated = function () {
                return this._$http.get(this._baseUri + "/authenticated")
                    .then(function (response) {
                    return response.data;
                });
            };
            AccountService.prototype.kineticLogin = function (token) {
                var _this = this;
                var args = new LiveMonitor.LoginArgs();
                args.token = token;
                return this._$http.post(this._baseUri + "/kinetic-login", args)
                    .then(function (response) {
                    _this._$window.localStorage.setItem('liveMonitor.loggedIn', 'true');
                    return response.data;
                });
            };
            AccountService.prototype.login = function (username, password) {
                var _this = this;
                var args = new LiveMonitor.LoginArgs();
                args.username = username;
                args.password = password;
                return this._$http.post(this._baseUri + "/login", args)
                    .then(function (response) {
                    _this._$window.localStorage.setItem('liveMonitor.loggedIn', 'true');
                    return response.data;
                });
            };
            AccountService.prototype.logout = function () {
                var _this = this;
                return this._$http.post(this._baseUri + "/logout", null)
                    .then(function (response) {
                    _this._$window.localStorage.setItem('liveMonitor.loggedIn', 'false');
                    return response.data;
                });
            };
            AccountService.prototype.register = function () {
                return this._$http.get(this._baseUri + "/register")
                    .then(function (response) {
                    return response.data;
                });
            };
            AccountService.prototype.testAuth = function () {
                return this._$http.post(this._baseUri + "/testauth", null)
                    .then(function (response) {
                    return response.data;
                });
            };
            AccountService.$inject = [
                '$http',
                '$window'
            ];
            return AccountService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.AccountService', AccountService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=account.service.js.map