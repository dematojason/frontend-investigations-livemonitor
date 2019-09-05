namespace LiveMonitor.Widgets {
	class Autofocus implements ng.IDirective {
		restrict = 'A';


		static $inject = ['$timeout'];
		constructor(private readonly _$timeout: ng.ITimeoutService) {
		}

		link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelCtrl: any): void => {
			this._$timeout((): void => {
				element[0].focus();
			}, 200);
		};

		static factory(): ng.IDirectiveFactory {
			const directive = ($timeout: ng.ITimeoutService) => new Autofocus($timeout);
			directive.$inject = ['$timeout'];
			return directive;
		}
	}

	angular
		.module('LiveMonitor.Widgets')
		.directive('autofocus', Autofocus.factory());
}