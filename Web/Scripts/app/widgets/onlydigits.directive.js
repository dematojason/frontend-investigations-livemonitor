(() => {
    'use strict';
    class OnlyDigits {
        constructor(_$scope) {
            this._$scope = _$scope;
            this.restrict = 'A';
            this.require = '?ngModel';
            this.replace = true;
            this.link = (scope, element, attrs, ngModelCtrl) => {
                var fromUser = (text) => {
                    if (text) {
                        const transformedInput = text.replace(/[^0-9]/g, '');
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
        static factory() {
            const directive = ($scope) => new OnlyDigits($scope);
            directive.$inject = ['$scope'];
            return directive;
        }
    }
    OnlyDigits.$inject = ['$scope'];
    angular
        .module('LiveMonitor.Widgets')
        .directive('lmOnlyDigits', OnlyDigits.factory());
})();
//# sourceMappingURL=onlydigits.directive.js.map