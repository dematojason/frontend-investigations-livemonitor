var LiveMonitor;
(function (LiveMonitor) {
    var Account;
    (function (Account) {
        var AccountController = /** @class */ (function () {
            function AccountController(_accountService, _notifier, _$window, _$timeout) {
                var _this = this;
                this._accountService = _accountService;
                this._notifier = _notifier;
                this._$window = _$window;
                this._$timeout = _$timeout;
                this.isLoading = false;
                this.$onInit = function () {
                    //if (Math.floor(Math.random() * 2) === 1) {
                    //	this.showBob = true;
                    //}
                    _this.showBob = false;
                };
                this.$postLink = function () {
                    if (LiveMonitor.CommonHelper.isDefined(_this.token)) {
                        _this.isLoading = true;
                        _this._accountService.register()
                            .then(function () {
                            _this._accountService.kineticLogin(_this.token)
                                .then(function (result) {
                                _this.loginSuccess(result);
                            }, function (innerErr) {
                                _this.loginFail(innerErr);
                            });
                        }, function (err) {
                            _this.loginFail(err);
                        });
                    }
                };
                this.reset();
            }
            AccountController.prototype.init = function (model) {
                if (LiveMonitor.CommonHelper.isDefinedNotWhitespace(model)) {
                    this.token = model;
                }
            };
            AccountController.prototype.login = function () {
                var _this = this;
                if (this.isLoading) {
                    return;
                }
                this.isLoading = true;
                if (this.username !== '' && this.password !== '') {
                    this._accountService.login(this.username, this.password)
                        .then(function (result) {
                        _this.loginSuccess(result);
                    }, function (err) {
                        _this.loginFail(err);
                    });
                }
            };
            AccountController.prototype.loginSuccess = function (result) {
                var _this = this;
                // save in local storage for later use
                this._$window.localStorage.setItem("liveMonitor.isMilitaryDisplay", angular.toJson(result.isMilitaryDisplay));
                this._$window.localStorage.setItem("liveMonitor.permissions", angular.toJson(result.permissions));
                this.reset();
                this._$timeout(function () {
                    _this._$window.location.assign('/#!/circuits');
                }, 2000);
            };
            AccountController.prototype.loginFail = function (err) {
                switch (err.status) {
                    case LiveMonitor.HttpStatusCode.UNAUTHORIZED:
                        this._notifier.warning('Incorrect username and/or password');
                        break;
                    default:
                        console.log(err);
                        this._notifier.error('An unexpected error occurred while attempting to login', 'Application Error');
                        break;
                }
                this.isLoading = false;
            };
            AccountController.prototype.reset = function () {
                this.username = "";
                this.password = "";
            };
            AccountController.$inject = [
                'LiveMonitor.Services.AccountService',
                'LiveMonitor.Services.NotifierService',
                '$window',
                '$timeout'
            ];
            return AccountController;
        }());
        Account.AccountController = AccountController;
        angular
            .module('LiveMonitor.Account')
            .controller('AccountController', AccountController);
    })(Account = LiveMonitor.Account || (LiveMonitor.Account = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=account.controller.js.map