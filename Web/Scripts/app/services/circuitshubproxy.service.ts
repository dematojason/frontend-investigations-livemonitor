namespace LiveMonitor.Services {
	'use strict';

	export interface ICircuitsHubProxyService {
		circuitsHubProxy: HubProxy;
		connected: boolean;
		connectionId: string | null;

		addCallStartMsg(msg: EventCallStartMsg): ng.IPromise<void>;
		addCallEndMsg(msg: EventCallEndMsg): ng.IPromise<void>;
		getRtcmMessages(): ng.IPromise<Array<IRtcmMsg>>;
		removeAllMessages(): ng.IPromise<void>;
	}

	class CircuitsHubProxyService implements ICircuitsHubProxyService {
		private _hubConnection: HubConnection = $.hubConnection();

		public circuitsHubProxy: HubProxy;
		public connected: boolean;
		public connectionId: string | null;

		static $inject = [
			'$rootScope',
			'$q',
			'LiveMonitor.Services.LogService'
		];
		constructor(
			private readonly _$rootScope: ng.IRootScopeService,
			private readonly _$q: ng.IQService,
			private readonly _logService: Services.ILogService
		) {
			this.initialize();
			this._hubConnection.error((err) => {
				// TODO JRD: Handle Generic Error
				console.log(err);
			});
		}


		private initialize(): void {
			this.circuitsHubProxy = this._hubConnection.createHubProxy(Constants.circuitsHubName);

			this.circuitsHubProxy.on(Constants.signalREventNames.onConnected,
				(connectionId: string): void => {
					this.connected = true;
					this.connectionId = connectionId;
				});
			this.circuitsHubProxy.on(Constants.signalREventNames.onConnected,
				(): void => {
					this.connected = false;
					this.connectionId = null;
				});
			this.circuitsHubProxy.on(Constants.signalREventNames.onAddCallStartMsg, (msg): void => this.broadcastAddCallStartMsg(msg));
			this.circuitsHubProxy.on(Constants.signalREventNames.onAddCallEndMsg, (msg): void => this.broadcastAddCallEndMsg(msg));
			this.circuitsHubProxy.on(Constants.signalREventNames.onRedirectToLogin, (): void => this.broadcastRedirectToLogin());
			this.circuitsHubProxy.on(Constants.signalREventNames.onRemoveAllMessages, (): void => this.broadcastRemoveAllMessages());

			// Connect to hub
			// TODO Find a way to not have to change below value when testing locally (transport: ['webSockets'] -or- transport: ['longPolling'])
			this._hubConnection.start({ jsonp: true, transport: ['webSockets', 'longPolling'] })
				.done((): void => {
					this.broadcastConnected();
				})
				.fail((err: Object): void => {
					//const lmErr: SignalRError = new SignalRError(err, 'Unable to connect to Signal-R hub');
					this._logService.logError('Unable to connect to Signal-R hub', err);
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
		}

		public addCallStartMsg(msg: EventCallStartMsg): ng.IPromise<void> {
			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			this.circuitsHubProxy.invoke(Constants.signalREventNames.addCallStartMsg, msg)
				.done((): void => {
					deferred.resolve();
				})
				.fail((err): void => {
					deferred.reject(err);
				});

			return deferred.promise;
		}

		public addCallEndMsg(msg: EventCallEndMsg): ng.IPromise<void> {
			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			this.circuitsHubProxy.invoke(Constants.signalREventNames.addCallEndMsg, msg)
				.done((): void => {
					deferred.resolve();
				})
				.fail((err: Object): void => {
					deferred.reject(err);
				});

			return deferred.promise;
		}

		public getRtcmMessages(): ng.IPromise<Array<IRtcmMsg>> {
			const deferred: ng.IDeferred<Array<IRtcmMsg>> = this._$q.defer<Array<IRtcmMsg>>();

			this.circuitsHubProxy.invoke(Constants.signalREventNames.getRtcmMessages)
				.done((messages): void => {
					deferred.resolve(messages);
				})
				.fail((err): void => {
					deferred.reject(err);
				});

			return deferred.promise;
		}

		public removeAllMessages(): ng.IPromise<void> {
			const deferred: ng.IDeferred<void> = this._$q.defer<void>();

			this.circuitsHubProxy.invoke(Constants.signalREventNames.removeAllMessages)
				.done((): void => {
					deferred.resolve();
				})
				.fail((err): void => {
					deferred.reject(err);
				});

			return deferred.promise;
		}

		private broadcastConnected(): void {
			this._$rootScope.$broadcast(Constants.signalREventNames.onConnected, { connectionId: this._hubConnection.id });
		}

		private broadcastAddCallStartMsg(msg: EventCallStartMsg): void {
			this._$rootScope.$broadcast(Constants.signalREventNames.onAddCallStartMsg, { msg: msg });
		}

		private broadcastAddCallEndMsg(msg: EventCallEndMsg): void {
			this._$rootScope.$broadcast(Constants.signalREventNames.onAddCallEndMsg, { msg: msg });
		}

		private broadcastRedirectToLogin(): void {
			this._hubConnection.stop(); // stop the connection so that it is recreated after login.
			this._$rootScope.logout();
		}

		private broadcastRemoveAllMessages(): void {
			this._$rootScope.$broadcast(Constants.signalREventNames.onRemoveAllMessages);
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.CircuitsHubProxyService', CircuitsHubProxyService);
}