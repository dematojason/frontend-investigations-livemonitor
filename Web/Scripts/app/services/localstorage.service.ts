namespace LiveMonitor.Services {
	'use strict';

	export interface ILocalStorageService {
		getIsMilitaryDisplay(): boolean;
		getIsLoggedIn(): boolean;
		getPermissions(): string[];
		hasPermission(permission: string): boolean;
	}

	class LocalStorageService implements ILocalStorageService {
		static $inject = [
			'$window'
		];
		constructor(
			private readonly _$window: ng.IWindowService
		) {
		}

		public getIsMilitaryDisplay(): boolean {
			const isMilitaryDisplay: string | null = this._$window.localStorage.getItem('liveMonitor.isMilitaryDisplay');
			if (isMilitaryDisplay === undefined || isMilitaryDisplay === null) {
				return false;
			}

			return (isMilitaryDisplay.toLowerCase() === 'true');
		}

		public getIsLoggedIn(): boolean {
			const loggedIn: string | null = this._$window.localStorage.getItem('liveMonitor.loggedIn');
			if (loggedIn === undefined || loggedIn === null) {
				return false;
			}

			return (loggedIn.toLowerCase() === 'true');
		}

		public getPermissions(): string[] {
			const permissionStr: string | null = this._$window.localStorage.getItem('liveMonitor.permissions');

			if (CommonHelper.isNullUndefOrBlank(permissionStr)) {
				return [];
			}

			return JSON.parse(permissionStr as string);
		}

		public hasPermission(permission: string): boolean {
			const permissions: string[] = this.getPermissions();

			for (let i = 0; i < permissions.length; i++) {
				if (permissions[i] === permission) {
					return true;
				}
			}

			return false;
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.LocalStorageService', LocalStorageService);
}