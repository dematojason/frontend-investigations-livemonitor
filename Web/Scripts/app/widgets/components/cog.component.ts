namespace LiveMonitor.Widgets {
	interface ICogBindings {
		addClasses: string;
		color: string;
		faSize: string;
	}

	class CogComponent implements ng.IComponentOptions {
		public bindings: any;
		public controller: any;
		public controllerAs: string;
		public templateUrl: string;

		constructor() {
			this.bindings = {
				addClasses: '@?',
				color: '@?',
				faSize: '@?'
			};
			this.controller = CogController;
			this.controllerAs = 'vm';
			this.templateUrl = 'Templates/components/cog.html';
		}
	}

	class CogController implements ICogBindings {
		public addClasses: string;
		public color: string;
		public faSize: string;

		public style: any;


		constructor() {
			this.addClasses = '';
			this.color = 'white';
			this.faSize = '3x';
		}

		$onChanges(changes) {
			if (changes.color) {
				this.style = { color: this.color };
			}
		}
	}

	angular
		.module('LiveMonitor.Widgets')
		.component('cog', new CogComponent());
}