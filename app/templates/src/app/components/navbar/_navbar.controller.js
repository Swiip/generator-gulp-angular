'use strict';

angular.module('<%= appName %>')
  .controller('NavbarCtrl', function ($scope) {
    $scope.date = new Date();
  });
