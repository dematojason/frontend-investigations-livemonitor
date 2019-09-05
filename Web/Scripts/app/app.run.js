(function () {
    'use strict';
    angular
        .module('LiveMonitor')
        .run(run);
    run.$inject = [
        '$rootScope',
        '$window',
        'LiveMonitor.Services.AccountService'
    ];
    function run($rootScope, $window, accountService) {
        $rootScope.permissions = [];
        $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
            if (oldUrl.endsWith('/#!/circuits') && !newUrl.endsWith('/#!/circuits')) {
                $rootScope.$broadcast('liveMonitor.locationChangeStart.leavingCircuits');
            }
        });
        function setPermissions() {
            if ($rootScope.permissions === undefined || $rootScope.permissions === null || $rootScope.permissions.length === 0) {
                var permissionStr = $window.localStorage.getItem('liveMonitor.permissions');
                if (permissionStr === undefined || permissionStr === null || permissionStr === '') {
                    $rootScope.permissions = [];
                }
                $rootScope.permissions = JSON.parse(permissionStr);
            }
            ;
        }
        $rootScope.hasPermission = function (permission) {
            setPermissions();
            if ($rootScope.permissions === null || $rootScope.permissions === undefined) {
                return false;
            }
            for (var i = 0; i < $rootScope.permissions.length; i++) {
                if ($rootScope.permissions[i] === permission) {
                    return true;
                }
            }
            return false;
        };
        $rootScope.logout = function () {
            accountService.logout()
                .then(function () {
                $window.localStorage.removeItem('liveMonitor.isMilitaryDisplay');
                $window.localStorage.removeItem('liveMonitor.permissions');
                $rootScope.loggedIn = false;
                $window.location.assign('/account/login');
            }, function () {
                $window.localStorage.removeItem('liveMonitor.isMilitaryDisplay');
                $window.localStorage.removeItem('liveMonitor.permissions');
                $rootScope.loggedIn = false;
                $window.location.assign('/account/login');
            });
        };
    }
})();
//# sourceMappingURL=app.run.js.map