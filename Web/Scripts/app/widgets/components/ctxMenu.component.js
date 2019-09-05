var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        (() => {
            'use strict';
            angular.module('LiveMonitor.Widgets').component('ctxMenu', {
                bindings: {
                    listItems: '<',
                    uniqueId: '@'
                },
                controller: ['$scope', '$timeout', ctxMenuController],
                controllerAs: 'vm',
                templateUrl: 'Templates/components/ctxMenu.html'
            });
            function ctxMenuController($scope, $timeout) {
                var vm = this;
                vm.loaded = false;
                vm.ctxMenuShowing = false;
                vm.example = [
                    {
                        clickFunc: () => { console.log('Example object 1 click func.'); },
                        typeClass: 'option',
                        label: 'Example One'
                    },
                    {
                        clickFunc: () => { console.log('Example object 2 click func.'); },
                        typeClass: 'option',
                        label: 'Example Two'
                    },
                    {
                        typeClass: 'divider'
                    },
                    {
                        clickFunc: () => { console.log('Example object 4 click func.'); },
                        typeClass: 'option',
                        label: 'Example Four'
                    }
                ];
                // Private Variables
                // Public Functions
                vm.$onInit = () => {
                    $scope.$on(`${vm.uniqueId}Open`, ($event) => {
                        if ($event.which === 3) {
                            $event.preventDefault();
                            toggleMenu('show', $event);
                        }
                    });
                };
                vm.$postLink = () => {
                    vm.loaded = true;
                };
                function toggleMenu(action, $event) {
                    const ctxMenu = $(`#${vm.uniqueId}`)[0];
                    if (action === 'show') {
                        if (vm.ctxMenuShowing) {
                            return;
                        }
                        ctxMenu.style.display = 'block';
                        ctxMenu.style.left = `${$event.clientX}px`;
                        ctxMenu.style.top = `${$event.clientY}px`;
                        vm.ctxMenuShowing = true;
                    }
                    else if (vm.ctxMenuShowing) {
                        ctxMenu.style.display = 'none';
                        vm.ctxMenuShowing = false;
                    }
                }
            }
        })();
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=ctxMenu.component.js.map