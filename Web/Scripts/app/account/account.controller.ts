
interface IAccountScope {
	username: string;
	password: string;
	isLoading: boolean;

	login(): void;
	reset(): void;
}

namespace LiveMonitor.Account {
	export class AccountController implements IAccountScope {
		public username: string;
		public password: string;
		public isLoading: boolean = false;
		public showBob: boolean;
		public token: string;


		static $inject = [
			'LiveMonitor.Services.AccountService',
			'LiveMonitor.Services.NotifierService',
			'$window',
			'$timeout'
		];
		constructor(
			private readonly _accountService: Services.IAccountService,
			private readonly _notifier: Services.INotifierService,
			private readonly _$window: ng.IWindowService,
			private readonly _$timeout: ng.ITimeoutService
		) {
			this.reset();
		}

		$onInit = (): void => {
			//if (Math.floor(Math.random() * 2) === 1) {
			//	this.showBob = true;
			//}
			this.showBob = false;
		}

		$postLink = (): void => {
			if (CommonHelper.isDefined(this.token)) {
				this.isLoading = true;

				this._accountService.register()
					.then((): void => {
						this._accountService.kineticLogin(this.token)
							.then((result): void => {
								this.loginSuccess(result);
							}, (innerErr): void => {
								this.loginFail(innerErr);
							});
					}, (err): void => {
						this.loginFail(err);
					});
			}
		}


		public init(model: any): void {
			if (CommonHelper.isDefinedNotWhitespace(model)) {
				this.token = model;
			}
		}

		public login(): void {
			if (this.isLoading) {
				return;
			}

			this.isLoading = true;

			if (this.username !== '' && this.password !== '') {
				this._accountService.login(this.username, this.password)
					.then((result): void => {
						this.loginSuccess(result);
					}, (err): void => {
						this.loginFail(err);
					});
			}
		}

		private loginSuccess(result): void {
			// save in local storage for later use
			this._$window.localStorage.setItem("liveMonitor.isMilitaryDisplay", angular.toJson(result.isMilitaryDisplay));
			this._$window.localStorage.setItem("liveMonitor.permissions", angular.toJson(result.permissions));

			this.reset();

			this._$timeout((): void => {
				this._$window.location.assign('/#!/circuits');
			}, 2000);
		}

		private loginFail(err): void {
			switch (err.status) {
				case HttpStatusCode.UNAUTHORIZED:
					this._notifier.warning('Incorrect username and/or password');
					break;
				default:
					console.log(err);
					this._notifier.error('An unexpected error occurred while attempting to login', 'Application Error');
					break;
			}

			this.isLoading = false;
		}

		public reset(): void {
			this.username = "";
			this.password = "";
		}
	}

	angular
		.module('LiveMonitor.Account')
		.controller('AccountController', AccountController);
}