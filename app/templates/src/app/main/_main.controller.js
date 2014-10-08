'use strict';

angular.module('<%= appname %>')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = <%= technologies %>;
    angular.forEach($scope.awesomeThings, function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  });
