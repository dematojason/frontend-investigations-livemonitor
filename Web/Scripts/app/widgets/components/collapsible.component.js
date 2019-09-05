var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        (function () {
            'use strict';
            angular.module('LiveMonitor.Widgets').component('collapsible', {
                bindings: {
                    default: '@?',
                    targetId: '@',
                    text: '@'
                },
                controller: ['$timeout', collapsibleController],
                controllerAs: 'vm',
                templateUrl: 'Templates/components/collapsible.html'
            });
            function collapsibleController($timeout) {
                var vm = this;
                vm.toggling = false;
                vm.uniqueId = null;
                vm.collapsed = false;
                vm.textHideShow = '';
                // Private Variables
                // Public Functions
                vm.$onInit = function () {
                    vm.collapsed = false;
                    vm.textHideShow = 'Hide';
                    vm.uniqueId = LiveMonitor.CommonHelper.getUniqueId(LiveMonitor.UniqueIdType.COLLAPSIBLE);
                };
                vm.$postLink = function () {
                    if (LiveMonitor.CommonHelper.isDefined(vm.default)) {
                        if (vm.default === 'collapsed') {
                            vm.expandCollapse();
                        }
                    }
                };
                vm.expandCollapse = function () {
                    if (vm.toggling) {
                        return;
                    }
                    vm.toggling = true;
                    $timeout(function () {
                        $("#" + vm.targetId).slideToggle({
                            duration: 500,
                            complete: function () {
                                $timeout(function () {
                                    vm.collapsed = !vm.collapsed;
                                    if (vm.collapsed) {
                                        vm.textHideShow = 'Show';
                                    }
                                    else {
                                        vm.textHideShow = 'Hide';
                                    }
                                });
                            },
                            always: function () {
                                vm.toggling = false;
                            }
                        });
                    });
                };
            }
        })();
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=collapsible.component.js.map