namespace LiveMonitor.Widgets {
	(() => {
		'use strict';

		angular.module('LiveMonitor.Widgets').filter('phoneNumber',
			() => {
				return (input) => {
					let result: string = '';

					if (CommonHelper.isDefinedNotWhitespace(input)) {
						result = FormatHelper.getPhoneDisplay(input);
					}

					return result;
				}
			});
	})();
}