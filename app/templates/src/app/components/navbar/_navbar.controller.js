(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('NavbarCtrl', NavbarCtrl);

  function NavbarCtrl($scope) {
    $scope.date = new Date();
  }
})();
