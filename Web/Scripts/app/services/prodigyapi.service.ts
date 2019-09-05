namespace LiveMonitor.Services {
	'use strict';

	export interface IProdigyApiService {
		/**
		 * Gets an array of circuits.
		 * @param siteList The site IDs to filter by.
		 * @augments IProdigyApiService
		 */
		getCircuits(siteList: Array<string>): ng.IPromise<Array<CircuitDto> | undefined>;
	}

	class ProdigyApiService implements IProdigyApiService {
		private _baseUrl: string = '/api/circuits';

		static $inject = ['$http'];
		constructor(private readonly _$http: ng.IHttpService) {
		}

		public getCircuits(siteList: Array<string>): ng.IPromise<Array<CircuitDto> | undefined> {
			const args: GetCircuitArgs = new GetCircuitArgs();
			args.siteList = siteList;

			return this._$http.post(`${this._baseUrl}/get-circuits`, args)
				.then((response: ng.IHttpPromiseCallbackArg<Array<CircuitDto>>): Array<CircuitDto> | undefined => {
					return response.data;
				});
		}
	}

	class GetCircuitArgs extends ProdigyApiArgs {
		public aniList: Array<string>;
		public siteList: Array<string>;
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.ProdigyApiService', ProdigyApiService);
}