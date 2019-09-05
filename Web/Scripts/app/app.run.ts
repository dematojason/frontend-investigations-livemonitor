((): void => {
	'use strict';

	angular
		.module('LiveMonitor')
		.run(run);

	run.$inject = [
		'$rootScope',
		'$window',
		'LiveMonitor.Services.AccountService'
	];
	function run(
		$rootScope: ng.IRootScopeService,
		$window: ng.IWindowService,
		accountService: LiveMonitor.Services.IAccountService
	): void {
		$rootScope.permissions = [];

		$rootScope.$on('$locationChangeStart',
			(event, newUrl, oldUrl): void => {
				if (oldUrl.endsWith('/#!/circuits') && !newUrl.endsWith('/#!/circuits')) {
					$rootScope.$broadcast('liveMonitor.locationChangeStart.leavingCircuits');
				}
			});

		function setPermissions(): void {
			if ($rootScope.permissions === undefined || $rootScope.permissions === null || $rootScope.permissions.length === 0) {
				const permissionStr: string | null = $window.localStorage.getItem('liveMonitor.permissions');
				if (permissionStr === undefined || permissionStr === null || permissionStr === '') {
					$rootScope.permissions = [];
				}

				$rootScope.permissions = JSON.parse(permissionStr as string);
			};
		}

		$rootScope.hasPermission = (permission: string): boolean => {
			setPermissions();
			if ($rootScope.permissions === null || $rootScope.permissions === undefined) {
				return false;
			}

			for (let i = 0; i < $rootScope.permissions.length; i++) {
				if ($rootScope.permissions[i] === permission) {
					return true;
				}
			}

			return false;
		}

		$rootScope.logout = (): void => {
			accountService.logout()
				.then((): void => {
					$window.localStorage.removeItem('liveMonitor.isMilitaryDisplay');
					$window.localStorage.removeItem('liveMonitor.permissions');

					$rootScope.loggedIn = false;
					$window.location.assign('/account/login');
				}, (): void => {
					$window.localStorage.removeItem('liveMonitor.isMilitaryDisplay');
					$window.localStorage.removeItem('liveMonitor.permissions');

					$rootScope.loggedIn = false;
					$window.location.assign('/account/login');
				});
		}
	}
})();