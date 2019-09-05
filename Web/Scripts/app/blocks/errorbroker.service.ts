module ALiveMonitorpp.Blocks {
	'use strict';

	export interface IErrorLogger {
		log(error: string): void;
	}

	export interface IErrorBroker {
		log(error: string): void;
		registerLogger(errorLogger: IErrorLogger): void;
	}

	class ErrorBroker implements IErrorBroker {
		log(error: string): void {
			throw new Error("Method not implemented");
		}

		registerLogger(errorLogger: IErrorLogger): void {
			throw new Error("Method not implemented");
		}
	}

	angular
		.module('LiveMonitor.Blocks')
		.service('LiveMonitor.Blocks.ErrorBroker', ErrorBroker);
}