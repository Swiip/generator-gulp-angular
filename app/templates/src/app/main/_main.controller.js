(function () {
    'use strict';

    function MainCtrl($scope) {        
        $scope.awesomeThings = <%= technologies %>;
        angular.forEach($scope.awesomeThings, function(awesomeThing) {
          awesomeThing.rank = Math.random();
        });     
    }

    angular
        .module('<%= appName %>')
        .controller('MainCtrl', MainCtrl);
})();