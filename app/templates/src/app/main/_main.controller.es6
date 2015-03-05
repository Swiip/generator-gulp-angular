'use strict';

class MainCtrl {
  constructor ($scope) {
    $scope.awesomeThings = <%= technologies %>;
    $scope.awesomeThings.forEach(function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }
}

MainCtrl.$inject = ['$scope'];

export default MainCtrl;
