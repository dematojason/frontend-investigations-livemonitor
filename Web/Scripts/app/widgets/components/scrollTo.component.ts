namespace LiveMonitor.Widgets {
	interface IScrollToBindings {
		scrollToId: string;
		txtBtn: string;
	}

	class ScrollToController implements IScrollToBindings {
		public scrollToId: string;
		public txtBtn: string;

		constructor() {
			this.scrollToId = '';
			this.txtBtn = 'Scroll to Top';
		}
	}

	class ScrollToComponent implements ng.IComponentOptions {
		public bindings: any;
		public controller: any;
		public controllerAs: string;
		public templateUrl: string;


		constructor() {
			this.bindings = {
				scrollToId: '@',
				txtBtn: '@?'
			};
			this.controller = ScrollToController;
			this.controllerAs = 'vm';
			this.templateUrl = 'Templates/components/scrollto.html';
		}
	}

	angular
		.module('LiveMonitor.Widgets')
		.component('scrollTo', new ScrollToComponent());
}