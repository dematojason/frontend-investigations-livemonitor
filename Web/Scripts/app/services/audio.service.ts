namespace LiveMonitor.Services {

	export interface IAudioService {
		disconnectCall(ani: string): ng.IPromise<void>;
		//requestMonitorStart(args: MonitorRequestArgs): ng.IPromise<void>;
		requestMonitorEnd(args: MonitorRequestArgs): ng.IPromise<void>;
		stopLiveStream(): ng.IPromise<void>;
	}

	class AudioService implements IAudioService {
		private readonly _baseUri: string = '/api/audio';

		static $inject = ['$http'];
		constructor(private readonly _$http: ng.IHttpService) {
		}


		public disconnectCall(ani: string): ng.IPromise<void> {
			return this._$http.post(`${this._baseUri}/disconnect-call?ani=${ani}`, null)
				.then((response: any): void => {
					return response.data;
				});
		}

		//public requestMonitorStart(args: MonitorRequestArgs): ng.IPromise<void> {
		//	return this._$http.post(`${this._baseUri}/live-stream/request-monitor-start`, args)
		//		.then((response: any): void => {
		//			return response.data;
		//		});
		//}

		public requestMonitorEnd(args: MonitorRequestArgs): ng.IPromise<void> {
			return this._$http.post(`${this._baseUri}/live-stream/request-monitor-end`, args)
				.then((response: any): void => {
					return response.data;
				});
		}

		public stopLiveStream(): ng.IPromise<void> {
			return this._$http.post(`${this._baseUri}/live-stream/stop`, null)
				.then((response: any): void => {
					return response.data;
				});
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.AudioService', AudioService);
}