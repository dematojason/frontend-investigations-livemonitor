(function () {
    'use strict';
    config.$inject = [
        '$routeProvider',
        '$locationProvider'
    ];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
            templateUrl: '/Templates/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
            .when('/dashboard', {
            templateUrl: '/Templates/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
        })
            .when('/circuits', {
            templateUrl: '/Templates/circuits.html',
            controller: 'CircuitListController',
            controllerAs: 'vm'
        })
            .otherwise({ redirectTo: '/' });
    }
    configToastr.$inject = [
        'toastrConfig'
    ];
    function configToastr(toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: true,
            target: 'body'
        });
        angular.extend(toastrConfig, {
            allowHtml: false,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            onHidden: null,
            onShown: null,
            onTap: null,
            progressBar: true,
            tapToDismiss: true,
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    }
    angular
        .module('LiveMonitor')
        .config(config)
        .config(configToastr)
        .config(function ($httpProvider) {
        $httpProvider.interceptors.push(LiveMonitor.HttpRequestInterceptor.factory);
    });
})();
//# sourceMappingURL=app.config.js.map