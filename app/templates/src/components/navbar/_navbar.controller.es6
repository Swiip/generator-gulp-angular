'use strict';

class NavbarCtrl {
  constructor ($scope) {
    $scope.date = new Date();
  }
}

NavbarCtrl.$inject = ['$scope'];

export default NavbarCtrl;
