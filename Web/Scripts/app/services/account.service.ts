namespace LiveMonitor.Services {
	export interface IAccountService {
		authenticated(): ng.IPromise<boolean>;
		kineticLogin(token: string): ng.IPromise<LoginResponse>;
		login(username: string, password: string): ng.IPromise<LoginResponse>;
		logout(): ng.IPromise<any>;
		register(): ng.IPromise<any>;
		testAuth(): ng.IPromise<any>;
	}

	class AccountService implements IAccountService {
		private readonly _baseUri: string = '/api/account';


		static $inject = [
			'$http',
			'$window'
		];
		constructor(
			private readonly _$http: ng.IHttpService,
			private readonly _$window: ng.IWindowService
		) {
		}


		public authenticated(): ng.IPromise<boolean> {
			return this._$http.get(`${this._baseUri}/authenticated`)
				.then((response: any): boolean => {
					return response.data as boolean;
				});
		}

		public kineticLogin(token: string): ng.IPromise<LoginResponse> {
			const args: LoginArgs = new LoginArgs();
			args.token = token;

			return this._$http.post(`${this._baseUri}/kinetic-login`, args)
				.then((response: any): LoginResponse => {
					this._$window.localStorage.setItem('liveMonitor.loggedIn', 'true');
					return response.data as LoginResponse;
				});
		}

		public login(username: string, password: string): ng.IPromise<LoginResponse> {
			const args: LoginArgs = new LoginArgs();
			args.username = username;
			args.password = password;

			return this._$http.post(`${this._baseUri}/login`, args)
				.then((response: any): LoginResponse => {
					this._$window.localStorage.setItem('liveMonitor.loggedIn', 'true');
					return response.data as LoginResponse;
				});
		}

		public logout(): ng.IPromise<any> {
			return this._$http.post(`${this._baseUri}/logout`, null)
				.then((response: any): any => {
					this._$window.localStorage.setItem('liveMonitor.loggedIn', 'false');
					return response.data;
				});
		}

		public register(): ng.IPromise<any> {
			return this._$http.get(`${this._baseUri}/register`)
				.then((response: any): any => {
					return response.data;
				});
		}

		public testAuth(): ng.IPromise<any> {
			return this._$http.post(`${this._baseUri}/testauth`, null)
				.then((response: any): any => {
					return response.data;
				});
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.AccountService', AccountService);
}