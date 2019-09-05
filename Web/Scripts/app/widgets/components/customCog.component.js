var LiveMonitor;
(function (LiveMonitor) {
    var Widgets;
    (function (Widgets) {
        (function () {
            'use strict';
            angular.module('LiveMonitor.Widgets').component('customCog', {
                bindings: {
                    imgSrc: '@?'
                },
                controller: ['$scope', '$timeout', customCogController],
                controllerAs: 'vm',
                templateUrl: 'Templates/components/customCog.html'
            });
            function customCogController($scope, $timeout) {
                var vm = this;
                // Private Variables
                var id = '#customLoadingImg';
                // Public Functions
                vm.$onInit = function () {
                    loop();
                };
                function loop() {
                    $({ deg: 0 }).animate({ deg: 360 }, {
                        duration: 5000, easing: 'linear',
                        step: function (now) {
                            $(id).css({ transform: 'rotate(' + now + 'deg)' });
                        },
                        complete: function () {
                            loop();
                        }
                    });
                }
            }
        })();
    })(Widgets = LiveMonitor.Widgets || (LiveMonitor.Widgets = {}));
})(LiveMonitor || (LiveMonitor = {}));
//# sourceMappingURL=customCog.component.js.map