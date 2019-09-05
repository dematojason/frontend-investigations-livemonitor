var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        (function () {
            'use strict';
            angular.module('LiveMonitor.Widgets').component('multiselect', {
                bindings: {
                    disabled: '<?',
                    model: '=',
                    options: '=',
                    onOptionsChanged: '&'
                },
                controller: ['$scope', '$timeout', multiselectController],
                controllerAs: 'vm',
                templateUrl: 'Templates/components/multiselect.html'
            });
            function multiselectController($scope, $timeout) {
                var vm = this;
                vm.dropdownBtnText = 'Select';
                vm.selectedCount = 0;
                vm.expanded = false;
                vm.talkingStickInUse = false;
                vm.uniqueId = '';
                vm.search = '';
                // Private Variables
                // Public Functions
                vm.$onInit = function () {
                    vm.uniqueId = "multiselect" + LiveMonitor.CommonHelper.getUniqueId(LiveMonitor.UniqueIdType.MULTISELECT);
                    $scope.$watch(function () { return vm.search; }, function (oldValue, newValue) {
                        if (oldValue !== newValue) {
                            vm.onSearchChanged();
                        }
                    });
                    // If user clicks outside of multiselect dropdown, collapse the options.
                    $(document).bind('click', function (event) {
                        if (!vm.expanded) {
                            return;
                        }
                        var isClickedEleChildOfThis = $("#" + vm.uniqueId).find(event.target).length > 0;
                        if (isClickedEleChildOfThis) {
                            return;
                        }
                        $scope.$apply(function () {
                            vm.search = '';
                            vm.expanded = false;
                        });
                    });
                };
                vm.$postLink = function () {
                    // Update button text with passed option values.
                    for (var i = 0; i < vm.options.length; i++) {
                        if (vm.options[i].selected) {
                            vm.selectedCount++;
                        }
                    }
                    vm.selectedCountChanged();
                };
                vm.onSearchChanged = _.debounce(updateDisplayedOptions, 200);
                vm.showOptions = function () {
                    if (vm.expanded) {
                        vm.expanded = false;
                    }
                    else {
                        vm.expanded = true;
                    }
                };
                vm.selectedCountChanged = function () {
                    var text = 'Select';
                    if (vm.selectedCount !== undefined && vm.selectedCount !== null) {
                        if (vm.selectedCount > 0) {
                            text = vm.selectedCount + " Selected";
                        }
                    }
                    $timeout(function () {
                        vm.dropdownBtnText = text;
                    }, 10);
                    vm.onOptionsChanged();
                };
                // Item changes through checkAll() and uncheckAll() will not call this function.
                vm.itemChanged = function (newVal) {
                    if (newVal === true) {
                        incrementCount();
                    }
                    else if (newVal === false) {
                        decrementCount();
                    }
                };
                vm.checkAll = function () {
                    if (vm.talkingStickInUse) {
                        return;
                    }
                    vm.talkingStickInUse = true;
                    for (var i = 0; i < vm.options.length; i++) {
                        vm.options[i].selected = true;
                    }
                    vm.selectedCount = vm.options.length;
                    vm.selectedCountChanged();
                    vm.talkingStickInUse = false;
                };
                vm.uncheckAll = function () {
                    if (vm.talkingStickInUse) {
                        return;
                    }
                    vm.talkingStickInUse = true;
                    for (var i = 0; i < vm.options.length; i++) {
                        vm.options[i].selected = false;
                    }
                    vm.selectedCount = 0;
                    vm.selectedCountChanged();
                    vm.talkingStickInUse = false;
                };
                // Private Functions
                function incrementCount() {
                    vm.selectedCount++;
                    vm.selectedCountChanged();
                }
                function decrementCount() {
                    vm.selectedCount--;
                    vm.selectedCountChanged();
                }
                function updateDisplayedOptions() {
                    if (vm.search === null || vm.search === undefined) {
                        return;
                    }
                    if (vm.search === '') {
                        $scope.$apply(function () {
                            for (var i = 0; i < vm.options.length; i++) {
                                vm.options[i].hidden = false;
                            }
                        });
                    }
                    else {
                        $scope.$apply(function () {
                            for (var i = 0; i < vm.options.length; i++) {
                                vm.options[i].hidden = (vm.options[i].label.toLowerCase().indexOf(vm.search.toLowerCase()) === -1);
                            }
                        });
                    }
                }
            }
        })();
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=multiselect.component.js.map