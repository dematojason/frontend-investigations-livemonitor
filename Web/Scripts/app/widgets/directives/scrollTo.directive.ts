namespace LiveMonitor.Widgets {
	class ScrollTo implements ng.IDirective {
		restrict = 'A';


		link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelCtrl: any): void => {
			const idToScroll = attrs.scrollTo;
			element.on('click',
				(): void => {
					$(`${idToScroll}`)[0].scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
				});
		};

		static factory(): ng.IDirectiveFactory {
			const directive = () => new ScrollTo();
			directive.$inject = [];
			return directive;
		}
	}

	angular
		.module('LiveMonitor.Widgets')
		.directive('scrollTo', ScrollTo.factory());
}