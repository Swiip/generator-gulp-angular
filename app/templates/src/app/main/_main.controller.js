(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('MainCtrl', MainCtrl);

  function MainCtrl($scope) {
    $scope.awesomeThings = <%= technologies %>;

    angular.forEach($scope.awesomeThings, function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }
})();
