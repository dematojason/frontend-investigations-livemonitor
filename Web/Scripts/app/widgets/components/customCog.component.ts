namespace LiveMonitor.Widgets {
	(() => {
		'use strict';

		angular.module('LiveMonitor.Widgets').component('customCog', {
			bindings: {
				imgSrc: '@?'
			},
			controller: ['$scope', '$timeout', customCogController],
			controllerAs: 'vm',
			templateUrl: 'Templates/components/customCog.html'
		});

		function customCogController($scope, $timeout) {
			var vm = this;


			// Private Variables
			const id = '#customLoadingImg';


			// Public Functions
			vm.$onInit = () => {
				loop();
			}

			function loop() {
				$({ deg: 0 }).animate({ deg: 360 }, {
					duration: 5000, easing: 'linear',
					step: (now) => {
						$(id).css({ transform: 'rotate(' + now + 'deg)' });
					},
					complete: () => {
						loop();
					}
				});
			}
		}
	})();
}