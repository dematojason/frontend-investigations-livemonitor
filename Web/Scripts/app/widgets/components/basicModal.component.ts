((): void => {
	'use strict';

	angular.module('LiveMonitor.Widgets').controller('basicModalController',
		[
			'$scope', '$uibModalInstance', 'title', 'msgBody', 'confirmBtnText', 'denyBtnText',
			($scope, $uibModalInstance, title, msgBody, confirmBtnText, denyBtnText): void => {
				$scope.title = title;
				$scope.msgBody = msgBody;
				$scope.confirmBtnText = confirmBtnText;
				$scope.denyBtnText = denyBtnText;

				$scope.confirm = () => {
					$uibModalInstance.close();
				}

				$scope.deny = () => {
					$uibModalInstance.dismiss();
				}
			}
		]);
})();