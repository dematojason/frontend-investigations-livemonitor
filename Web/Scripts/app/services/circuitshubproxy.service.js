var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        'use strict';
        var CircuitsHubProxyService = /** @class */ (function () {
            function CircuitsHubProxyService(_$rootScope, _$q, _logService) {
                this._$rootScope = _$rootScope;
                this._$q = _$q;
                this._logService = _logService;
                this._hubConnection = $.hubConnection();
                this.initialize();
                this._hubConnection.error(function (err) {
                    // TODO JRD: Handle Generic Error
                    console.log(err);
                });
            }
            CircuitsHubProxyService.prototype.initialize = function () {
                var _this = this;
                this.circuitsHubProxy = this._hubConnection.createHubProxy(LiveMonitor.Constants.circuitsHubName);
                this.circuitsHubProxy.on(LiveMonitor.Constants.signalREventNames.onConnected, function (connectionId) {
                    _this.connected = true;
                    _this.connectionId = connectionId;
                });
                this.circuitsHubProxy.on(LiveMonitor.Constants.signalREventNames.onConnected, function () {
                    _this.connected = false;
                    _this.connectionId = null;
                });
                this.circuitsHubProxy.on(LiveMonitor.Constants.signalREventNames.onAddCallStartMsg, function (msg) { return _this.broadcastAddCallStartMsg(msg); });
                this.circuitsHubProxy.on(LiveMonitor.Constants.signalREventNames.onAddCallEndMsg, function (msg) { return _this.broadcastAddCallEndMsg(msg); });
                this.circuitsHubProxy.on(LiveMonitor.Constants.signalREventNames.onRedirectToLogin, function () { return _this.broadcastRedirectToLogin(); });
                this.circuitsHubProxy.on(LiveMonitor.Constants.signalREventNames.onRemoveAllMessages, function () { return _this.broadcastRemoveAllMessages(); });
                // Connect to hub
                // TODO Find a way to not have to change below value when testing locally (transport: ['webSockets'] -or- transport: ['longPolling'])
                this._hubConnection.start({ jsonp: true, transport: ['webSockets', 'longPolling'] })
                    .done(function () {
                    _this.broadcastConnected();
                })
                    .fail(function (err) {
                    //const lmErr: SignalRError = new SignalRError(err, 'Unable to connect to Signal-R hub');
                    _this._logService.logError('Unable to connect to Signal-R hub', err);
                    console.log(err);
                });
                //{ transport: ['webSockets'] }
                //this._hubConnection.start({jsonp: true})
                //	.done((): void => {
                //		this.broadcastConnected();
                //	})
                //	.fail((err: Object): void => {
                //		//const lmErr: SignalRError = new SignalRError(err, 'Unable to connect to Signal-R hub');
                //		this._logService.logError('Unable to connect to Signal-R hub', err);
                //		console.log(err);
                //	});
            };
            CircuitsHubProxyService.prototype.addCallStartMsg = function (msg) {
                var deferred = this._$q.defer();
                this.circuitsHubProxy.invoke(LiveMonitor.Constants.signalREventNames.addCallStartMsg, msg)
                    .done(function () {
                    deferred.resolve();
                })
                    .fail(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            CircuitsHubProxyService.prototype.addCallEndMsg = function (msg) {
                var deferred = this._$q.defer();
                this.circuitsHubProxy.invoke(LiveMonitor.Constants.signalREventNames.addCallEndMsg, msg)
                    .done(function () {
                    deferred.resolve();
                })
                    .fail(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            CircuitsHubProxyService.prototype.getRtcmMessages = function () {
                var deferred = this._$q.defer();
                this.circuitsHubProxy.invoke(LiveMonitor.Constants.signalREventNames.getRtcmMessages)
                    .done(function (messages) {
                    deferred.resolve(messages);
                })
                    .fail(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            CircuitsHubProxyService.prototype.removeAllMessages = function () {
                var deferred = this._$q.defer();
                this.circuitsHubProxy.invoke(LiveMonitor.Constants.signalREventNames.removeAllMessages)
                    .done(function () {
                    deferred.resolve();
                })
                    .fail(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            CircuitsHubProxyService.prototype.broadcastConnected = function () {
                this._$rootScope.$broadcast(LiveMonitor.Constants.signalREventNames.onConnected, { connectionId: this._hubConnection.id });
            };
            CircuitsHubProxyService.prototype.broadcastAddCallStartMsg = function (msg) {
                this._$rootScope.$broadcast(LiveMonitor.Constants.signalREventNames.onAddCallStartMsg, { msg: msg });
            };
            CircuitsHubProxyService.prototype.broadcastAddCallEndMsg = function (msg) {
                this._$rootScope.$broadcast(LiveMonitor.Constants.signalREventNames.onAddCallEndMsg, { msg: msg });
            };
            CircuitsHubProxyService.prototype.broadcastRedirectToLogin = function () {
                this._hubConnection.stop(); // stop the connection so that it is recreated after login.
                this._$rootScope.logout();
            };
            CircuitsHubProxyService.prototype.broadcastRemoveAllMessages = function () {
                this._$rootScope.$broadcast(LiveMonitor.Constants.signalREventNames.onRemoveAllMessages);
            };
            CircuitsHubProxyService.$inject = [
                '$rootScope',
                '$q',
                'LiveMonitor.Services.LogService'
            ];
            return CircuitsHubProxyService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.CircuitsHubProxyService', CircuitsHubProxyService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=circuitshubproxy.service.js.map