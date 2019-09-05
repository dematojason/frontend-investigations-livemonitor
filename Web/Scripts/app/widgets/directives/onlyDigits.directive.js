(function () {
    'use strict';
    var OnlyDigits = /** @class */ (function () {
        function OnlyDigits(_$scope) {
            this._$scope = _$scope;
            this.restrict = 'A';
            this.require = '?ngModel';
            this.replace = true;
            this.link = function (scope, element, attrs, ngModelCtrl) {
                var fromUser = function (text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return null;
                };
                ngModelCtrl.$parsers.push(fromUser);
            };
            console.log(this._$scope);
        }
        OnlyDigits.factory = function () {
            var directive = function ($scope) { return new OnlyDigits($scope); };
            directive.$inject = ['$scope'];
            return directive;
        };
        OnlyDigits.$inject = ['$scope'];
        return OnlyDigits;
    }());
    angular
        .module('LiveMonitor.Widgets')
        .directive('lmOnlyDigits', OnlyDigits.factory());
})();
//# sourceMappingURL=onlyDigits.directive.js.map