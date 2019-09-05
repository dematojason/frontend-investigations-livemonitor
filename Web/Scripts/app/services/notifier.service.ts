namespace LiveMonitor.Services {
	export interface INotifierService {
		error(message: string, title?: string, options?: IToastOptions): IToast;
		info(message: string, title?: string, options?: IToastOptions): IToast;
		success(message: string, title?: string, options?: IToastOptions): IToast;
		warning(message: string, title?: string, options?: IToastOptions): IToast;
	}

	class NotifierService implements INotifierService {
		static $inject = [
			'toastr'
		];
		constructor(
			private readonly _toastr: IToastrService
		) {

		}

		public error(message: string, title?: string, options?: IToastOptions): IToast {
			return this._toastr.error(message, title, options);
		}

		public info(message: string, title?: string, options?: IToastOptions): IToast {
			return this._toastr.info(message, title, options);
		}

		public success(message: string, title?: string, options?: IToastOptions): IToast {
			return this._toastr.success(message, title, options);
		}

		public warning(message: string, title?: string, options?: IToastOptions): IToast {
			return this._toastr.warning(message, title, options);
		}
	}

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.NotifierService', NotifierService);
}