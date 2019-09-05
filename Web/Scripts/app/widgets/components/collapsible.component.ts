namespace LiveMonitor.Widgets {
	(() => {
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
			vm.$onInit = () => {
				vm.collapsed = false;
				vm.textHideShow = 'Hide';
				vm.uniqueId = CommonHelper.getUniqueId(UniqueIdType.COLLAPSIBLE);
			}

			vm.$postLink = () => {
				if (CommonHelper.isDefined(vm.default)) {
					if (vm.default === 'collapsed') {
						vm.expandCollapse();
					}
				}
			}

			vm.expandCollapse = () => {
				if (vm.toggling) {
					return;
				}

				vm.toggling = true;

				$timeout(() => {
					$(`#${vm.targetId}`).slideToggle(
						{
							duration: 500,
							complete: () => {
								$timeout(() => {
									vm.collapsed = !vm.collapsed;

									if (vm.collapsed) {
										vm.textHideShow = 'Show';
									} else {
										vm.textHideShow = 'Hide';
									}
								});
							},
							always: () => {
								vm.toggling = false;
							}
						}
					);
				});
			}
		}
	})();
}