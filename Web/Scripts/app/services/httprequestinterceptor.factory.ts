namespace LiveMonitor {
	export class HttpRequestInterceptor {
		public static factory(
			$q: ng.IQService,
			$rootScope: ng.IRootScopeService,
			$window: ng.IWindowService
		): HttpRequestInterceptor {
			return new HttpRequestInterceptor($q, $rootScope, $window);
		}

		constructor(
			private readonly _$q: ng.IQService,
			private readonly _$rootScope: ng.IRootScopeService,
			private readonly _$window: ng.IWindowService
		) {
		}

		public request = (requestConfig: angular.IRequestConfig): ng.IRequestConfig => {
			return requestConfig;
		}

		public response = (response: any) => {
			// Hacky way of handling this...
			// This should determine whether or not the response from the server is a redirect response to the login page.
			if (typeof response.data === 'string' && response.data.indexOf('ng-controller="AccountController as vm"') !== -1) {
				// Handle the redirect to the login page through calling logout function.
				this._$rootScope.logout();
				return this._$q.reject(response);
			}

			return this._$q.when(response);
		}
	}

	angular
		.module('LiveMonitor')
		.factory('LiveMonitor.HttpRequestInterceptor', HttpRequestInterceptor);
}