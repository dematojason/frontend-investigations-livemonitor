((): void => {
	'use strict';

	class OnlyDigits implements ng.IDirective {
		restrict = 'A';
		require = '?ngModel';
		replace = true;

		static $inject = ['$scope'];
		constructor(private readonly _$scope: ng.IScope) {
			console.log(this._$scope);
		}

		link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelCtrl: any): void => {
			var fromUser = (text: string): string | null => {
				if (text) {
					const transformedInput = text.replace(/[^0-9]/g, '');

					if (transformedInput !== text) {
						ngModelCtrl.$setViewValue(transformedInput);
						ngModelCtrl.$render();
					}

					return transformedInput;
				}

				return null;
			};

			ngModelCtrl.$parsers.push(fromUser);
		};

		static factory(): ng.IDirectiveFactory {
			const directive = ($scope: ng.IScope) => new OnlyDigits($scope);
			directive.$inject = ['$scope'];
			return directive;
		}
	}

	angular
		.module('LiveMonitor.Widgets')
		.directive('lmOnlyDigits', OnlyDigits.factory());
})();