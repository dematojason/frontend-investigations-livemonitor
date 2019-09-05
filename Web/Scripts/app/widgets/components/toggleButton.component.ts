namespace LiveMonitor.Widgets {
	interface IToggleButtonBindings {
		btnClick: () => any;
		disabled: boolean;
		imgSrc: string;
		titleText: string;
		toggleEnabled: boolean;
		type: string;
	}

	class ToggleButtonComponent implements ng.IComponentOptions {
		public bindings: any;
		public controller: any;
		public controllerAs: string;
		public templateUrl: string;

		constructor() {
			this.bindings = {
				btnClick: '&',
				imgSrc: '@',
				titleText: '@',
				toggleEnabled: '<?',
				type: '@?'
			};
			this.controller = ToggleButtonController;
			this.controllerAs = 'vm';
			this.templateUrl = 'Templates/components/toggleButton.html';
		}
	}

	class ToggleButtonController implements IToggleButtonBindings {
		public btnClick: () => any;
		public disabled: boolean;
		public imgSrc: string;
		public titleText: string;
		public toggleEnabled: boolean;
		public type: string;

		public uniqueId: string;

		private _def = {
			disabled: false
		};
		private _classActive = 'active';
		private _classDisabled = 'disabled';


		// lm-btn-toggle
		// lm-btn-standard
		static $inject = [
			'$scope',
			'$timeout'
		];
		constructor(
			private readonly _$scope: ng.IScope,
			private readonly _$timeout: ng.ITimeoutService
		) {
			//const id: number = CommonHelper.getUniqueId(UniqueIdType.ACTIVE_BUTTON);
			//this.uniqueId = `toggleButton${id}`;
			this.uniqueId = `toggleButton${CommonHelper.getUniqueId(UniqueIdType.ACTIVE_BUTTON)}`;
			this.disabled = this._def.disabled;

			this._$scope.$watch(() => this.type,
				(oldValue: string, newValue: string) => {
					if (oldValue !== newValue) {
						this.checkToggleEnabled();
					}
				});

			this._$scope.$watch(() => this.disabled,
				(oldValue: boolean, newValue: boolean) => {
					if (oldValue !== newValue) {
						this.checkDisabled();
					}
				});

			this._$scope.$watch(() => this.toggleEnabled,
				(oldValue: boolean, newValue: boolean) => {
					if (oldValue !== newValue) {
						this.checkToggleEnabled();
					}
				});
		}

		$postLink = () => {
			this.checkToggleEnabled();
		}

		private checkToggleEnabled(): void {
			if (this.type === 'toggle') {
				const hasClass: boolean = this.hasClass(this._classActive);
				if (this.toggleEnabled && !hasClass) {
					this.addClass(this._classActive);
				} else if (this.toggleEnabled === false && hasClass) {
					this.removeClass(this._classActive);
				}
			}
		}

		private checkDisabled(): void {
			const hasClass: boolean = this.hasClass(this._classDisabled);
			if (this.toggleEnabled && !hasClass) {
				this.addClass(this._classDisabled);
			} else if (this.toggleEnabled === false && hasClass) {
				this.removeClass(this._classDisabled);
			}
		}

		//public clickFunc(): void {
		//	if (this.type === 'toggle') {
		//		const validAction: boolean = this.btnClick();

		//		if (validAction) {
		//			const hasClassActive: boolean = this.hasClass(this._classActive);
		//			if (hasClassActive) {
		//				this.removeClass(this._classActive);
		//			} else {
		//				this.addClass(this._classActive);
		//			}
		//		}
		//	} else {
		//		this.btnClick();
		//	}
		//}

		private addClass(className: string): void {
			this._$timeout((): void => {
				$(`#${this.uniqueId}`).addClass(className);
			});
		}

		private hasClass(className: string): boolean {
			return $(`#${this.uniqueId}`).hasClass(className);
		}

		private removeClass(className: string): void {
			this._$timeout((): void => {
				$(`#${this.uniqueId}`).removeClass(className);
			});
		}
	}

	angular
		.module('LiveMonitor.Widgets')
		.component('toggleButton', new ToggleButtonComponent());
}