namespace LiveMonitor.Home {
	'use strict';

	interface IHomeController {
		title: string;

		hasPermission(permission: string): boolean;
	}

	export class HomeController implements IHomeController {
		public title: string = 'Home';
		public showNoPermissionMsg: boolean = false;


		$onInit = (): void => { };

		static $inject = [
			'$rootScope'
		];
		constructor(
			private readonly _$rootScope: ng.IRootScopeService
		) {
			if (!this.hasPermission('Live_Monitor_View')) {
				this.showNoPermissionMsg = true;
			}
		}


		public hasPermission(permission: string): boolean {
			return this._$rootScope.hasPermission(permission);
		}
	}

	angular
		.module('LiveMonitor.Home')
		.controller('HomeController', HomeController);
}