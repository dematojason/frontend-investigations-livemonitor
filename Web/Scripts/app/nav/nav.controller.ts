namespace LiveMonitor.Nav {
	'use strict';

	interface INavScope {
		logout(): void;
		hasPermission(permission: string): boolean;
	}

	export class NavController implements INavScope {

		$onInit = (): void => { };

		static $inject = [
			'$rootScope'
		];
		constructor(
			private readonly _$rootScope: ng.IRootScopeService
		) {
		}

		public logout(): void {
			this._$rootScope.logout();
		}

		public hasPermission(permission: string): boolean {
			return this._$rootScope.hasPermission(permission);
		}
	}

	angular
		.module('LiveMonitor.Nav')
		.controller('NavController', NavController);
}