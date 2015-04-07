angular.module "<%= appName %>"
  .controller "MainController", ($scope) ->
    $scope.awesomeThings = <%= technologies %>
    angular.forEach $scope.awesomeThings, (awesomeThing) ->
      awesomeThing.rank = Math.random()
