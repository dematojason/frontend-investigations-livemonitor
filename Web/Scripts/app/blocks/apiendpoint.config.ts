((): void => {
	'use strict';

	angular
		.module('LiveMonitor.Blocks')
		.config(config);

	config.$inject = ['LiveMonitor.Blocks.ApiEndpointProvider'];

	function config(apiEndpointProvider: LiveMonitor.Blocks.IApiEndpointProvider): void {
		apiEndpointProvider.configure('/api');
	}
})();