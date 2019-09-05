namespace LiveMonitor.Services {
	'use strict';

	export interface ILogService {
		/**
		 * Check if ProdigyUtilityApi Service is available.
		 */
		isAlive(): ng.IPromise<boolean>;
		/**
		 * Log an error message.
		 * @param msg short description.
		 * @param data [Optional] additional data.
		 * @param url [Optional] The URL where the message originated.
		 */
		logError(msg: string, data?: any, url?: string): ng.IPromise<void>;
		/**
		 * Log non-error information.
		 * @param msg short description.
		 * @param data [Optional] additional data.
		 * @param url [Optional] The URL where the message originated.
		 */
		logInfo(msg: string, data?: any, url?: string): ng.IPromise<void>;
		/**
		 * Log a warning message.
		 * @param msg short description.
		 * @param data [Optional] additional data.
		 * @param url [Optional] The URL where the message originated.
		 */
		logWarning(msg: string, data?: any, url?: string): ng.IPromise<void>;
		/**
		 * Log a critical error message.
		 * @param msg short description.
		 * @param data [Optional] additional data.
		 * @param url [Optional] The URL where the message originated.
		 */
		logCritical(msg: string, data?: any, url?: string): ng.IPromise<void>;
		/**
		 * Log a security error message.
		 * @param msg short description.
		 * @param data [Optional] additional data.
		 * @param url [Optional] The URL where the message originated.
		 */
		logSecurity(msg: string, data?: any, url?: string): ng.IPromise<void>;
		/**
		 * Log a message.
		 * @param logLevel The logging type.
		 * @param msg short description.
		 * @param data [Optional] additional data.
		 * @param url [Optional] The URL where the message originated.
		 */
		log(logLevel: LogLevel, msg: string, data?: any, url?: string): ng.IPromise<void>;
		/**
		 * Log a message.
		 * @param args An object containing the information to be logged.
		 */
		sendLog(args: LoggingArgs): ng.IPromise<void>;
	}

	class LogService implements ILogService {
		private readonly _baseUri: string = '/api/log';

		static $inject = [
			'$http',
			'$window'
		];
		constructor(
			private readonly _$http: ng.IHttpService,
			private readonly _$window: ng.IWindowService
		) { }

		public isAlive(): ng.IPromise<boolean> {
			return this._$http.get(`${this._baseUri}/IsAlive`)
				.then((): boolean => {
					return true;
				}, (): boolean => {
					return false;
				});
		}

		public logError(msg: string, data?: any, url?: string): ng.IPromise<void> {
			const args: LoggingArgs = new LoggingArgs(this._$window, "Error", msg, data, url);
			return this.sendLog(args);
		}

		public logInfo(msg: string, data?: any, url?: string): ng.IPromise<void> {
			const args: LoggingArgs = new LoggingArgs(this._$window, "Info", msg, data, url);
			return this.sendLog(args);
		}

		public logWarning(msg: string, data?: any, url?: string): ng.IPromise<void> {
			const args: LoggingArgs = new LoggingArgs(this._$window, "Warning", msg, data, url);
			return this.sendLog(args);
		}

		public logCritical(msg: string, data?: any, url?: string): ng.IPromise<void> {
			const args: LoggingArgs = new LoggingArgs(this._$window, "Critical", msg, data, url);
			return this.sendLog(args);
		}

		public logSecurity(msg: string, data?: any, url?: string): ng.IPromise<void> {
			const args: LoggingArgs = new LoggingArgs(this._$window, "Error", msg, data, url);
			return this.sendLog(args);
		}

		public log(logLevel: LogLevel, msg: string, data?: any, url?: string): ng.IPromise<void> {
			const args: LoggingArgs = new LoggingArgs(this._$window, logLevel, msg, data, url);
			return this.sendLog(args);
		}

		public sendLog(args: LoggingArgs): ng.IPromise<void> {
			return this._$http.post(`${this._baseUri}/write`, args)
				.then((response: ng.IHttpPromiseCallbackArg<any>): void => {
					return response.data;
				});
		}
	}

	export class LoggingArgs {
		public applicationName: string = Constants.applicationName;
		public url: string;
		public userAgent: string;
		public logLevel: LogLevel = "Error";
		public shortDescription: string | null;
		public data: string | null;

		constructor($window: ng.IWindowService, logLevel: LogLevel, msg: string, data?: any, url?: string) {
			if (url !== null && url !== undefined && url !== '') {
				this.url = url;
			} else {
				this.url = $window.location.href;
			}

			const clientInfo: ClientInfo = new ClientInfo();
			this.userAgent = `${clientInfo.browserName} v${clientInfo.browserVersion} | ${clientInfo.osName} v${clientInfo.osVersion}`;

			this.shortDescription = msg;

			this.data = data;
			this.logLevel = logLevel;
		}
	}

	export type LogLevel = "Critical" | "Error" | "Warning" | "Info";

	angular
		.module('LiveMonitor.Services')
		.service('LiveMonitor.Services.LogService', LogService);
}