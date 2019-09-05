var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        var ToggleButtonComponent = /** @class */ (function () {
            function ToggleButtonComponent() {
                this.bindings = {
                    btnClick: '&',
                    imgSrc: '@',
                    titleText: '@',
                    toggleEnabled: '<?',
                    type: '@?'
                };
                this.controller = ToggleButtonController;
                this.controllerAs = 'vm';
                this.templateUrl = 'Templates/components/toggleButton.html';
            }
            return ToggleButtonComponent;
        }());
        var ToggleButtonController = /** @class */ (function () {
            function ToggleButtonController(_$scope, _$timeout) {
                var _this = this;
                this._$scope = _$scope;
                this._$timeout = _$timeout;
                this._def = {
                    disabled: false
                };
                this._classActive = 'active';
                this._classDisabled = 'disabled';
                this.$postLink = function () {
                    _this.checkToggleEnabled();
                };
                //const id: number = CommonHelper.getUniqueId(UniqueIdType.ACTIVE_BUTTON);
                //this.uniqueId = `toggleButton${id}`;
                this.uniqueId = "toggleButton" + LiveMonitor.CommonHelper.getUniqueId(LiveMonitor.UniqueIdType.ACTIVE_BUTTON);
                this.disabled = this._def.disabled;
                this._$scope.$watch(function () { return _this.type; }, function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        _this.checkToggleEnabled();
                    }
                });
                this._$scope.$watch(function () { return _this.disabled; }, function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        _this.checkDisabled();
                    }
                });
                this._$scope.$watch(function () { return _this.toggleEnabled; }, function (oldValue, newValue) {
                    if (oldValue !== newValue) {
                        _this.checkToggleEnabled();
                    }
                });
            }
            ToggleButtonController.prototype.checkToggleEnabled = function () {
                if (this.type === 'toggle') {
                    var hasClass = this.hasClass(this._classActive);
                    if (this.toggleEnabled && !hasClass) {
                        this.addClass(this._classActive);
                    }
                    else if (this.toggleEnabled === false && hasClass) {
                        this.removeClass(this._classActive);
                    }
                }
            };
            ToggleButtonController.prototype.checkDisabled = function () {
                var hasClass = this.hasClass(this._classDisabled);
                if (this.toggleEnabled && !hasClass) {
                    this.addClass(this._classDisabled);
                }
                else if (this.toggleEnabled === false && hasClass) {
                    this.removeClass(this._classDisabled);
                }
            };
            //public clickFunc(): void {
            //	if (this.type === 'toggle') {
            //		const validAction: boolean = this.btnClick();
            //		if (validAction) {
            //			const hasClassActive: boolean = this.hasClass(this._classActive);
            //			if (hasClassActive) {
            //				this.removeClass(this._classActive);
            //			} else {
            //				this.addClass(this._classActive);
            //			}
            //		}
            //	} else {
            //		this.btnClick();
            //	}
            //}
            ToggleButtonController.prototype.addClass = function (className) {
                var _this = this;
                this._$timeout(function () {
                    $("#" + _this.uniqueId).addClass(className);
                });
            };
            ToggleButtonController.prototype.hasClass = function (className) {
                return $("#" + this.uniqueId).hasClass(className);
            };
            ToggleButtonController.prototype.removeClass = function (className) {
                var _this = this;
                this._$timeout(function () {
                    $("#" + _this.uniqueId).removeClass(className);
                });
            };
            // lm-btn-toggle
            // lm-btn-standard
            ToggleButtonController.$inject = [
                '$scope',
                '$timeout'
            ];
            return ToggleButtonController;
        }());
        angular
            .module('LiveMonitor.Widgets')
            .component('toggleButton', new ToggleButtonComponent());
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=toggleButton.component.js.map