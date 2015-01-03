angular.module '<%= appName %>'
  .controller 'MainCtrl', <[ $scope ]> ++ ($scope) ->
    $scope.awesome-things = <%= technologies %>
    angular.for-each $scope.awesome-things, (awesome-thing) !->
      awesome-thing.rank = Math.random!
