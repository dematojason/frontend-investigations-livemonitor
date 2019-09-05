var LiveMonitor;
(function (LiveMonitor) {
    var Services;
    (function (Services) {
        var BasicModalService = /** @class */ (function () {
            function BasicModalService(_$uibModal) {
                this._$uibModal = _$uibModal;
            }
            BasicModalService.prototype.showModal = function (title, msgBody, confirmBtnText, denyBtnText) {
                var confirmText = confirmBtnText;
                var denyText = denyBtnText;
                if (confirmBtnText === null || confirmBtnText === undefined) {
                    confirmText = 'OK';
                }
                if (denyBtnText === null || denyBtnText === undefined) {
                    denyText = 'Cancel';
                }
                var modalInstance = this._$uibModal.open({
                    templateUrl: 'Templates/components/basicModal.html',
                    controller: 'basicModalController',
                    size: 'md',
                    resolve: {
                        title: function () { return title; },
                        msgBody: function () { return msgBody; },
                        confirmBtnText: function () { return confirmText; },
                        denyBtnText: function () { return denyText; }
                    }
                });
                return modalInstance;
            };
            BasicModalService.$inject = ['$uibModal'];
            return BasicModalService;
        }());
        angular
            .module('LiveMonitor.Services')
            .service('LiveMonitor.Services.BasicModalService', BasicModalService);
    })(Services = LiveMonitor.Services || (LiveMonitor.Services = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=modal.service.js.map