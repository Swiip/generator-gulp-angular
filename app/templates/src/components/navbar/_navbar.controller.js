(function () {
    'use strict';

    function NavbarCtrl($scope) {
        $scope.date = new Date();
    }

    angular
        .module('<%= appName %>')
        .controller('NavbarCtrl', NavbarCtrl);
})();
