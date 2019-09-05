namespace LiveMonitor.Services {
	'use strict';

	export interface IUserApiService {
		/**
		 * Gets an array of the current user's facilities as <siteId, name>.
		 */
		getFacilities(): ng.IPromise<Array<any> | undefined>;
	}

	class UserApiService implements IUserApiService {
		private _baseUrl: string = '/api/users';

		static $inject = ['$http'];
		constructor(private readonly _$http: ng.IHttpService) {
		}

		public getFacilities(): ng.IPromise<Array<any> | undefined> {
			return this._$http.get(`${this._baseUrl}/facilities`)
				.then((response: ng.IHttpPromiseCallbackArg<Array<any>>): Array<any> | undefined => {
					return response.data;
				});
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.UserApiService', UserApiService);
}