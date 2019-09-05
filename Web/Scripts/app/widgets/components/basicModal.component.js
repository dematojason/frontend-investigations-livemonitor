(function () {
    'use strict';
    angular.module('LiveMonitor.Widgets').controller('basicModalController', [
        '$scope', '$uibModalInstance', 'title', 'msgBody', 'confirmBtnText', 'denyBtnText',
        function ($scope, $uibModalInstance, title, msgBody, confirmBtnText, denyBtnText) {
            $scope.title = title;
            $scope.msgBody = msgBody;
            $scope.confirmBtnText = confirmBtnText;
            $scope.denyBtnText = denyBtnText;
            $scope.confirm = function () {
                $uibModalInstance.close();
            };
            $scope.deny = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
})();
//# sourceMappingURL=basicModal.component.js.map