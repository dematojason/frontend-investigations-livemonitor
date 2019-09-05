namespace LiveMonitor.Widgets {
	(() => {
		'use strict';

		angular.module('LiveMonitor.Widgets').filter('apin',
			() => {
				return (input) => {
					let result: string = '';

					if (CommonHelper.isDefinedNotWhitespace(input)) {
						result = FormatHelper.getApinFromPin(input);
					}

					return result;
				}
			});
	})();
}