namespace LiveMonitor.Services {
	'use strict';

	export interface IDashboardService {
		getRtcmMessages(): ng.IPromise<Array<IRtcmMsg> | undefined>;
	}

	class DashboardService implements IDashboardService {
		static $inject = ['$http'];
		constructor(private readonly _$http: ng.IHttpService) {
		}

		public getRtcmMessages(): ng.IPromise<Array<IRtcmMsg> | undefined> {
			return this._$http.get(`/api/circuits/rtcm-messages`)
				.then((response: ng.IHttpPromiseCallbackArg<Array<IRtcmMsg> | undefined>): Array<IRtcmMsg> | undefined => {
					return response.data;
				});
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.DashboardService', DashboardService);
}