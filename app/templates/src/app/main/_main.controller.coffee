angular.module "<%= appName %>"
  .controller "MainCtrl", ($scope) ->
    $scope.awesomeThings = <%= technologies %>
    angular.forEach $scope.awesomeThings, (awesomeThing) ->
      awesomeThing.rank = Math.random()
