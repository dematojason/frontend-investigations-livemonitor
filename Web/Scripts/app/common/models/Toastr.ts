namespace LiveMonitor {
	export interface IToastBaseConfig {
		allowHtml?: boolean;
		closeButton?: boolean;
		closeHtml?: string;
		extendedTimeOut?: number;
		messageClass?: string;
		onHidden?: Function;
		onShown?: Function;
		onTap?: Function;
		progressBar?: boolean;
		tapToDismiss?: boolean;
		templates?: {
			toast?: string;
			progressbar?: string;
		};
		timeOut?: number;
		titleClass?: string;
		toastClass?: string;
	}

	export interface IToastContainerConfig {
		autoDismiss?: boolean;
		containerId?: string;
		maxOpened?: number;
		newestOnTop?: boolean;
		positionClass?: string;
		preventDuplicates?: boolean;
		preventOpenDuplicates?: boolean;
		target?: string;
	}

	export interface IToastConfig extends IToastBaseConfig {
		iconClasses?: {
			error?: string;
			info?: string;
			success?: string;
			warning?: string;
		};
	}

	export interface IToastrConfig extends IToastContainerConfig, IToastConfig { }

	export interface IToastScope extends angular.IScope {
		message: string;
		options: IToastConfig;
		title: string;
		toastId: number;
		toastType: string;
	}

	export interface IToast {
		el: angular.IAugmentedJQuery;
		iconClass: string;
		isOpened: boolean;
		open: angular.IPromise<any>;
		scope: IToastScope;
		toastId: number;
	}

	export interface IToastOptions extends IToastBaseConfig {
		iconClass?: string;
		target?: string;
	}

	export interface IToastrService {
		/**
		 * Return the number of active toasts in screen.
		 */
		active(): number;
		/**
		 * Remove toast from screen. If no toast is passed in, all toasts will be closed.
		 *
		 * @param {IToast} toast Optional toast object to delete
		 */
		clear(toast?: IToast): void;
		/**
		 * Create error toast notification message.
		 *
		 * @param {String} message Message to show on toast
		 * @param {String} title Title to show on toast
		 * @param {IToastOptions} options Override default toast options
		 */
		error(message: string, title?: string, options?: IToastOptions): IToast;
		/**
		 * Create info toast notification message.
		 *
		 * @param {String} message Message to show on toast
		 * @param {String} title Title to show on toast
		 * @param {IToastOptions} options Override default toast options
		 */
		info(message: string, title?: string, options?: IToastOptions): IToast;
		/**
		 * Create success toast notification message.
		 *
		 * @param {String} message Message to show on toast
		 * @param {String} title Title to show on toast
		 * @param {IToastOptions} options Override default toast options
		 */
		success(message: string, title?: string, options?: IToastOptions): IToast;
		/**
		 * Create warning toast notification message.
		 *
		 * @param {String} message Message to show on toast
		 * @param {String} title Title to show on toast
		 * @param {IToastOptions} options Override default toast options
		 */
		warning(message: string, title?: string, options?: IToastOptions): IToast;
	}
}