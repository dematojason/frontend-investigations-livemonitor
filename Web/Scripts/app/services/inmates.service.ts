namespace LiveMonitor.Services {
	'use strict';

	export interface IInmateService {
		/**
		 * Gets an array of inmate accounts.
		 * @param search The value to search by. Either inmate name, account #, or doc ID.
		 * @param siteList The site IDs to filter by.
		 * @augments IInmateService
		 */
		getInmates(search: string, siteList: Array<string> | null): ng.IPromise<Array<InmateAccount> | undefined>;
	}

	class InmateService implements IInmateService {
		private _baseUrl: string = '/api/inmates';

		static $inject = ['$http'];
		constructor(private readonly _$http: ng.IHttpService) {
		}

		public getInmates(search: string, siteList: Array<string> | null): ng.IPromise<Array<InmateAccount> | undefined> {
			const args: GetInmateArgs = new GetInmateArgs();
			args.search = search;
			args.siteIds = siteList;

			return this._$http.post(`${this._baseUrl}/load`, args)
				.then((response: ng.IHttpPromiseCallbackArg<Array<InmateAccount>>): Array<InmateAccount> | undefined => {
					return response.data;
				});
		}
	}

	class GetInmateArgs {
		public siteIds: Array<string> | null;
		public search: string;
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.InmateService', InmateService);
}