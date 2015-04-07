'use strict';

class MainController {
  constructor ($scope) {
    $scope.awesomeThings = <%= technologies %>;
    $scope.awesomeThings.forEach(function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }
}

MainController.$inject = ['$scope'];

export default MainController;
