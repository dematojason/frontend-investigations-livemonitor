((): void => {
	'use strict';

	angular
		.module('LiveMonitor.Circuits')
		.config(config);

	config.$inject = ['$provide'];
	function config($provide: ng.auto.IProvideService): void {
		$provide.decorator('$log', extendLog);
	}

	extendLog.$inject = ['$delegate'];
	function extendLog($delegate: any): ng.ILogService {
		const debugFunc = $delegate.debug;
		$delegate.debug = (...args: any[]): void => {
			var now = (new Date()).toLocaleTimeString();
			args[0] = `${now} - ${args[0]}`;
			debugFunc.apply(null, args);
		};
		return $delegate;
	}
})();