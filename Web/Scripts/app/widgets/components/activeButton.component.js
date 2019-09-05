var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var ActiveButtonComponent = /** @class */ (function () {
            function ActiveButtonComponent() {
                this.bindings = {
                    btnClick: '&',
                    imgSrc: '@',
                    titleText: '@',
                    toggleEnabled: '<?'
                };
                this.controller = ActiveButtonController;
                this.controllerAs = 'vm';
                this.templateUrl = 'Templates/components/activeButton.html';
            }
            return ActiveButtonComponent;
        }());
        var ActiveButtonController = /** @class */ (function () {
            function ActiveButtonController(_$timeout) {
                //this.imgSrc = '';
                //this.titleText = '';
                //this.toggleEnabled = false;
                this._$timeout = _$timeout;
                this.uniqueId = "activeButton" + LiveMonitor.CommonHelper.getUniqueId(LiveMonitor.UniqueIdType.ACTIVE_BUTTON);
            }
            ActiveButtonController.prototype.$onChanges = function (changes) {
                if (changes.toggleEnabled !== null && changes.toggleEnabled !== undefined) {
                    if (changes.toggleEnabled.currentValue === true && !this.isBtnActive()) {
                        this.setBtnActive();
                    }
                    else if (changes.toggleEnabled.currentValue === false && this.isBtnActive()) {
                        this.setBtnInactive();
                    }
                }
            };
            ActiveButtonController.prototype.clickFunc = function () {
                var validAction = this.btnClick();
                if (validAction) {
                    if (this.isBtnActive()) {
                        this.setBtnInactive();
                    }
                    else {
                        this.setBtnActive();
                    }
                }
            };
            ActiveButtonController.prototype.isBtnActive = function () {
                return $("#" + this.uniqueId).hasClass('active');
            };
            ActiveButtonController.prototype.setBtnActive = function () {
                var _this = this;
                this._$timeout(function () {
                    $("#" + _this.uniqueId).addClass('active');
                }, 10);
            };
            ActiveButtonController.prototype.setBtnInactive = function () {
                var _this = this;
                this._$timeout(function () {
                    $("#" + _this.uniqueId).removeClass('active');
                }, 10);
            };
            ActiveButtonController.$inject = [
                '$timeout'
            ];
            return ActiveButtonController;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .component('activeButton', new ActiveButtonComponent());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=activeButton.component.js.map